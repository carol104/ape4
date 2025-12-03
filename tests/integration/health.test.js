/**
 * PRUEBAS DE INTEGRACIÓN - Health Check Endpoints
 * 
 * Este archivo contiene pruebas de integración para verificar que los
 * endpoints de health check funcionan correctamente.
 */

import request from 'supertest';
import app from '../../app.js';

describe('Health Check Endpoints - Pruebas de Integración', () => {

  describe('GET /health', () => {
    test('debería retornar status OK con información del sistema', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.uptime).toBeDefined();
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.memory).toBeDefined();
      expect(response.body.memory.used).toBeDefined();
      expect(response.body.memory.total).toBeDefined();
    });

    test('debería incluir el timestamp en formato ISO', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toISOString()).toBe(response.body.timestamp);
    });
  });

  describe('GET /health/ready', () => {
    test('debería indicar que la aplicación está lista', async () => {
      const response = await request(app)
        .get('/health/ready')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.ready).toBe(true);
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('GET /health/live', () => {
    test('debería indicar que la aplicación está viva', async () => {
      const response = await request(app)
        .get('/health/live')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.alive).toBe(true);
      expect(response.body.timestamp).toBeDefined();
    });
  });
});
