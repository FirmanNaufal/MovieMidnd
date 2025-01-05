import { useState, useEffect } from 'react';
import { MovieCard } from './MovieCard';
import { useToast } from '@/hooks/use-toast';
import { getLikedMovies } from '@/utils/likedMovies';
import { getWatchlistMovies } from '@/utils/watchlistMovies';
import { getHybridRecommendations } from '@/utils/recommendationAlgorithms';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  genre_ids?: number[];
}

export const DailyRecommendations = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDailyMovies = async () => {
      try {
        setIsLoading(true);
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const today = new Date().toISOString().split('T')[0];
        const cacheKey = `daily_movies_${today}`;
        
        // Mendapatkan preferensi pengguna
        const [likedMovies, watchlistMovies] = await Promise.all([
          getLikedMovies(),
          getWatchlistMovies()
        ]);
        
        // Jika tidak ada preferensi, tampilkan film trending
        if (likedMovies.length === 0 && watchlistMovies.length === 0) {
          const response = await fetch(
            `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=en-US`
          );
          const data = await response.json();
          const dailyMovies = data.results.slice(0, 6);
          localStorage.setItem(cacheKey, JSON.stringify(dailyMovies));
          setMovies(dailyMovies);
          setIsLoading(false);
          return;
        }

        // Mendapatkan semua film untuk penyaringan berbasis konten
        const popularResponse = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
        );
        const popularData = await popularResponse.json();
        const allMovies = popularData.results;

        // Mengubah film yang disukai dan daftar tontonan ke format TMDB
        const userMovies = [...likedMovies, ...watchlistMovies].map(movie => ({
          id: movie.id,
          title: movie.title,
          vote_average: parseFloat(movie.rating || "0"),
          release_date: movie.year,
          poster_path: movie.poster?.replace('https://image.tmdb.org/t/p/w500', '') || '',
          overview: '',
          genre_ids: []
        }));

        // Mendapatkan rekomendasi hibrida
        const recommendations = await getHybridRecommendations(
          userMovies,
          allMovies,
          apiKey
        );

        // Cache dan set rekomendasi
        localStorage.setItem(cacheKey, JSON.stringify(recommendations));
        setMovies(recommendations);

      } catch (error) {
        console.error('Error fetching daily movies:', error);
        toast({
          title: "Error",
          description: "Gagal mengambil rekomendasi harian. Silakan coba lagi nanti.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyMovies();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white/10 rounded-lg h-[400px]"></div>
            <div className="mt-4 space-y-3">
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};