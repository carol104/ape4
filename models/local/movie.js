import { randomUUID } from 'node:crypto';
import { readJSON, writeJSON } from '../../utils.js';

const DB_PATH = './movies.json';
const movies = readJSON(DB_PATH);

export class MovieModel {
    // Accept optional filters object to avoid destructuring undefined
    static async getAll(filters = {}) {
        const { genre } = filters || {};
        if (genre) {
            return movies.filter(
                movie => movie.genre && movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
            );
        }
        return movies;
    }

    static async getById({ id }) {
        const movie = movies.find(movie => movie.id === id);
        return movie;
    }

    
    static async create({ input }) {
        const newMovie = {
            id: randomUUID(),
            ...input
        };
        movies.push(newMovie);
        // persist
        writeJSON(DB_PATH, movies);
        return newMovie;
    }

    static async delete({ id }) {
        const movieIndex = movies.findIndex(movie => movie.id === id);
        if (movieIndex === -1) return false;

        movies.splice(movieIndex, 1);
        // persist
        writeJSON(DB_PATH, movies);
        return true;
    }

    static async update({ id, input }) {
        const movieIndex = movies.findIndex(movie => movie.id === id);
        if (movieIndex === -1) return false;

        movies[movieIndex] = {
            ...movies[movieIndex],
            ...input
        };

        // persist
        writeJSON(DB_PATH, movies);
        return movies[movieIndex];
    }
}

// Backwards-compatible named helpers (optional)
export function getAllMovies(filters = {}) {
    return MovieModel.getAll(filters);
}

export function getMovieById(id) {
    return MovieModel.getById({ id });
}

export function addMovie(input) {
    return MovieModel.create({ input });
}