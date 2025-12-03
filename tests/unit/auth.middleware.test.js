/**
 * PRUEBAS UNITARIAS - Middleware de Autenticación
 * 
 * Este archivo contiene pruebas unitarias para verificar el correcto
 * funcionamiento del middleware de autenticación.
 */

import { jest } from '@jest/globals';
import { verifyToken, optionalAuth } from '../../middlewares/auth.js';

describe('Auth Middleware - Pruebas Unitarias', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    nextFunction = jest.fn();
  });

  describe('verifyToken', () => {
    test('debería retornar 401 si no hay token de autorización', () => {
      verifyToken(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Token de autorización no proporcionado',
        code: 'NO_TOKEN'
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('debería retornar 401 si el formato del token es inválido', () => {
      mockReq.headers.authorization = 'InvalidFormat token123';

      verifyToken(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Formato de token inválido. Use: Bearer <token>',
        code: 'INVALID_FORMAT'
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('debería retornar 403 si el token es inválido', () => {
      mockReq.headers.authorization = 'Bearer invalid';

      verifyToken(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Token inválido o expirado',
        code: 'INVALID_TOKEN'
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('debería llamar a next() con token válido y agregar usuario a req', () => {
      mockReq.headers.authorization = 'Bearer validtoken123';

      verifyToken(mockReq, mockRes, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.id).toBe('user-123');
      expect(mockReq.user.role).toBe('admin');
    });
  });

  describe('optionalAuth', () => {
    test('debería llamar a next() sin token', () => {
      optionalAuth(mockReq, mockRes, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockReq.user).toBeUndefined();
    });

    test('debería agregar usuario si hay token válido', () => {
      mockReq.headers.authorization = 'Bearer validtoken123';

      optionalAuth(mockReq, mockRes, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.role).toBe('user');
    });

    test('debería continuar sin usuario si el formato es inválido', () => {
      mockReq.headers.authorization = 'InvalidFormat';

      optionalAuth(mockReq, mockRes, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockReq.user).toBeUndefined();
    });
  });
});
