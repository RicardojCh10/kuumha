// import React, { useState, useEffect } from 'react';
// import { FiHome, FiUser, FiBell } from 'react-icons/fi';

// // Componente de Reloj para mostrar la hora actual
// const Clock = () => {
//   const [time, setTime] = useState(new Date());

//   useEffect(() => {
//     const timerId = setInterval(() => setTime(new Date()), 1000);
//     return () => {
//       clearInterval(timerId);
//     };
//   }, []);

//   return (
//     <span className="text-sm text-gray-600">{time.toLocaleTimeString()}</span>
//   );
// };

// function Home() {
//   const [waterLevel, setWaterLevel] = useState(0); // Estado del nivel de agua
//   const [tds, setTds] = useState(0); // Estado del TDS
//   const [lastUpdate, setLastUpdate] = useState(null); // Estado de la última actualización
//   const [socket, setSocket] = useState(null); // Estado del WebSocket

//   console.log(tds)

//   useEffect(() => {
//     const ws = new WebSocket('ws://localhost:8765');
//     setSocket(ws);

//     console.log("PUTO RAFA", ws)

//     ws.onopen = () => {
//       console.log('WebSocket connected');
//     };

//     ws.onmessage = (event) => {
//       console.log("evento", event)
//       const data = JSON.parse(event.data);
//       console.log('Received data:', data);
//       const { sensor_nivel, sensor_calidad, fecha } = data; // Desestructura los datos recibidos del WebSocket
//       setWaterLevel(sensor_nivel);
//       setTds(sensor_calidad);
//       setLastUpdate(fecha);
//     };


//     ws.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     // Cierre del WebSocket al desmontar el componente
//     return () => {
//       ws.close();
//     };
//   }, []);

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="flex flex-col items-center w-16 py-4 text-white bg-blue-500">
//         <div className="mb-8">
//           <FiHome className="text-2xl"/>
//           <span className="mt-2 text-xs">HOME</span>
//         </div>
//         <div>
//           <FiUser className="text-2xl"/>
//           <span className="mt-2 text-xs">PERFIL</span>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="flex flex-col flex-1">
//         {/* Header */}
//         <header className="flex items-center justify-between p-4 text-white bg-blue-500">
//           <h1 className="text-xl font-bold">CONTROL DE AGUA</h1>
//           <div className="flex items-center">
//             <Clock />
//             <FiBell className="ml-4 text-2xl"/>
//           </div>
//         </header>

//         {/* Content */}
//         <div className="flex-1 p-8">
//           {/* Card grande que contiene todo el contenido */}
//           <div className="p-6 bg-white rounded-lg shadow-lg">
//             {/* Cuerpo de la card */}
//             <div className="grid grid-cols-2 gap-4 mb-6">
//               {/* Card Nivel de agua */}
//               <div className="p-4 bg-gray-200 rounded-lg">
//                 <h2 className="mb-2 font-bold">Nivel de agua</h2>
//                 <p className="text-5xl text-center">{waterLevel} cm</p>
//               </div>

//               {/* Card Calidad de agua */}
//               <div className="p-4 bg-gray-200 rounded-lg">
//                 <h2 className="mb-2 font-bold">Calidad del agua</h2>
//                 <p className="text-2xl text-center">{tds} ppm</p>
//                 <p className="text-sm text-center">Última actualización: {lastUpdate}</p>
//               </div>
//             </div>

//             {/* Tinaco con animación de llenado */}
//             <div className="relative h-32 overflow-hidden bg-gray-300 border-2 border-blue-500 rounded-lg">
//               {/* Agua del tinaco */}
//               <div className="absolute bottom-0 left-0 w-full transition-all duration-300 bg-blue-300" style={{ height: `${waterLevel}%` }}></div>

//               {/* Etiqueta del porcentaje del agua */}
//               <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
//                 <span className="text-2xl font-bold">{waterLevel}%</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;
