import React, { useEffect } from 'react';

function Test() {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8765');

    ws.onopen = function () {
      console.log('Conexión establecida');
    };

    ws.onmessage = function (event) {
      console.log('Mensaje recibido:', event.data);
      const data = JSON.parse(event.data);
      displayData(data);
    };

    ws.onerror = function (error) {
      console.error('Error:', error.message);
    };

    ws.onclose = function () {
      console.log('Conexión cerrada');
    };

    function displayData(data) {
      const dataList = document.getElementById('data-list');
      const listItem = document.createElement('li');
      listItem.textContent = `Distancia: ${data.distancia} cm, TDS: ${data.tds} ppm, Fecha: ${data.fecha}`;
      dataList.appendChild(listItem);
    }

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>Datos recibidos del servidor:</h1>
      <ul id="data-list"></ul>
    </div>
  );
}

export default Test;
