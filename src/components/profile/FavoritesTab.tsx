import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getLikedMovies, toggleLikeMovie } from '@/utils/likedMovies';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const FavoritesTab = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [likedMovies, setLikedMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLikedMovies = async () => {
      const movies = await getLikedMovies();
      setLikedMovies(movies);
      setIsLoading(false);
    };
    fetchLikedMovies();
  }, []);

  const handleUnlikeMovie = async (movie: any) => {
    await toggleLikeMovie(movie);
    const updatedMovies = await getLikedMovies();
    setLikedMovies(updatedMovies);
    toast({
      title: "Dihapus dari favorit",
      description: `${movie.title} telah dihapus dari favorit Anda.`,
    });
  };

  if (isLoading) {
    return <div>Memuat...</div>;
  }

  if (likedMovies.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Heart className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Film Favorit</h3>
          <p className="text-white/60 text-center max-w-md">
            Mulailah menjelajah dan sukai beberapa film untuk melihatnya di sini!
          </p>
          <Button
            onClick={() => navigate('/recommendations')}
            className="mt-6"
            variant="secondary"
          >
            Temukan Film
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {likedMovies.map((movie) => (
        <div key={movie.id} className="group relative">
          <div className="aspect-[2/3] rounded-lg overflow-hidden">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold mb-1">{movie.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">{movie.year}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleUnlikeMovie(movie)}
                    className="text-white hover:text-red-500"
                  >
                    <Heart className="w-5 h-5" fill="currentColor" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};