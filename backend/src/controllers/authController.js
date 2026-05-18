// Importar la base de datos primero asegura que dotenv.config() se ejecute
const { poolPromise, sql } = require('../config/database');

if (!process.env.JWT_SECRET) {
  console.error('❌ CRÍTICO: La variable JWT_SECRET no está definida en el archivo .env');
}

const { generateToken } = require('../utils/jwt');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  const { name, email, password, role, adminCode } = req.body;

  // Validación
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const pool = await poolPromise;
    
    // Verificar si el usuario ya existe en SQL Server
    const checkUser = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT Id FROM dbo.Usuarios WHERE Email = @email');

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Encriptar la contraseña (10 rondas de salteo)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Definir el rol (por defecto 'cliente' si no se proporciona)
    const rolesPermitidos = ['cliente', 'administrador'];
    // Forzamos el rol a minúsculas antes de validar y guardar
    const normalizedRole = (role || 'cliente').toLowerCase();
    const userRole = rolesPermitidos.includes(normalizedRole) ? normalizedRole : 'cliente';

    // Validación de código de administrador
    if (userRole === 'administrador') {
      const secretAdminCode = process.env.ADMIN_SECRET_CODE || 'Arte2026_Secret';
      if (adminCode !== secretAdminCode) {
        return res.status(403).json({ error: 'Código de administrador inválido' });
      }
    }

    // Crear nuevo usuario y obtener el ID generado
    const result = await pool.request()
      .input('name', sql.VarChar, name)
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, hashedPassword)
      .input('role', sql.VarChar, userRole)
      .query('INSERT INTO dbo.Usuarios (Nombre, Email, Password, Rol) OUTPUT INSERTED.Id VALUES (@name, @email, @password, @role)');

    const userId = result.recordset[0].Id;
    const token = generateToken(userId, email, userRole); 

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: userId, name, email, role: userRole, isAdmin: userRole === 'administrador' }
    });
  } catch (err) {
    console.error('❌ Error en el registro:', err.message);
    return res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Validación
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const pool = await poolPromise;
    
    // Buscar usuario en SQL Server
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT Id, Nombre, Email, Password, Rol FROM dbo.Usuarios WHERE Email = @email');

    const user = result.recordset[0];

    if (!user || !(await bcrypt.compare(password, user.Password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.Id, user.Email, user.Rol);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.Id, name: user.Nombre, email: user.Email, role: user.Rol, isAdmin: user.Rol?.toLowerCase() === 'administrador' }
    });
  } catch (err) {
    console.error('❌ Error en el login:', err.message);
    return res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};

const verify = (req, res) => {
  // El middleware ya verificó el token
  return res.status(200).json({
    message: 'Token is valid',
    userId: req.userId,
    email: req.userEmail,
    role: req.user.role,
    isAdmin: req.user.role?.toLowerCase() === 'administrador'
  });
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required' });
  }

  try {
    const pool = await poolPromise;
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const result = await pool.request()
      .input('password', sql.VarChar, hashedNewPassword)
      .input('email', sql.VarChar, email)
      .query('UPDATE dbo.Usuarios SET Password = @password WHERE Email = @email');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('❌ Error al restablecer contraseña:', err.message);
    return res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};

module.exports = { register, login, verify, resetPassword };
