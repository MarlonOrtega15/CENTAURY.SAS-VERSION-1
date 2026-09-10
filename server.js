const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Andres.69',
    database: 'centaury_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
        return;
    }
    console.log('✅ Conectado exitosamente a la base de datos MySQL de Centaury S.A.S');
});

// Ruta de prueba para ver si el servidor responde
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

// Ruta para guardar contacto con diagnóstico en consola
app.post('/api/contacto', (req, res) => {
    console.log('📥 ¡Petición POST recibida en /api/contacto!', req.body);

    const { nombre, empresa, email, telefono, servicio, mensaje } = req.body;
    
    if (!telefono || telefono.replace(/\D/g, '').length < 10) {
        console.log('⚠️ Validación fallida: Teléfono muy corto');
        return res.status(400).json({ error: 'El número de celular debe tener al menos 10 dígitos.' });
    }

    const query = 'INSERT INTO solicitudes_contacto (nombre, empresa, email, telefono, servicio, mensaje) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [nombre, empresa, email, telefono, servicio, mensaje], (err, result) => {
        if (err) {
            console.error('❌ Error ejecutando la consulta en MySQL:', err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log('✅ ¡Dato guardado en MySQL con éxito! ID:', result.insertId);
        res.json({ mensaje: '¡Solicitud guardada en MySQL con éxito!', id: result.insertId });
    });
});

// Iniciar servidor en el puerto 3000
app.listen(3000, () => {
    console.log('🚀 Servidor backend corriendo en http://localhost:3000');
});