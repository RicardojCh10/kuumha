import React, { useEffect, useState } from 'react';
import { FiHome, FiUser, FiBell } from 'react-icons/fi';

function Test() {
  const [sensorData, setSensorData] = useState([]);
  const [waterLevel, setWaterLevel] = useState(0); // Estado para el nivel de agua
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar la modal

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
          if (data.distancia && data.tds && data.fecha) {
            setSensorData(prevData => [...prevData, data]);
            const level = Math.min(data.distancia, 20); // Limitar el nivel máximo a 20
            setWaterLevel(level);
            if (level >= 20) {
              setShowModal(true); // Mostrar la modal si el nivel supera los 20 cm
              ws.close(); // Cerrar la conexión del WebSocket
            }
          } else {
            console.error('Los datos recibidos no son válidos:', event.data);
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
          if (event.code !== 1000) {
            setTimeout(connectWebSocket, 1000);
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
              <div className="w-1/2 pr-4">
                <h1 className="mb-4 text-xl font-bold">Nivel de agua</h1>
                <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                  <rect x="50" y="50" width="300" height="200" rx="20" ry="20" fill="none" stroke="blue" strokeWidth="5" />
                  <path d="M150,50 Q150,10 250,10 Q350,10 250,50 Z" fill="none" stroke="blue" strokeWidth="5" />
                  <rect x="55" y={250 - waterLevel * 10} width="290" height={waterLevel * 10} rx="10" ry="10" fill="url(#gradienteAgua)" />
                  <defs>
                    <linearGradient id="gradienteAgua" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#0074D9', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#0074D9', stopOpacity: 0.3 }} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* Modal para la advertencia */}
      {showModal && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-75">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-bold">¡Alerta!</h2>
            <p>Su tinaco está al máximo de su capacidad. Por favor, apague la bomba inmediatamente.</p>
            <button className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700" onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Test;
