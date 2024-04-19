import React, { useEffect, useState } from 'react';
import { FiHome, FiUser, FiBell } from 'react-icons/fi';

function Test() {
  const [sensorData, setSensorData] = useState([]);
  const [waterLevel, setWaterLevel] = useState(0); // Estado para el nivel de agua
  const maxWaterLevel = 20; // Altura máxima del agua en cm

  useEffect(() => {
    let ws = new WebSocket('ws://localhost:8765');

    const connectWebSocket = () => {
      ws = new WebSocket('ws://localhost:8765');

      ws.onopen = function () {
        console.log('Conexión WebSocket establecida');
      };

      ws.onmessage = function (event) {
        console.log('Mensaje recibido:', event.data);
        try {
          const data = JSON.parse(event.data);
          // Validar que los datos tienen los campos necesarios antes de agregarlos
          if (data.distancia && data.tds && data.fecha) {
            setSensorData(prevData => [...prevData, data]);
            // Actualizar el nivel de agua basado en los datos de distancia (por ejemplo)
            setWaterLevel(data.distancia > maxWaterLevel ? maxWaterLevel : data.distancia); // Limitar a la altura máxima
          } else {
            console.error('Los datos recibidos no son válidos:', data);
          }
        } catch (error) {
          console.error('Error al parsear los datos JSON:', error);
        }
      };

      ws.onerror = function (error) {
        console.error('Error en la conexión:', error.message);
        ws.close();
      };

      ws.onclose = function (event) {
        if (!event.wasClean) {
          console.log('Conexión cerrada de forma inesperada');
          console.error('Código de cierre:', event.code);
          // Limitar los intentos de reconexión para evitar bucles infinitos
          if (event.code !== 1000) { // No reconectar si la conexión se cerró de forma limpia (1000)
            setTimeout(connectWebSocket, 1000); // Intentar reconexión después de 1 segundo
          }
        }
      };
    };

    connectWebSocket();

    return () => {
      ws.close();
    };
  }, []);

  return (
    <>
      <div className="flex flex-col h-screen text-black bg-white">
        <header className="flex items-center justify-between p-4 bg-blue-800">
          <h1 className="text-xl font-bold">KUUMHA CONTROL DE</h1>
          <div className="flex items-center">
            <FiBell className="ml-4 text-2xl" />
          </div>
        </header>
        <div className="flex flex-1">
          <nav className="flex flex-col items-center w-16 py-4 bg-blue-800">
            <div className="mb-8">
              <FiHome className="text-2xl" />
              <span href="/test" className="mt-2 text-xs">HOME</span>
            </div>
            <div>
              <FiUser className="text-2xl" />
              <span href="/perfil" className="mt-2 text-xs">PROFILE</span>
            </div>
          </nav>
          <main className="flex-1 p-8">
            <div className="flex p-6 text-black bg-gray-300 rounded-lg shadow-lg">
              {/* Tarjeta izquierda: SVG del tinaco */}
              <div className="w-1/2 pr-4">
                <h1 className="mb-4 text-xl font-bold">Nivel de agua</h1>
                <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                  {/* Tinaco exterior */}
                  <rect x="50" y="50" width="300" height="200" rx="20" ry="20" fill="none" stroke="blue" strokeWidth="5" />
                  {/* Forma de la cisterna */}
                  <path d="M150,50 Q150,10 250,10 Q350,10 250,50 Z" fill="none" stroke="blue" strokeWidth="5" />
                  {/* Rectángulo interno que representará el agua */}
                  <rect x="55" y={250 - (waterLevel * (200 / maxWaterLevel))} width="290" height={waterLevel * (200 / maxWaterLevel)} rx="10" ry="10" fill="url(#gradienteAgua)" />
                  {/* Definición del gradiente */}
                  <defs>
                    <linearGradient id="gradienteAgua" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#0074D9', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#0074D9', stopOpacity: 0.3 }} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              {/* Tarjeta derecha: información del sensor */}
              <div className="w-1/2 pl-4">
                <h1 className="mb-4 text-xl font-bold">Datos del sensor</h1>
                {/* Lista de datos del sensor */}
                {sensorData.map((data, index) => (
                  <div key={index} className="my-4">
                    <div className="p-4 bg-gray-200 rounded-lg shadow-lg">
                      <h2 className="mb-2 text-xl font-bold">Lectura #{index + 1}</h2>
                      <p><span className="font-bold">Distancia:</span> {data.distancia} cm</p>
                      <p><span className="font-bold">TDS:</span> {data.tds} ppm</p>
                      <p><span className="font-bold">Fecha:</span> {data.fecha}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default Test;
