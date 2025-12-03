import { randomUUID } from "node:crypto";
import { query } from "../../db/index.js";
import {
  transformMovieFromDB,
  transformMoviesFromDB,
  transformMovieToDB,
} from "../../utils/transform.js";

export class MovieModel {
  static async getAll(filters = {}) {
    try {
      const { genre } = filters || {};
      if (genre) {
        const sql = `SELECT * FROM movies WHERE JSON_CONTAINS(genre, JSON_QUOTE(?))`;
        const rows = await query(sql, [genre]);
        return transformMoviesFromDB(rows);
      }
      const rows = await query("SELECT * FROM movies");
      return transformMoviesFromDB(rows);
    } catch (error) {
      console.error("Error al obtener películas:", error);
      throw error;
    }
  }

  static async getById({ id }) {
    try {
      const rows = await query("SELECT * FROM movies WHERE id = ?", [id]);
      if (!rows[0]) return null;
      return transformMovieFromDB(rows[0]);
    } catch (error) {
      console.error("Error al obtener película por ID:", error);
      throw error;
    }
  }

  static async create({ input }) {
    try {
      const id = randomUUID();
      const movieData = transformMovieToDB({ id, ...input });
      const sql = `INSERT INTO movies (id, title, year, director, duration, poster, genre, rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      await query(sql, [
        movieData.id,
        movieData.title,
        movieData.year,
        movieData.director,
        movieData.duration,
        movieData.poster,
        movieData.genre,
        movieData.rate,
      ]);
      const createdMovie = await this.getById({ id });
      return createdMovie;
    } catch (error) {
      console.error("Error al crear película:", error);
      throw error;
    }
  }

  static async delete({ id }) {
    try {
      const res = await query("DELETE FROM movies WHERE id = ?", [id]);
      return res.affectedRows && res.affectedRows > 0;
    } catch (error) {
      console.error("Error al eliminar película:", error);
      throw error;
    }
  }

  static async update({ id, input }) {
    try {
      const movieData = transformMovieToDB(input);
      const fields = [];
      const params = [];
      
      if (movieData.title !== undefined) {
        fields.push("title = ?");
        params.push(movieData.title);
      }
      if (movieData.year !== undefined) {
        fields.push("year = ?");
        params.push(movieData.year);
      }
      if (movieData.director !== undefined) {
        fields.push("director = ?");
        params.push(movieData.director);
      }
      if (movieData.duration !== undefined) {
        fields.push("duration = ?");
        params.push(movieData.duration);
      }
      if (movieData.poster !== undefined) {
        fields.push("poster = ?");
        params.push(movieData.poster);
      }
      if (movieData.genre !== undefined) {
        fields.push("genre = ?");
        params.push(movieData.genre);
      }
      if (movieData.rate !== undefined) {
        fields.push("rate = ?");
        params.push(movieData.rate);
      }

      if (fields.length === 0) return false;

      const sql = `UPDATE movies SET ${fields.join(", ")} WHERE id = ?`;
      params.push(id);
      const res = await query(sql, params);
      if (res.affectedRows && res.affectedRows > 0) {
        const updated = await this.getById({ id });
        return updated;
      }
      return false;
    } catch (error) {
      console.error("Error al actualizar película:", error);
      throw error;
    }
  }
}
