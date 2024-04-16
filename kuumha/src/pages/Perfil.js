import React, { useState, useEffect } from 'react';
import axios from 'axios';

const appStyle = {
  backgroundColor: '#87CEEB',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  fontFamily: 'Arial, sans-serif',
};

const headerStyle = {
  marginBottom: '20px',
  color: '#FFFFFF',
  fontSize: '36px',
  fontWeight: 'bold',
};

const createButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#1E90FF', // Azul 
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '40px', // Ajuste de margen superior para separar del contenido debajo
};

const tableContainerStyle = {
  width: '80%',
  overflowX: 'auto',
  marginTop: '20px', // Ajuste de margen superior para separar del botón
};

const tableStyle = {
  backgroundColor: '#F0F8FF',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle = {
    backgroundColor: '#1E90FF', // Azul para el encabezado de la primera columna
    color: 'white',
    textAlign: 'left',
    padding: '12px 8px',
  };

const tdStyle = {
  borderBottom: '1px solid #ddd',
  padding: '12px 8px',
};

const inputStyle = {
  marginBottom: '10px',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '16px',
};
const formContainerStyle = {
  backgroundColor: '#F0F8FF',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  padding: '20px',
  width: '40%',
  marginTop: '20px',
  display: 'block', // Asegura que el formulario esté siempre visible
};


function App() {
  const [alias, setAlias] = useState('');
  const [gmail, setGmail] = useState('');
  const [rolId, setRolId] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:8082/users', { alias, gmail, rol_id: rolId });
      alert('Usuario creado correctamente');
      obtenerUsuarios();
      setShowForm(false);
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      alert('Error al crear el usuario. Consulta la consola para más detalles.');
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:8082/users');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      alert('Error al obtener la lista de usuarios. Consulta la consola para más detalles.');
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div style={appStyle}>
      <h1 style={headerStyle}>CRUD de Usuarios</h1>
      {!showForm && (
        <button style={createButtonStyle} onClick={toggleForm}>Crear Usuario</button>
      )}
      <div style={formContainerStyle} style={{ display: showForm ? 'block' : 'none' }}>
        <form onSubmit={handleSubmit}>
          <input style={inputStyle} type="text" placeholder="Alias" value={alias} onChange={(e) => setAlias(e.target.value)} required />
          <input style={inputStyle} type="email" placeholder="Correo electrónico" value={gmail} onChange={(e) => setGmail(e.target.value)} required />
          <input style={inputStyle} type="number" placeholder="ID de Rol" value={rolId} onChange={(e) => setRolId(e.target.value)} required />
          <button style={createButtonStyle} type="submit">Crear Usuario</button>
        </form>
      </div>
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={thStyle}>
              <th>ID</th>
              <th>Alias</th>
              <th>Correo Electrónico</th>
              <th>ID de Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td style={tdStyle}>{usuario.id}</td>
                <td style={tdStyle}>{usuario.alias}</td>
                <td style={tdStyle}>{usuario.gmail}</td>
                <td style={tdStyle}>{usuario.rol_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
