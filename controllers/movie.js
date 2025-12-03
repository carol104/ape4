import { MovieModel } from '../models/index.js';

export const getAllMovies = async (req, res) => {
    try {
        // Pass query params as filters object (e.g., { genre: 'Drama' })
        const movies = await MovieModel.getAll(req.query);
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getMovieById = async (req, res) => {
    const { id } = req.params;
    try {
        const movie = await MovieModel.getById({ id });
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(movie);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createMovie = async (req, res) => {
    try {
        const movie = await MovieModel.create({ input: req.body });
        res.status(201).json(movie);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateMovie = async (req, res) => {
    const { id } = req.params;
    try {
        const updated = await MovieModel.update({ id, input: req.body });
        if (!updated) return res.status(404).json({ error: 'Movie not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteMovie = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await MovieModel.delete({ id });
        if (!deleted) return res.status(404).json({ error: 'Movie not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};