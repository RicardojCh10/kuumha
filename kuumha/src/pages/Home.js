import React, { useState, useEffect } from 'react';
import { FiHome, FiUser, FiBell } from 'react-icons/fi';

// Componente de Reloj para mostrar la hora actual
const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <span className="text-sm text-gray-600">{time.toLocaleTimeString()}</span>
  );
};

function Home() {
  const [waterLevel, setWaterLevel] = useState(10); // Inicializa con un 10% para el ejemplo

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8765');

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const distance = parseInt(event.data);
      // Realiza la lógica para determinar el nivel de agua basado en la distancia recibida
      const newWaterLevel = Math.max(100 - distance, 0); // Suponiendo que la distancia se correlaciona inversamente con el nivel de agua
      setWaterLevel(newWaterLevel);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-16 bg-blue-500 text-white flex flex-col items-center py-4">
        <div className="mb-8">
          <FiHome className="text-2xl"/>
          <span className="text-xs mt-2">HOME</span>
        </div>
        <div>
          <FiUser className="text-2xl"/>
          <span className="text-xs mt-2">PERFIL</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-blue-500 text-white">
          <h1 className="text-xl font-bold">CONTROL DE AGUA</h1>
          <div className="flex items-center">
            <Clock />
            <FiBell className="text-2xl ml-4"/>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 flex-1">
          {/* Card grande que contiene todo el contenido */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Cuerpo de la card */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Card Nivel de agua */}
              <div className="bg-gray-200 p-4 rounded-lg">
                <h2 className="font-bold mb-2">Nivel de agua</h2>
                <p className="text-5xl text-center">{waterLevel}%</p>
              </div>

              {/* Card Calidad de agua */}
              <div className="bg-gray-200 p-4 rounded-lg">
                <h2 className="font-bold mb-2">Calidad del agua</h2>
                <div className="flex justify-around">
                  <div>
                    <span className="block h-8 w-8 bg-green-500 rounded-full mb-2 mx-auto"></span>
                    <p className="text-center text-sm">Buena</p>
                  </div>
                  <div>
                    <span className="block h-8 w-8 bg-yellow-500 rounded-full mb-2 mx-auto"></span>
                    <p className="text-center text-sm">Intermedio</p>
                  </div>
                  <div>
                    <span className="block h-8 w-8 bg-red-500 rounded-full mb-2 mx-auto"></span>
                    <p className="text-center text-sm">Mala</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tinaco con animación de llenado */}
            <div className="relative border-2 border-blue-500 rounded-lg overflow-hidden h-32 bg-gray-300">
              {/* Agua del tinaco */}
              <div className="absolute bottom-0 left-0 bg-blue-300 w-full transition-all duration-300" style={{ height: `${waterLevel}%` }}></div>

              {/* Etiqueta del porcentaje del agua */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="text-2xl font-bold">{waterLevel}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
