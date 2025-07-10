const { RateLimiterMemory } = require('rate-limiter-flexible');
const config = require('../../../config/app.config');

// Configurar rate limiter
const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'sigma_pli_rl',
  // Número de requisições
  points: config.rateLimit.max,
  // Janela de tempo em segundos
  duration: config.rateLimit.windowMs / 1000,
  // Tempo de bloqueio em segundos
  blockDuration: 60
});

// Middleware de rate limiting
const rateLimitMiddleware = async (req, res, next) => {
  try {
    // Usar IP como chave
    const key = req.ip;

    await rateLimiter.consume(key);

    // Adicionar headers informativos
    const resRateLimiter = await rateLimiter.get(key);

    if (resRateLimiter) {
      res.set({
        'X-RateLimit-Limit': config.rateLimit.max,
        'X-RateLimit-Remaining': resRateLimiter.remainingPoints || 0,
        'X-RateLimit-Reset': new Date(Date.now() + (resRateLimiter.msBeforeNext || 0)).toISOString()
      });
    }

    next();
  } catch (rejRes) {
    // Rate limit excedido
    const secs = Math.round((rejRes.msBeforeNext || 60000) / 1000) || 1;

    res.set({
      'X-RateLimit-Limit': config.rateLimit.max,
      'X-RateLimit-Remaining': 0,
      'X-RateLimit-Reset': new Date(Date.now() + (rejRes.msBeforeNext || 60000)).toISOString(),
      'Retry-After': secs
    });

    res.status(429).json({
      success: false,
      message: 'Muitas requisições. Tente novamente em alguns segundos.',
      retryAfter: secs
    });
  }
};

module.exports = rateLimitMiddleware;
