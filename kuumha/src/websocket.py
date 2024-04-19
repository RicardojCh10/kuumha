import asyncio
import websockets
import mysql.connector
import serial
import json
from datetime import datetime

async def handle_client(websocket, path):
    print("Conexión WebSocket establecida")

    try:
        ser = serial.Serial('COM5', 9600)
    except serial.SerialException as e:
        print(f"Error en la conexión serial: {e}")
        return

    conexion = mysql.connector.connect(
        host='localhost',
        user='root',
        password='',
        database='geovani_project_water'
    )
    print("Conexión a la base de datos establecida")

    mi_cursor = conexion.cursor()

    try:
        while True:
            if ser.in_waiting > 0:
                linea = ser.readline().decode('utf-8').rstrip()
                print(f"Dato recibido del puerto serial: {linea}")
                if "TDS:" in linea:
                    tds = linea.split(":")[1].strip().split(" ")[0]
                elif "Distancia:" in linea:
                    distancia = linea.split(":")[1].strip().split(" ")[0]
                    
                if 'tds' in locals() and 'distancia' in locals():
                    fecha_actual = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    query = "INSERT INTO sensor (sensor_nivel, sensor_calidad, fecha) VALUES (%s, %s, %s)"
                    valores = (distancia, tds, fecha_actual)
                    try:
                        mi_cursor.execute(query, valores)
                        conexion.commit()
                        print(f"Datos insertados en la base de datos: Distancia - {distancia} cm, TDS - {tds} ppm, Fecha - {fecha_actual}")

                        data = {
                            'distancia': distancia,
                            'tds': tds,
                            'fecha': fecha_actual
                        }
                        await websocket.send(json.dumps(data))
                        print("Datos enviados por WebSocket")

                        if int(distancia) >= 20:
                            await websocket.send("max_water_level")
                            print("¡El nivel de agua ha alcanzado el máximo!")

                    except mysql.connector.Error as e:
                        print(f"Error al insertar en la base de datos: {e}")
            await asyncio.sleep(0.1)
    except websockets.exceptions.ConnectionClosedOK:
        print("Conexión WebSocket cerrada por el cliente")
    except KeyboardInterrupt:
        print("Programa interrumpido por el usuario")
    except mysql.connector.Error as err:
        print(f"Error en la base de datos: {err}")
    finally:
        if conexion.is_connected():
            mi_cursor.close()
            conexion.close()
        ser.close()
        print("Conexiones cerradas")

async def start_server():
    server = await websockets.serve(handle_client, "localhost", 8765)
    try:
        await server.wait_closed()
    except asyncio.CancelledError:
        pass
    except Exception as e:
        print(f"Ocurrió un error en el servidor WebSocket: {e}")

if __name__ == "__main__":
    try:
        asyncio.run(start_server())
    except KeyboardInterrupt:
        print("El programa ha sido interrumpido por el usuario")
    except Exception as e:
        print(f"Ocurrió un error: {e}")
