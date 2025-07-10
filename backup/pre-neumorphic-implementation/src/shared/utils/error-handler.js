const logger = require('./logger');

class ErrorHandler {
  static handle(error, req, res, _next) {
    logger.error('Erro na aplicação:', {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Erro de validação
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.details || error.message
      });
    }

    // Erro de autenticação
    if (error.name === 'UnauthorizedError' || error.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Não autorizado'
      });
    }

    // Erro de acesso negado
    if (error.status === 403) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    // Erro de não encontrado
    if (error.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Recurso não encontrado'
      });
    }

    // Erro de conflito
    if (error.status === 409) {
      return res.status(409).json({
        success: false,
        message: 'Conflito de dados'
      });
    }

    // Erro interno do servidor
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      ...(process.env.NODE_ENV !== 'production' && {
        error: error.message,
        stack: error.stack
      })
    });
  }

  static async(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  static notFound(req, res, next) {
    const error = new Error(`Rota não encontrada: ${req.originalUrl}`);
    error.status = 404;
    next(error);
  }
}

module.exports = ErrorHandler.handle;
