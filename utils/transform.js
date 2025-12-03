export function transformMovieFromDB(movie) {
  if (!movie) {
    return null;
  }

  return {
    ...movie,
    genre: typeof movie.genre === "string" ? JSON.parse(movie.genre) : movie.genre,
    rate: Number.parseFloat(movie.rate),
  };
}

export function transformMoviesFromDB(movies) {
  if (!Array.isArray(movies)) {
    return [];
  }

  return movies.map(transformMovieFromDB);
}

export function transformMovieToDB(movieData) {
  return {
    ...movieData,
    genre: Array.isArray(movieData.genre)
      ? JSON.stringify(movieData.genre)
      : movieData.genre,
  };
}

