import { Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleLikeMovie, isMovieLiked } from "@/utils/likedMovies";
import { toggleWatchlistMovie, isMovieInWatchlist } from "@/utils/watchlistMovies";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface MovieActionsProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
  };
}

export const MovieActions = ({ movie }: MovieActionsProps) => {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const [likedStatus, watchlistStatus] = await Promise.all([
        isMovieLiked(movie.id),
        isMovieInWatchlist(movie.id)
      ]);
      setIsLiked(likedStatus);
      setIsInWatchlist(watchlistStatus);
    };
    checkStatus();
  }, [movie.id]);

  const handleLikeMovie = async () => {
    const newLikedStatus = await toggleLikeMovie({
      id: movie.id,
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      rating: movie.vote_average.toString(),
      year: new Date(movie.release_date).getFullYear().toString(),
    });

    setIsLiked(newLikedStatus);
    toast({
      title: newLikedStatus ? "Ditambahkan ke favorit!" : "Dihapus dari favorit",
      description: newLikedStatus 
        ? `${movie.title} telah ditambahkan ke favorit Anda.` 
        : `${movie.title} telah dihapus dari favorit Anda.`,
    });
  };

  const handleWatchlistMovie = async () => {
    const newWatchlistStatus = await toggleWatchlistMovie({
      id: movie.id,
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      rating: movie.vote_average.toString(),
      year: new Date(movie.release_date).getFullYear().toString(),
    });

    setIsInWatchlist(newWatchlistStatus);
    toast({
      title: newWatchlistStatus ? "Ditambahkan ke Watchlist!" : "Dihapus dari Watchlist",
      description: newWatchlistStatus 
        ? `${movie.title} telah ditambahkan ke Watchlist Anda.` 
        : `${movie.title} telah dihapus dari Watchlist Anda.`,
    });
  };

  return (
    <div className="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8">
      <Button
        variant="secondary"
        size="lg"
        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm md:text-base"
        onClick={handleLikeMovie}
      >
        <Heart
          className="w-4 h-4 md:w-5 md:h-5"
          fill={isLiked ? "currentColor" : "none"}
        />
        {isLiked ? "Hapus dari favorit" : "Tambahkan ke favorit"}
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm md:text-base"
        onClick={handleWatchlistMovie}
      >
        <Bookmark
          className="w-4 h-4 md:w-5 md:h-5"
          fill={isInWatchlist ? "currentColor" : "none"}
        />
        {isInWatchlist ? "Hapus dari Watchlist" : "Tambahkan keWatchlist"}
      </Button>
    </div>
  );
};