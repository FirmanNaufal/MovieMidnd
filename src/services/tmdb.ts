import axios from 'axios';

// Kunci API TMDB
const TMDB_API_KEY = '181238a7d39db644eb7477df2b6c08de';
// URL dasar untuk API TMDB
const BASE_URL = 'https://api.themoviedb.org/3';

// Membuat instance axios dengan konfigurasi dasar
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Mendefinisikan interface Movie
export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  runtime?: number;
  director?: string;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
  production_companies?: Array<{
    id: number;
    name: string;
    logo_path: string | null;
  }>;
}

// Fungsi untuk mencari film berdasarkan query, tahun, atau genre
export const searchMovies = async (query?: string, year?: string, genre?: string) => {
  // Jika ada query, gunakan endpoint search/movie
  if (query) {
    const params: any = {
      query,
      include_adult: false,
      language: 'en-US',
    };

    if (year) {
      params.primary_release_year = year;
    }
    if (genre) params.with_genres = genre;

    const response = await tmdbApi.get('/search/movie', { params });
    return response.data.results;
  } 
  // Jika tidak ada query tetapi ada genre/tahun, gunakan endpoint discover/movie
  else {
    const params: any = {
      include_adult: false,
      language: 'en-US',
      sort_by: 'popularity.desc',
    };

    if (year) {
      params.primary_release_year = year;
    }
    if (genre) params.with_genres = genre;

    const response = await tmdbApi.get('/discover/movie', { params });
    return response.data.results;
  }
};

// Fungsi untuk mendapatkan detail film berdasarkan ID film
export const getMovieDetails = async (movieId: number) => {
  const [movieResponse, creditsResponse, videosResponse] = await Promise.all([
    tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,production_companies'
      }
    }),
    tmdbApi.get(`/movie/${movieId}/credits`),
    tmdbApi.get(`/movie/${movieId}/videos`),
  ]);

  const director = creditsResponse.data.crew.find(
    (person: any) => person.job === 'Director'
  );

  const trailer = videosResponse.data.results.find(
    (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  return {
    ...movieResponse.data,
    director: director?.name,
    credits: creditsResponse.data,
    trailer: trailer || null,
  };
};

// Fungsi untuk mendapatkan daftar genre film
export const getGenres = async () => {
  const response = await tmdbApi.get('/genre/movie/list');
  return response.data.genres;
};