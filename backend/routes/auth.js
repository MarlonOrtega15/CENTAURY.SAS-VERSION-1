const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../config/database');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, rol } = req.body;
    if (!email || !password || !rol)
      return res.status(400).json({ error: 'Email, contraseña y rol son requeridos.' });

    const [usuarios] = await db.query(
      'SELECT u.*, r.nombre AS rol_nombre FROM usuarios u JOIN roles r ON u.rol_id = r.id WHERE u.email = ? AND u.activo = 1',
      [email]
    );
    if (!usuarios.length)
      return res.status(401).json({ error: 'Credenciales inválidas.' });

    const usuario = usuarios[0];
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida)
      return res.status(401).json({ error: 'Credenciales inválidas.' });

    if (usuario.rol_nombre !== rol)
      return res.status(403).json({ error: 'El rol seleccionado no corresponde a este usuario.' });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol_nombre, nombre: usuario.nombre },
      process.env.JWT_SECRET || 'centaury_secret_2026',
      { expiresIn: '8h' }
    );

    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol_nombre } });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión.', detalle: err.message });
  }
});

module.exports = router;
