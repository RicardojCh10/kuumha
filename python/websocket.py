import asyncio
import websockets
import mysql.connector
import serial
from datetime import datetime  # Importa datetime

async def handle_client(websocket, path):
    ser = serial.Serial('COM6', 9600)  # Ajusta el puerto COM según sea necesario

    conexion = mysql.connector.connect(
        host='mysql-geovani.alwaysdata.net',
        user='geovani',
        password='AmericazUT',
        database='geovani_project_water'
    )

    mi_cursor = conexion.cursor()

    tds = None  # Inicializar tds y distancia como None
    distancia = None

    try:
        while True:
            if ser.in_waiting > 0:
                linea = ser.readline().decode('utf-8').rstrip()
                if "TDS:" in linea:
                    tds = linea.split(":")[1].strip().split(" ")[0]
                elif "Distancia:" in linea:
                    distancia = linea.split(":")[1].strip().split(" ")[0]
                    
                if tds is not None and distancia is not None:
                    fecha_actual = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # Formato de fecha y hora
                    query = "INSERT INTO sensor (sensor_nivel, sensor_calidad, fecha) VALUES (%s, %s, %s)"
                    valores = (distancia, tds, fecha_actual)
                    try:
                        mi_cursor.execute(query, valores)
                        conexion.commit()
                        print(f"Datos insertados: Distancia - {distancia} cm, TDS - {tds} ppm, Fecha - {fecha_actual}")
                        tds = None  # Resetear las variables después de la inserción
                        distancia = None
                    except mysql.connector.Error as e:
                        print(f"Error al insertar en la base de datos: {e}")
    except KeyboardInterrupt:
        print("Programa interrumpido por el usuario")
    except mysql.connector.Error as err:
        print(f"Error en la base de datos: {err}")
    except serial.SerialException as e:
        print(f"Error en la conexión serial: {e}")
    finally:
        if conexion.is_connected():
            mi_cursor.close()
            conexion.close()
        ser.close()
        print("Conexión cerrada")

async def start_server():
    server = await websockets.serve(handle_client, "localhost", 8765)
    try:
        await server.wait_closed()
    except KeyboardInterrupt:
        pass

if __name__ == "__main__":
    asyncio.run(start_server())
