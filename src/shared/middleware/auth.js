// Middleware para verificar autenticação
function checkAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '') ||
                req.session?.token ||
                req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticação não fornecido',
      redirectUrl: '/auth/login'
    });
  }

  try {
    // Validação simples do token (em produção, usar JWT verify)
    const tokenData = Buffer.from(token, 'base64').toString();
    const [userId, timestamp] = tokenData.split('-');

    if (!userId || !timestamp) {
      throw new Error('Token inválido');
    }

    // Verificar se o token não expirou (24h)
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000;

    if (tokenAge > maxAge) {
      throw new Error('Token expirado');
    }

    // Adicionar dados do usuário ao request
    req.user = {
      id: parseInt(userId),
      token
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado',
      redirectUrl: '/auth/login'
    });
  }
}

// Middleware para verificar role/permissões
function checkRole(_requiredRole) {
  return (req, res, next) => {
    // Este middleware seria usado para verificar permissões específicas
    // Por enquanto, apenas prosseguir
    next();
  };
}

module.exports = {
  checkAuth,
  checkRole
};
