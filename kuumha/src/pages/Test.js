import React, { useEffect, useState } from 'react';
import { FiHome, FiUser, FiBell } from 'react-icons/fi';

function Test() {
  const [sensorData, setSensorData] = useState([]);
  const [waterLevel, setWaterLevel] = useState(0); // Estado para el nivel de agua
  const [tds, setTds] = useState(0); // Estado para el valor de TDS
  const [waterType, setWaterType] = useState(''); // Estado para el tipo de agua

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
            const level = Math.min(data.distancia, 20); // Limitar el nivel máximo a 20 cm
            setWaterLevel(level); 
            setTds(data.tds); // Actualizar el valor de TDS
            // Determinar el tipo de agua según el valor de TDS
            if (data.tds < 100) {
              setWaterType('Agua pura');
            } else if (data.tds < 300) {
              setWaterType('Agua potable');
            } else if (data.tds < 600) {
              setWaterType('Agua dura');
            } else {
              setWaterType('Agua muy dura');
            }
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

  // Función para obtener el color basado en el valor de TDS
  const getColorByTds = (tdsValue) => {
    // Paleta de colores degradados
    const colors = [
      '#008000', // Verde
      '#FFFF00', // Amarillo
      '#FFA500', // Naranja
      '#FF0000', // Rojo
    ];

    // Rango de valores de TDS para cada color
    const tdsRanges = [0, 100, 300, 600];

    // Determinar el color basado en el valor de TDS
    for (let i = 0; i < tdsRanges.length - 1; i++) {
      if (tdsValue >= tdsRanges[i] && tdsValue < tdsRanges[i + 1]) {
        // Calcular el valor interpolado para obtener un degradado suave entre colores
        const ratio = (tdsValue - tdsRanges[i]) / (tdsRanges[i + 1] - tdsRanges[i]);
        const color1 = colors[i];
        const color2 = colors[i + 1];
        const r = Math.round(parseInt(color1.substring(1, 3), 16) * (1 - ratio) + parseInt(color2.substring(1, 3), 16) * ratio);
        const g = Math.round(parseInt(color1.substring(3, 5), 16) * (1 - ratio) + parseInt(color2.substring(3, 5), 16) * ratio);
        const b = Math.round(parseInt(color1.substring(5, 7), 16) * (1 - ratio) + parseInt(color2.substring(5, 7), 16) * ratio);
        return `rgb(${r},${g},${b})`;
      }
    }

    // Valor de TDS fuera del rango conocido
    return '#000000'; // Negro por defecto
  };

  return (
    <>
      <div className="flex flex-col h-screen text-black bg-white">
        <header className="flex items-center justify-between p-4 bg-blue-800">
          <h1 className="text-xl font-bold">KUUMHA CONTROL DE</h1>
          <div className="flex items-center">
            <FiBell className="ml-4 text-2xl" />
          </div>
        </header>
        <div className="relative flex flex-1">
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
          <main className="relative z-10 flex-1 p-8">
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
                  <rect x="55" y={250 - waterLevel * 10} width="290" height={waterLevel * 10} rx="10" ry="10" fill="url(#gradienteAgua)" />
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
                <h1 className="mb-4 text-xl font-bold">Datos del sensor TDS</h1>
                <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  {/* Sensor TDS */}
                  <circle cx="100" cy="100" r="80" fill={getColorByTds(tds)} />
                </svg>
                {/* Tipo de agua */}
                <p className="mt-4"><span className="font-bold">Tipo de agua:</span> {waterType}</p>
                {/* Valor de TDS */}
                <p><span className="font-bold">Valor de TDS:</span> {tds} ppm</p>
              </div>
            </div>
          </main>
        </div>
        {/* Fondo con imagen de agua */}
        <div className="absolute inset-0 z-0 bg-center bg-cover" style={{ backgroundImage: 'url(https://www.freepik.es/fotos-vectores-gratis/fondo-agua)' }} />
        {/* Capa semi-transparente */}
        <div className="absolute inset-0 z-0 bg-black opacity-50" />
      </div>
    </>
  );
}

export default Test;
