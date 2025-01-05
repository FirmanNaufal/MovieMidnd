import { Star, Heart, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toggleLikeMovie, isMovieLiked } from '@/utils/likedMovies';
import { toggleWatchlistMovie, isMovieInWatchlist } from '@/utils/watchlistMovies';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
    overview: string;
  };
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const likedStatus = await isMovieLiked(movie.id);
      const watchlistStatus = await isMovieInWatchlist(movie.id);
      setIsLiked(likedStatus);
      setIsInWatchlist(watchlistStatus);
    };
    checkStatus();
  }, [movie.id]);

  const handleLikeMovie = async (e: React.MouseEvent) => {
    e.preventDefault();
    const liked = await toggleLikeMovie({
      id: movie.id,
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      rating: movie.vote_average.toString(),
      year: new Date(movie.release_date).getFullYear().toString(),
    });

    setIsLiked(liked);
    toast({
      title: liked ? "Ditambahkan ke favorit!" : "Dihapus dari favorit",
      description: liked 
        ? `${movie.title} telah ditambahkan ke favorit Anda.` 
        : `${movie.title} telah dihapus dari favorit Anda.`,
    });
  };

  const handleWatchlistMovie = async (e: React.MouseEvent) => {
    e.preventDefault();
    const inWatchlist = await toggleWatchlistMovie({
      id: movie.id,
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      rating: movie.vote_average.toString(),
      year: new Date(movie.release_date).getFullYear().toString(),
    });

    setIsInWatchlist(inWatchlist);
    toast({
      title: inWatchlist ? "Ditambahkan ke Watchlist!" : "Dihapus dari Watchlist",
      description: inWatchlist 
        ? `${movie.title} telah ditambahkan ke Watchlist Anda.` 
        : `${movie.title} telah dihapus dari Watchlist Anda.`,
    });
  };

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card group transform transition-all duration-300 hover:scale-[1.02]">
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <div className="text-white w-full">
            <div className="flex items-center justify-between w-full mb-2">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleWatchlistMovie}
                  className="text-white hover:text-primary"
                >
                  <Bookmark
                    className="w-6 h-6"
                    fill={isInWatchlist ? "currentColor" : "none"}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLikeMovie}
                  className="text-white hover:text-primary"
                >
                  <Heart
                    className="w-6 h-6"
                    fill={isLiked ? "currentColor" : "none"}
                  />
                </Button>
              </div>
            </div>
            <p className="text-sm opacity-90">{movie.overview}</p>
          </div>
        </div>
      </div>
      <div className="p-6 bg-white/10 backdrop-blur-lg">
        <h3 className="text-xl font-semibold mb-2 text-white">{movie.title}</h3>
        <div className="text-sm text-white/70">
          {new Date(movie.release_date).getFullYear()}
        </div>
      </div>
    </Link>
  );
};