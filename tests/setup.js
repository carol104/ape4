/**
 * Setup file para pruebas Jest
 * Configura el entorno de pruebas para usar almacenamiento local (JSON)
 */

// Forzar el uso de almacenamiento JSON en pruebas
process.env.STORAGE = 'json';
process.env.NODE_ENV = 'test';
