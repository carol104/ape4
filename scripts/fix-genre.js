import dotenv from 'dotenv';
import { connectPool, query } from '../db/index.js';

dotenv.config();

/**
 * Script para limpiar/arreglar el campo genre en la tabla movies.
 * Convierte genre de string ("Action,Crime,Drama") a JSON array (["Action","Crime","Drama"])
 */

async function fixGenreField() {
  try {
    console.log('Conectando a la BD...');
    await connectPool();
    
    console.log('Obteniendo películas con genre malformado...');
    // Obtener todas las películas
    const movies = await query('SELECT id, title, genre FROM movies');
    
    let fixed = 0;
    let errors = 0;
    
    for (const movie of movies) {
      try {
        let genreArray = [];
        
        // Si genre es string, intentar parsearlo
        if (typeof movie.genre === 'string') {
          try {
            genreArray = JSON.parse(movie.genre);
          } catch (e) {
            // Si falla el parse, asumir que es string separado por comas
            genreArray = movie.genre
              .split(',')
              .map(g => g.trim())
              .filter(g => g.length > 0);
          }
        } else if (Array.isArray(movie.genre)) {
          genreArray = movie.genre;
        }
        
        // Si no está en formato JSON válido, actualizar
        const genreJson = JSON.stringify(genreArray);
        if (movie.genre !== genreJson) {
          await query('UPDATE movies SET genre = ? WHERE id = ?', [genreJson, movie.id]);
          console.log(`✓ Fixed: ${movie.title} (${movie.id})`);
          fixed++;
        }
      } catch (err) {
        console.error(`✗ Error fixing ${movie.id}:`, err.message);
        errors++;
      }
    }
    
    console.log(`\nResumen: ${fixed} películas arregladas, ${errors} errores`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

fixGenreField();
