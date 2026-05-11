const pool = require('../config/db');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validación
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // Verificar si el usuario ya existe en MySQL
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Crear nuevo usuario (INSERT)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );

    const userId = result.insertId;
    const token = generateToken(userId, email);

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: userId, name, email }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Validación
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Buscar usuario en MySQL
    const [rows] = await pool.query(
      'SELECT id, name, email FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id, user.email);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
};

const verify = (req, res) => {
  // El middleware ya verificó el token
  return res.status(200).json({
    message: 'Token is valid',
    userId: req.userId,
    email: req.userEmail
  });
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [newPassword, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
};

module.exports = { register, login, verify, resetPassword };

