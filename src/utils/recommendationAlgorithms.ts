// Mendefinisikan interface Movie
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  genre_ids?: number[];
}

// Menghitung skor kesamaan antara dua film berdasarkan genre
const calculateGenreSimilarity = (movie1: Movie, movie2: Movie): number => {
  if (!movie1.genre_ids || !movie2.genre_ids) return 0;
  
  const intersection = movie1.genre_ids.filter(genre => 
    movie2.genre_ids?.includes(genre)
  );
  
  const union = new Set([
    ...(movie1.genre_ids || []),
    ...(movie2.genre_ids || [])
  ]);
  
  return intersection.length / union.size;
};

// Penyaringan berbasis konten
export const getContentBasedRecommendations = (
  userMovies: Movie[],
  allMovies: Movie[],
  limit: number = 6
): Movie[] => {
  const movieScores = new Map<number, { movie: Movie; score: number }>();

  allMovies.forEach(candidateMovie => {
    let totalScore = 0;
    
    userMovies.forEach(userMovie => {
      // Kesamaan genre (bobot 40%)
      const genreScore = calculateGenreSimilarity(userMovie, candidateMovie) * 0.4;
      
      // Kesamaan tanggal rilis (bobot 20%)
      const yearDiff = Math.abs(
        new Date(userMovie.release_date).getFullYear() -
        new Date(candidateMovie.release_date).getFullYear()
      );
      const yearScore = (1 / (1 + yearDiff)) * 0.2;
      
      // Kesamaan rating (bobot 40%)
      const ratingDiff = Math.abs(userMovie.vote_average - candidateMovie.vote_average);
      const ratingScore = (1 / (1 + ratingDiff)) * 0.4;
      
      totalScore += genreScore + yearScore + ratingScore;
    });

    // Menormalkan skor berdasarkan jumlah film pengguna
    const averageScore = totalScore / (userMovies.length || 1);
    
    if (!movieScores.has(candidateMovie.id)) {
      movieScores.set(candidateMovie.id, {
        movie: candidateMovie,
        score: averageScore
      });
    }
  });

  return Array.from(movieScores.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.movie);
};

// Penyaringan kolaboratif menggunakan rekomendasi TMDB
export const getCollaborativeRecommendations = async (
  movieId: number,
  apiKey: string
): Promise<Movie[]> => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${apiKey}&language=en-US&page=1`
  );
  const data = await response.json();
  return data.results;
};

// Sistem rekomendasi hibrida
export const getHybridRecommendations = async (
  userMovies: Movie[],
  allMovies: Movie[],
  apiKey: string,
  limit: number = 6
): Promise<Movie[]> => {
  // Mendapatkan rekomendasi berbasis konten
  const contentBasedRecs = getContentBasedRecommendations(userMovies, allMovies);
  
  // Mendapatkan rekomendasi kolaboratif untuk setiap film pengguna
  const collaborativePromises = userMovies.map(movie =>
    getCollaborativeRecommendations(movie.id, apiKey)
  );
  
  const collaborativeResults = await Promise.all(collaborativePromises);
  const collaborativeRecs = collaborativeResults.flat();
  
  // Menggabungkan dan memberi skor rekomendasi
  const hybridScores = new Map<number, { movie: Movie; score: number }>();
  
  // Memberi skor rekomendasi berbasis konten (bobot 50%)
  contentBasedRecs.forEach((movie, index) => {
    const score = (contentBasedRecs.length - index) / contentBasedRecs.length * 0.5;
    hybridScores.set(movie.id, { movie, score });
  });
  
  // Memberi skor rekomendasi kolaboratif (bobot 50%)
  collaborativeRecs.forEach((movie, index) => {
    const score = (collaborativeRecs.length - index) / collaborativeRecs.length * 0.5;
    if (hybridScores.has(movie.id)) {
      const existing = hybridScores.get(movie.id);
      if (existing) {
        existing.score += score;
      }
    } else {
      hybridScores.set(movie.id, { movie, score });
    }
  });
  
  // Mengurutkan dan mengembalikan rekomendasi teratas
  return Array.from(hybridScores.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.movie);
};

// Algoritma tren dengan bobot popularitas dan kebaruan
export const getTrendingMovies = (
  movies: Movie[],
  limit: number = 6
): Movie[] => {
  return movies
    .map(movie => {
      const releaseDate = new Date(movie.release_date);
      const now = new Date();
      const monthsOld = (now.getFullYear() - releaseDate.getFullYear()) * 12 +
        (now.getMonth() - releaseDate.getMonth());
      
      // Menghitung skor kebaruan (bobot 40%)
      const recencyScore = Math.exp(-monthsOld / 12) * 0.4;
      
      // Menghitung skor popularitas (bobot 60%)
      const popularityScore = (movie.vote_average / 10) * 0.6;
      
      return {
        movie,
        score: recencyScore + popularityScore
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.movie);
};