import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { searchMovies, getGenres } from '@/services/tmdb';
import { SearchForm } from '@/components/movies/SearchForm';
import { MovieGrid } from '@/components/movies/MovieGrid';

const Recommendations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [searchParams, setSearchParams] = useState({ title: '', year: '', genre: '' });

  // Mengambil genre
  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
  });

  // Mencari film
  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies', searchParams],
    queryFn: () => searchMovies(searchParams.title, searchParams.year, searchParams.genre),
    enabled: !!(searchParams.title || searchParams.genre || searchParams.year),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (year && !/^\d{4}$/.test(year)) {
      toast({
        title: "Format tahun tidak valid",
        description: "Masukkan tahun 4 digit yang valid (misalnya, 2024)",
        variant: "destructive"
      });
      return;
    }
    setSearchParams({ title, year, genre });
    toast({
      title: "Mencari film",
      description: "Mencari film yang sesuai dengan kriteria Anda...",
    });
  };

  const sortMovies = (movies: any[] = []) => {
    return [...movies].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.vote_average - a.vote_average;
        case 'year':
          return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2F]">
      <nav className="fixed top-0 w-full bg-black/10 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Film className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-xl font-semibold text-white">MovieMind</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-32 pb-20">
        <Card className="max-w-4xl mx-auto glass-card animate-fade-in bg-white/5 backdrop-blur-xl border-white/10">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-white">Temukan Film Berikutnya</h2>
            <SearchForm
              title={title}
              setTitle={setTitle}
              genre={genre}
              setGenre={setGenre}
              year={year}
              setYear={setYear}
              sortBy={sortBy}
              setSortBy={setSortBy}
              handleSearch={handleSearch}
              genres={genres || []}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        <MovieGrid 
          movies={sortMovies(movies)} 
          isLoading={isLoading} 
        />
      </main>
    </div>
  );
};

export default Recommendations;