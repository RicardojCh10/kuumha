import asyncio
import serial
import websockets

async def send_distance_data(websocket, path):
    try:
        ser = serial.Serial('COM7', 9600)  # Ajusta el nombre del puerto según tu configuración
        ser.flush()
        while True:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8').rstrip()
                await websocket.send(line)
    except serial.SerialException as e:
        print("Error en la comunicación serial:", e)
    except Exception as e:
        print("Error inesperado:", e)
    finally:
        if 'ser' in locals():
            ser.close()

async def main():
    start_server = await websockets.serve(send_distance_data, "localhost", 8765)
    await start_server.wait_closed()

# Crear un nuevo bucle de eventos
loop = asyncio.get_event_loop()
# Ejecutar el bucle de eventos
loop.run_until_complete(main())
