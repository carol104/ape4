/**
 * Middleware de Autenticación
 * 
 * Este middleware verifica la presencia de un token de autenticación
 * en las cabeceras de las peticiones para rutas protegidas.
 */

/**
 * Verifica si la petición tiene un token de autorización válido
 * @param {Request} req - Objeto de petición Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al siguiente middleware
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ 
      error: 'Token de autorización no proporcionado',
      code: 'NO_TOKEN'
    });
  }

  // Verificar formato Bearer token
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ 
      error: 'Formato de token inválido. Use: Bearer <token>',
      code: 'INVALID_FORMAT'
    });
  }

  const token = parts[1];
  
  // Simulación de verificación de token
  // En producción, aquí se verificaría con JWT o similar
  if (token === 'invalid') {
    return res.status(403).json({ 
      error: 'Token inválido o expirado',
      code: 'INVALID_TOKEN'
    });
  }

  // Token válido, continuar
  req.user = { id: 'user-123', role: 'admin' }; // Datos simulados del usuario
  next();
};

/**
 * Middleware opcional que solo verifica token si está presente
 * @param {Request} req - Objeto de petición Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al siguiente middleware
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      req.user = { id: 'user-123', role: 'user' };
    }
  }
  
  next();
};

export default { verifyToken, optionalAuth };
