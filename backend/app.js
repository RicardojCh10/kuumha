import express from "express";
import mysql from "mysql";
import cors from "cors";
import nodemailer from "nodemailer";

// Crear la conexión a la base de datos
const db = mysql.createConnection({
    host: 'mysql-geovani.alwaysdata.net',
    user: 'geovani',
    password: 'AmericazUT',
    database: 'geovani_project_water'
});

let codigo;


const app = express();
app.use(express.json());
app.use(cors());

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos');
});

app.get('/', (req, res) => {
    res.send('Hola Mundo desde mi API');
});

app.listen(8082, () => {
    console.log("ESCUCHANDO EN EL PUERTO 8082");
});

const enviarMail = async (destinatario, coding) => {
    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'mechanicproyecto@gmail.com',
            pass: 'gnpb xjnt mtfg tsgj',
        }
    };
    const mensaje = {
        from: 'mechanicproyecto@gmail.com',
        to: `${destinatario}`,
        subject: 'CONFIRMACIÓN DE ACCESO - MECHANIC',
        text: `¡Hola! Detectamos que estás intentando iniciar sesión en Mechanic, para confirmar que eres tú, ingresa el siguiente código: | "${coding}" |`
    };
    const transport = nodemailer.createTransport(config);

    const info = await transport.sendMail(mensaje);
    console.log(info);
};

function generarCodigoAleatorio() {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    codigo = "";

    for (let i = 0; i < 6; i++) {
        const caracterAleatorio = caracteres.charAt(
            Math.floor(Math.random() * caracteres.length)
        );
        codigo += caracterAleatorio;
    }

    return codigo;
}

app.post('/login', (request, response) => {
    const email = request.body.gmail;
    const password = request.body.pass;

    db.query(
        `SELECT users.id, users.rol_id, users.pass FROM users WHERE gmail = ? AND pass = ?`,
        [email, password],
        async (error, result) => {
            if (result.length === 0) {
                response.status(200).json({
                    respuesta: "No se encontró un usuario con esos datos",
                    status: false,
                });
            } else {
                const userId = result[0].id;
                response.status(200).json({
                    respuesta: result[0],
                    status: true,
                });

                const codigo = generarCodigoAleatorio();

                db.query(
                    "UPDATE users SET codigo = ? WHERE id = ?;",
                    [codigo, userId],
                    (errors, results) => {
                        if (errors) {
                            console.error(
                                "Error al insertar el código de verificación en la base de datos:",
                                errors
                            );
                            response
                                .status(500)
                                .json({ error: "Error interno del servidor con el código de validación" });
                        } else {
                            console.log(
                                "Código de validación insertado correctamente en la base de datos"
                            );

                            enviarMail(email, codigo);

                        }
                    }
                );
            }
        }
    );
});

app.post("/confirmation", (request, response) => {
    const { id, codigo } = request.body;
    console.log("----> id: " + id + " codigo: " + codigo);

    db.query(
        'SELECT * FROM  users WHERE id = ? AND codigo = ?',
        [id, codigo],
        (error, results) => {
            if (error) {
                console.error("Error al actualizar el acceso del usuario: ", error);
                response.status(500).json({ error: "Error interno del servidor al confirmar el login", status: false });
            } else {
                if (results.length > 0) {
                    console.log('Código del usuario es correcto');
                    response.status(200).json({ status: true, acceso: true, success: true, alias: results[0].alias, rol: results[0].rol_id, token: 'isAuth' });
                } else {
                    console.log('Código del usuario es incorrecto');
                    response.status(200).json({ status: false });
                }
            }
        }
    );
});
