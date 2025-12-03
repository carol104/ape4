/**
 * PRUEBAS UNITARIAS - MovieModel CRUD
 * 
 * Este archivo contiene pruebas unitarias para verificar el correcto
 * funcionamiento de las operaciones CRUD del modelo de películas.
 */

import { jest } from '@jest/globals';
import { MovieModel } from '../../models/local/movie.js';

describe('MovieModel - Pruebas Unitarias CRUD', () => {
  
  // Variable para almacenar el ID de la película creada en las pruebas
  let createdMovieId;

  // Datos de película de prueba
  const testMovieData = {
    title: 'Test Movie - Prueba Unitaria',
    year: 2024,
    director: 'Director de Prueba',
    duration: 120,
    poster: 'https://example.com/poster.jpg',
    genre: ['Action', 'Drama'],
    rate: 8.5
  };

  describe('CREATE - Crear película', () => {
    test('debería crear una nueva película correctamente', async () => {
      const newMovie = await MovieModel.create({ input: testMovieData });
      
      // Guardar ID para pruebas posteriores
      createdMovieId = newMovie.id;
      
      // Verificaciones
      expect(newMovie).toBeDefined();
      expect(newMovie.id).toBeDefined();
      expect(newMovie.title).toBe(testMovieData.title);
      expect(newMovie.year).toBe(testMovieData.year);
      expect(newMovie.director).toBe(testMovieData.director);
      expect(newMovie.duration).toBe(testMovieData.duration);
      expect(newMovie.genre).toEqual(testMovieData.genre);
      expect(newMovie.rate).toBe(testMovieData.rate);
    });

    test('debería generar un UUID único para cada película', async () => {
      const movie1 = await MovieModel.create({ input: { ...testMovieData, title: 'Movie UUID 1' } });
      const movie2 = await MovieModel.create({ input: { ...testMovieData, title: 'Movie UUID 2' } });
      
      expect(movie1.id).not.toBe(movie2.id);
      
      // Limpiar películas creadas
      await MovieModel.delete({ id: movie1.id });
      await MovieModel.delete({ id: movie2.id });
    });
  });

  describe('READ - Obtener películas', () => {
    test('debería obtener todas las películas', async () => {
      const movies = await MovieModel.getAll();
      
      expect(movies).toBeDefined();
      expect(Array.isArray(movies)).toBe(true);
      expect(movies.length).toBeGreaterThan(0);
    });

    test('debería obtener películas filtradas por género', async () => {
      const moviesAction = await MovieModel.getAll({ genre: 'Action' });
      
      expect(moviesAction).toBeDefined();
      expect(Array.isArray(moviesAction)).toBe(true);
      
      // Verificar que todas las películas tengan el género buscado
      moviesAction.forEach(movie => {
        const hasGenre = movie.genre.some(g => g.toLowerCase() === 'action');
        expect(hasGenre).toBe(true);
      });
    });

    test('debería obtener una película por ID existente', async () => {
      // Usar el ID de la película creada anteriormente
      if (createdMovieId) {
        const movie = await MovieModel.getById({ id: createdMovieId });
        
        expect(movie).toBeDefined();
        expect(movie.id).toBe(createdMovieId);
      }
    });

    test('debería retornar undefined para un ID inexistente', async () => {
      const movie = await MovieModel.getById({ id: 'id-inexistente-12345' });
      
      expect(movie).toBeUndefined();
    });
  });

  describe('UPDATE - Actualizar película', () => {
    test('debería actualizar una película existente', async () => {
      const updateData = {
        title: 'Test Movie - ACTUALIZADA',
        rate: 9.5
      };
      
      const updatedMovie = await MovieModel.update({ 
        id: createdMovieId, 
        input: updateData 
      });
      
      expect(updatedMovie).toBeDefined();
      expect(updatedMovie.title).toBe(updateData.title);
      expect(updatedMovie.rate).toBe(updateData.rate);
      // Los demás campos deben permanecer igual
      expect(updatedMovie.director).toBe(testMovieData.director);
    });

    test('debería retornar false para actualizar película inexistente', async () => {
      const result = await MovieModel.update({ 
        id: 'id-inexistente-12345', 
        input: { title: 'No existe' } 
      });
      
      expect(result).toBe(false);
    });
  });

  describe('DELETE - Eliminar película', () => {
    test('debería eliminar una película existente', async () => {
      const result = await MovieModel.delete({ id: createdMovieId });
      
      expect(result).toBe(true);
      
      // Verificar que ya no existe
      const deletedMovie = await MovieModel.getById({ id: createdMovieId });
      expect(deletedMovie).toBeUndefined();
    });

    test('debería retornar false para eliminar película inexistente', async () => {
      const result = await MovieModel.delete({ id: 'id-inexistente-12345' });
      
      expect(result).toBe(false);
    });
  });

  describe('Validaciones adicionales', () => {
    test('getAll debería funcionar sin parámetros', async () => {
      const movies = await MovieModel.getAll();
      expect(movies).toBeDefined();
      expect(Array.isArray(movies)).toBe(true);
    });

    test('getAll debería funcionar con objeto vacío', async () => {
      const movies = await MovieModel.getAll({});
      expect(movies).toBeDefined();
      expect(Array.isArray(movies)).toBe(true);
    });
  });
});
