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
  const [waterLevel, setWaterLevel] = useState(0); // Inicializa el estado del nivel de agua

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8765');

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      console.log(event)
      const data = JSON.parse(event.data);
      console.log('Received data:', data);
      const { sensor_nivel } = data; // Suponiendo que recibimos un objeto con el nivel del sensor
      const newWaterLevel = Math.min((sensor_nivel / 1000) * 100, 100); // Calcula el nivel de agua en función del nivel del sensor
      setWaterLevel(newWaterLevel);
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex flex-col items-center w-16 py-4 text-white bg-blue-500">
        <div className="mb-8">
          <FiHome className="text-2xl"/>
          <span className="mt-2 text-xs">HOME</span>
        </div>
        <div>
          <FiUser className="text-2xl"/>
          <span className="mt-2 text-xs">PERFIL</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="flex items-center justify-between p-4 text-white bg-blue-500">
          <h1 className="text-xl font-bold">CONTROL DE AGUA</h1>
          <div className="flex items-center">
            <Clock />
            <FiBell className="ml-4 text-2xl"/>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8">
          {/* Card grande que contiene todo el contenido */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            {/* Cuerpo de la card */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Card Nivel de agua */}
              <div className="p-4 bg-gray-200 rounded-lg">
                <h2 className="mb-2 font-bold">Nivel de agua</h2>
                <p className="text-5xl text-center">{waterLevel}%</p>
              </div>

              {/* Card Calidad de agua */}
              <div className="p-4 bg-gray-200 rounded-lg">
                <h2 className="mb-2 font-bold">Calidad del agua</h2>
                <div className="flex justify-around">
                  <div>
                    <span className="block w-8 h-8 mx-auto mb-2 bg-green-500 rounded-full"></span>
                    <p className="text-sm text-center">Buena</p>
                  </div>
                  <div>
                    <span className="block w-8 h-8 mx-auto mb-2 bg-yellow-500 rounded-full"></span>
                    <p className="text-sm text-center">Intermedio</p>
                  </div>
                  <div>
                    <span className="block w-8 h-8 mx-auto mb-2 bg-red-500 rounded-full"></span>
                    <p className="text-sm text-center">Mala</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tinaco con animación de llenado */}
            <div className="relative h-32 overflow-hidden bg-gray-300 border-2 border-blue-500 rounded-lg">
              {/* Agua del tinaco */}
              <div className="absolute bottom-0 left-0 w-full transition-all duration-300 bg-blue-300" style={{ height: `${waterLevel}%` }}></div>

              {/* Etiqueta del porcentaje del agua */}
              <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
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
