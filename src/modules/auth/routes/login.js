const express = require('express');
const router = express.Router();

// POST /api/auth/login
router.post('/', (req, res) => {
  const { username, password, remember } = req.body;

  // Validação: email e senha são obrigatórios
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email e senha são obrigatórios'
    });
  }

  // Validação: username deve ser um email válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(username)) {
    return res.status(400).json({
      success: false,
      message: 'Por favor, digite um endereço de email válido'
    });
  }

  // Aceitar qualquer email e senha (desenvolvimento)
  // Extrair nome do usuário do email
  const emailParts = username.split('@');
  const userNameFromEmail = emailParts[0];
  const domain = emailParts[1];
  
  // Determinar papel baseado no domínio ou nome
  let role = 'user';
  let permissions = ['read'];
  
  if (userNameFromEmail.toLowerCase().includes('admin')) {
    role = 'admin';
    permissions = ['read', 'write', 'delete', 'admin'];
  } else if (userNameFromEmail.toLowerCase().includes('manager') || userNameFromEmail.toLowerCase().includes('gerente')) {
    role = 'manager';
    permissions = ['read', 'write'];
  }

  // Criar dados do usuário baseado no email
  const userData = {
    id: Math.floor(Math.random() * 10000) + 1,
    username: username,
    name: userNameFromEmail.charAt(0).toUpperCase() + userNameFromEmail.slice(1).replace(/[._-]/g, ' '),
    email: username,
    role: role,
    permissions: permissions,
    domain: domain,
    loginTime: new Date().toISOString()
  };

  // Gerar token simples (em produção, usar JWT)
  const token = Buffer.from(`${userData.id}-${Date.now()}`).toString('base64');

  res.json({
    success: true,
    message: 'Login realizado com sucesso',
    token,
    user: userData,
    redirectUrl: '/dashboard'
  });
});

module.exports = router;
