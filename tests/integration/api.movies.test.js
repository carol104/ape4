/**
 * PRUEBAS DE INTEGRACIÓN - API REST de Películas
 * 
 * Este archivo contiene pruebas de integración para verificar que los
 * endpoints de la API responden correctamente al consumir el servicio.
 */

import request from 'supertest';
import app from '../../app.js';

describe('API REST Movies - Pruebas de Integración', () => {
  
  // Variable para almacenar datos entre pruebas
  let createdMovieId;

  // Datos de película para pruebas
  const testMovie = {
    title: 'Integration Test Movie',
    year: 2024,
    director: 'Test Director',
    duration: 150,
    poster: 'https://example.com/test-poster.jpg',
    genre: ['Action', 'Sci-Fi'],
    rate: 8.0
  };

  describe('GET / - Endpoint raíz', () => {
    test('debería responder con status 200 y mensaje de bienvenida', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello World');
    });
  });

  describe('GET /movies - Obtener todas las películas', () => {
    test('debería responder con status 200 y un array de películas', async () => {
      const response = await request(app)
        .get('/movies')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('debería filtrar películas por género', async () => {
      const response = await request(app)
        .get('/movies?genre=Drama')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      
      // Verificar que todas tengan el género Drama
      response.body.forEach(movie => {
        const hasDrama = movie.genre.some(g => g.toLowerCase() === 'drama');
        expect(hasDrama).toBe(true);
      });
    });

    test('debería retornar array vacío para género inexistente', async () => {
      const response = await request(app)
        .get('/movies?genre=GeneroInexistente12345')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('POST /movies - Crear nueva película', () => {
    test('debería crear una película y responder con status 201', async () => {
      const response = await request(app)
        .post('/movies')
        .send(testMovie)
        .expect('Content-Type', /json/)
        .expect(201);
      
      // Guardar ID para pruebas posteriores
      createdMovieId = response.body.id;
      
      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.title).toBe(testMovie.title);
      expect(response.body.year).toBe(testMovie.year);
      expect(response.body.director).toBe(testMovie.director);
    });
  });

  describe('GET /movies/:id - Obtener película por ID', () => {
    test('debería obtener una película existente por su ID', async () => {
      const response = await request(app)
        .get(`/movies/${createdMovieId}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(createdMovieId);
      expect(response.body.title).toBe(testMovie.title);
    });

    test('debería responder con 404 para ID inexistente', async () => {
      const response = await request(app)
        .get('/movies/id-que-no-existe-12345')
        .expect('Content-Type', /json/)
        .expect(404);
      
      expect(response.body.error).toBeDefined();
    });
  });

  describe('PATCH /movies/:id - Actualizar película', () => {
    test('debería actualizar una película existente', async () => {
      const updateData = {
        title: 'Integration Test Movie - UPDATED',
        rate: 9.5
      };

      const response = await request(app)
        .patch(`/movies/${createdMovieId}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.rate).toBe(updateData.rate);
      // Los demás campos deben permanecer igual
      expect(response.body.director).toBe(testMovie.director);
    });

    test('debería responder con 404 al actualizar película inexistente', async () => {
      const response = await request(app)
        .patch('/movies/id-inexistente-12345')
        .send({ title: 'No existe' })
        .expect('Content-Type', /json/)
        .expect(404);
      
      expect(response.body.error).toBeDefined();
    });
  });

  describe('DELETE /movies/:id - Eliminar película', () => {
    test('debería eliminar una película existente con status 204', async () => {
      await request(app)
        .delete(`/movies/${createdMovieId}`)
        .expect(204);
      
      // Verificar que ya no existe
      const checkResponse = await request(app)
        .get(`/movies/${createdMovieId}`)
        .expect(404);
      
      expect(checkResponse.body.error).toBeDefined();
    });

    test('debería responder con 404 al eliminar película inexistente', async () => {
      const response = await request(app)
        .delete('/movies/id-inexistente-12345')
        .expect('Content-Type', /json/)
        .expect(404);
      
      expect(response.body.error).toBeDefined();
    });
  });

  describe('Validaciones de API', () => {
    test('debería manejar Content-Type application/json correctamente', async () => {
      const newMovie = {
        title: 'Content Type Test Movie',
        year: 2024,
        director: 'Test',
        duration: 100,
        genre: ['Drama'],
        rate: 7.0
      };

      const response = await request(app)
        .post('/movies')
        .set('Content-Type', 'application/json')
        .send(newMovie)
        .expect(201);
      
      // Limpiar película creada
      await request(app).delete(`/movies/${response.body.id}`);
    });

    test('los endpoints deberían responder con JSON', async () => {
      const response = await request(app)
        .get('/movies')
        .expect('Content-Type', /json/);
      
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });
});
