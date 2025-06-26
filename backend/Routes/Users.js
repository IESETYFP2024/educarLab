// Importación de módulos necesarios
import express from 'express';  // Framework para aplicaciones web de Node.js
import cors from 'cors';        // Middleware para manejar Cross-Origin Resource Sharing (CORS)
import jwt from 'jsonwebtoken'; // Librería para generar y verificar tokens JWT
import bcrypt from 'bcrypt';    // Librería para encriptar contraseñas
import nodemailer from 'nodemailer'; // Librería para enviar correos electrónicos
import database from '../src/db/conexion.js';  // Módulo para la conexión y consultas a la base de datos
import transporter from '../src/nodemailerConfig.js'; // Importamos Nodemailer
import dotenv from 'dotenv';

const users = express.Router();  // Router de Express para definir rutas

// Middleware para habilitar CORS en todas las rutas de 'users'
users.use(cors());
dotenv.config()

// Endpoint POST '/createAdmin': Maneja la creación de nuevos administradores
users.post('/createAdmin', async function(req, res) {
  const today = new Date();
  const userData = {
    "email": req.body.email,
    "password": bcrypt.hashSync(req.body.password, 10),
    "created": today,
    "role": "admin"
  };


  try {
    const connection = await database; // Usa la conexión directamente
    await connection.query('INSERT INTO users SET ?', userData);
    res.status(201).json({ error: 0, data: "Administrador registrado correctamente!" });
  } catch (err) {
    console.error("Error al registrar el administrador:", err); // Log del error
    res.status(500).json({ error: 1, data: "Error en el servidor interno" });
  }
});

// Endpoint POST '/login': Maneja la autenticación de usuarios
users.post('/login', async function(req, res) {
  const { email, password } = req.body;
  try {
      const connection = await database; // Usa la conexión directamente
      const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

      if (rows.length > 0) {
          const result = await bcrypt.compare(password, rows[0].password);
          if (result) {
              const payload = { id: rows[0].id, email: rows[0].email };
              const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h'}); // Token expira en 24 horas
              res.cookie('token', token, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'Lax',
                maxAge: 86400 // 24 horas
              });
              res.status(200).json({ error: 0, token }); // Respuesta exitosa con token

              //res.send({user, token})
              console.log("Token generado:", token);
          } else {
              res.status(401).json({ error: 1, data: "El Email o la Contraseña no coinciden" }); // Cambiado a 401
          }
      } else {
          res.status(401).json({ error: 1, data: "El email no existe!" }); // Cambiado a 401
      }
  } catch (err) {
      console.error("Error en el login:", err);
      res.status(500).json({ error: 1, data: "Error en el servidor interno" });
  }
});



// Endpoint POST '/sendResetPasswordEmail': Enviar el correo electrónico con el token
users.post('/sendResetPasswordEmail', async function(req, res) {
  const { email } = req.body;
  try {
    
    const connection = await database;
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {
      const payload = { id: rows[0].id, email: rows[0].email };
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 3600 }); // Token expira en 1 hora

      // Configuración del correo electrónico
      const mailOptions = {
        from: 'conectarlab@elechaco.edu.ar',
        to: email,
        subject: 'Restablecimiento de contraseña',
        text: `Haga clic en el siguiente enlace para restablecer su contraseña: http://localhost:3000/resetPassword.html?token=${token}`
      };

      // Enviar el correo electrónico
      await transporter.sendMail(mailOptions);
      res.status(200).json({ error: 0, data: "Correo de restablecimiento de contraseña enviado." });
    } else {
      res.status(204).json({ error: 1, data: "El email no existe!" });
    }
  } catch (err) {
    console.error("Error al enviar el correo:", err);
    res.status(500).json({ error: 1, data: "Error al enviar el correo de restablecimiento de contraseña." });
  }
});

// Endpoint POST '/resetPassword': Restablecer la contraseña usando el token
users.post('/resetPassword', async function(req, res) {
    const { token, password } = req.body; // Recibe el token y la nueva contraseña

    try {
        const connection = await database;

        // Verificar el token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Actualizar la contraseña en la base de datos
        await connection.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, decoded.id]);

        res.status(200).json({ error: 0, message: 'Contraseña restablecida correctamente.' });
    } catch (err) {
        console.error('Error al restablecer la contraseña:', err);

        // Si el token es inválido o ha expirado
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
            res.status(403).json({ error: 1, message: 'Token inválido o expirado.' });
        } else {
            res.status(500).json({ error: 1, message: 'Error al restablecer la contraseña.' });
        }
    }
});


// Middleware para verificar la validez del token JWT en las solicitudes entrantes
export function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: 'No se proporcionó un token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
}


// Exportar el router de usuarios
export default users;
