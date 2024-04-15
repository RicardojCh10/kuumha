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
    db.query('SELECT * FROM sensor', (err, results) => {
        if (err) {
            return res.status(500).send('Error en el servidor');
        }
        res.status(200).json(results);
    });
});
