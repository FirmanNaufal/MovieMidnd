import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Clapperboard, TrendingUp, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { DailyRecommendations } from '@/components/movies/DailyRecommendations';
import { TrendingMovies } from '@/components/movies/TrendingMovies';
import { ProfileButton } from '@/components/ui/navigation';

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk mendapatkan rekomendasi film
  const handleGetRecommendations = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/recommendations');
      toast({
        title: "Siap untuk menjelajah!",
        description: "Mari temukan film favorit Anda berikutnya.",
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2F] relative overflow-hidden">
      {/* Elemen Dekoratif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Navigasi */}
      <nav className="fixed top-0 w-full bg-black/10 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Film className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-xl font-semibold text-white">MovieMind</span>
          </div>
          <ProfileButton />
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="pt-32 pb-20 px-4 relative z-10">
        <div className="container mx-auto text-center animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Clapperboard className="w-12 h-12 text-primary animate-bounce" />
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
              Temukan Film Favorit Anda Berikutnya
            </h1>
            <Clapperboard className="w-12 h-12 text-purple-600 animate-bounce" />
          </div>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Dapatkan rekomendasi film yang dipersonalisasi berdasarkan preferensi dan selera Anda.
          </p>
          <button
            onClick={handleGetRecommendations}
            disabled={isLoading}
            className="button-primary text-lg px-8 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 relative group"
          >
            <span className="relative z-10">
              {isLoading ? "Memuat..." : "Dapatkan Rekomendasi Film"}
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
          </button>
        </div>

        {/* Rekomendasi Harian */}
        <div className="mt-24">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            <h2 className="text-3xl font-semibold text-center text-white">
              Pilihan Hari Ini Untuk Anda
            </h2>
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <DailyRecommendations />
        </div>

        {/* Film Trending */}
        <div className="mt-24">
          <div className="flex items-center justify-center gap-3 mb-8">
            <TrendingUp className="w-8 h-8 text-purple-600 animate-pulse" />
            <h2 className="text-3xl font-semibold text-center text-white">
              Trending Minggu Ini
            </h2>
            <TrendingUp className="w-8 h-8 text-purple-600 animate-pulse" />
          </div>
          <TrendingMovies />
        </div>
      </main>
    </div>
  );
};

export default Home;