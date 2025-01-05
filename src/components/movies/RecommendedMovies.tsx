import { useState, useEffect } from 'react';
import { MovieCard } from './MovieCard';
import { getLikedMovies } from '@/utils/likedMovies';
import { useToast } from '@/hooks/use-toast';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

export const RecommendedMovies = () => {
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const likedMovies = await getLikedMovies();
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        
        // Jika tidak ada film yang disukai, ambil film populer
        if (likedMovies.length === 0) {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
          );
          const data = await response.json();
          setRecommendedMovies(data.results.slice(0, 6));
        } else {
          // Dapatkan rekomendasi berdasarkan film yang pertama disukai
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${likedMovies[0].id}/recommendations?api_key=${apiKey}&language=en-US&page=1`
          );
          const data = await response.json();
          setRecommendedMovies(data.results.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching recommended movies:', error);
        toast({
          title: "Error",
          description: "Gagal mengambil rekomendasi film. Silakan coba lagi nanti.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
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
      {recommendedMovies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};