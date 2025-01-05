import { useState, useEffect } from 'react';
import { MovieCard } from './MovieCard';
import { useToast } from '@/hooks/use-toast';
import { getTrendingMovies } from '@/utils/recommendationAlgorithms';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

export const TrendingMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setIsLoading(true);
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        
        // Mengambil lebih banyak film untuk menerapkan algoritma 
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
        );
        const data = await response.json();
        
        // Menerapkan algoritma trending 
        const trendingMovies = getTrendingMovies(data.results);
        setMovies(trendingMovies);
      } catch (error) {
        console.error('Error fetching trending movies:', error);
        toast({
          title: "Error",
          description: "Gagal mengambil film trending. Silakan coba lagi nanti.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingMovies();
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