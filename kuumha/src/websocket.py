import asyncio
import serial
import websockets
import mysql.connector
from datetime import datetime

db_config = {
    'host': 'mysql-geovani.alwaysdata.net',
    'user': 'geovani',
    'password': 'AmericazUT',
    'database': 'geovani_project_water'
}

async def send_distance_data(websocket, path):
    try:
        ser = serial.Serial('COM7', 9600)  # Ajusta el nombre del puerto según tu configuración
        ser.flush()
        
        conexion = mysql.connector.connect(**db_config)
        cursor = conexion.cursor()

        while True:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8').rstrip()
                data = line.split(',')
                if len(data) == 2 and data[0].startswith('TDS:') and data[1].startswith('Distancia:'):
                    tds = data[0].split(':')[1].strip()
                    distancia = data[1].split(':')[1].strip()
                    fecha_actual = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    
                    query = "INSERT INTO sensor (sensor_nivel, sensor_calidad, fecha) VALUES (%s, %s, %s)"
                    valores = (distancia, tds, fecha_actual)
                    cursor.execute(query, valores)
                    conexion.commit()
                    
                    await websocket.send(line)
    except serial.SerialException as e:
        print("Error en la comunicación serial:", e)
    except mysql.connector.Error as e:
        print("Error en la base de datos:", e)
    except Exception as e:
        print("Error inesperado:", e)
    finally:
        if 'ser' in locals():
            ser.close()
        if conexion.is_connected():
            cursor.close()
            conexion.close()

async def main():
    start_server = await websockets.serve(send_distance_data, "localhost", 8765)
    await start_server.wait_closed()

# Crear un nuevo bucle de eventos
loop = asyncio.get_event_loop()
# Ejecutar el bucle de eventos
loop.run_until_complete(main())
