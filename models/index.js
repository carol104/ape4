import dotenv from 'dotenv';
dotenv.config();

import { MovieModel as LocalModel } from './local/movie.js';
import { MovieModel as DBModel } from './database/movie.js';

const storage = (process.env.STORAGE || 'json').toLowerCase();

export const MovieModel = storage === 'mysql' ? DBModel : LocalModel;
export default MovieModel;
