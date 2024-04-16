const express = require('express');
const mysql = require('mysql2');

// Crear la conexión a la base de datos
const db = mysql.createConnection({
    host: 'mysql-geovani.alwaysdata.net', // Dirección del servidor de la base de datos
    user: 'geovani',                      // Tu nombre de usuario
    password: 'AmericazUT',               // Tu contraseña
    database: 'geovani_project_water'     // Nombre de la base de datos
});

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos');
});

const app = express();

app.get('/', (req, res) => {
    res.send('Hola Mundo desde mi API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});



app.get('/sensores', (req, res) => {
    console.log("Consulta a la tabla de sensores iniciada");
    db.query('SELECT * FROM sensor', (err, results) => {
        if (err) {
            console.error("Error al consultar la tabla de sensores:", err);
            return res.status(500).send('Error en el servidor');
        }
        console.log("Resultados de la consulta:", results);
        res.status(200).json(results);
    });
});

app.post('/users', (req, res) => {
    const { alias, gmail, rol_id } = req.body;
    const query = `INSERT INTO users (alias, gmail, rol_id) VALUES (?, ?, ?)`;
    db.query(query, [alias, gmail, rol_id], (err, result) => {
        if (err) {
            return res.status(500).send('Error al crear el usuario');
        }
        res.status(201).send('Usuario creado correctamente');
    });
});

app.get('/users', (req, res) => {
    db.query('SELECT id, alias, gmail, rol_id FROM users', (err, results) => {
        if (err) {
            return res.status(500).send('Error en el servidor');
        }
        res.status(200).json(results);
    });
});

app.put('/users/:id', (req, res) => {
    const { alias, gmail, rol_id } = req.body;
    const { id } = req.params;
    const query = `UPDATE users SET alias = ?, gmail = ?, rol_id = ? WHERE id = ?`;
    db.query(query, [alias, gmail, rol_id, id], (err, result) => {
        if (err) {
            return res.status(500).send('Error al actualizar el usuario');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.send('Usuario actualizado correctamente');
    });
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM users WHERE id = ?`;
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).send('Error al eliminar el usuario');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.send('Usuario eliminado correctamente');
    });
});
