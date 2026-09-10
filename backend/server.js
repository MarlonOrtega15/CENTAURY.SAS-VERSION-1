// ================================================
// CENTAURY S.A.S — Servidor Backend
// Tecnología: Node.js + Express.js
// Puerto: 3000
// ================================================

const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE GLOBAL ──────────────────────────
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// ── RUTAS ─────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/contacto',  require('./routes/contacto'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/usuarios',  require('./routes/usuarios'));

// ── RUTA BASE ─────────────────────────────────
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'API Centaury S.A.S activa',
    version: '1.0.0',
    endpoints: ['/api/auth', '/api/contacto', '/api/proyectos', '/api/usuarios']
  });
});

// ── MANEJO DE ERRORES ─────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor', detalle: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor Centaury corriendo en http://localhost:${PORT}`);
});
