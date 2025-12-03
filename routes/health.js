import express from 'express';

const router = express.Router();

/**
 * GET /health
 * Endpoint de health check para monitoreo de la aplicación
 * Útil para balanceadores de carga y sistemas de monitoreo
 */
router.get('/', (req, res) => {
  const healthcheck = {
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    }
  };
  
  res.status(200).json(healthcheck);
});

/**
 * GET /health/ready
 * Verifica si la aplicación está lista para recibir tráfico
 */
router.get('/ready', (req, res) => {
  // Aquí se podrían agregar verificaciones de dependencias
  // como conexión a base de datos, servicios externos, etc.
  res.status(200).json({ 
    ready: true,
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /health/live
 * Verifica si la aplicación está viva (liveness probe)
 */
router.get('/live', (req, res) => {
  res.status(200).json({ 
    alive: true,
    timestamp: new Date().toISOString()
  });
});

export default router;
