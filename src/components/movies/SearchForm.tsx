import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface SearchFormProps {
  title: string;
  setTitle: (value: string) => void;
  genre: string;
  setGenre: (value: string) => void;
  year: string;
  setYear: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  genres: any[];
  isLoading: boolean;
}

export const SearchForm = ({
  title,
  setTitle,
  genre,
  setGenre,
  year,
  setYear,
  sortBy,
  setSortBy,
  handleSearch,
  genres,
  isLoading
}: SearchFormProps) => {
  return (
    <form onSubmit={handleSearch} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="title" className="text-white">Judul Film</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul film..."
              className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="genre" className="text-white mb-1 block">Genre</Label> 
          <select
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full bg-[#2A2D3E] border border-white/20 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
          >
            <option value="" className="bg-[#2A2D3E] text-white">Semua Genre</option>
            {genres?.map((g: any) => (
              <option key={g.id} value={g.id} className="bg-[#2A2D3E] text-white">
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="year" className="text-white">Tahun Rilis</Label>
          <Input
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Masukkan tahun rilis..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Label className="text-white">Urutkan berdasarkan:</Label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#2A2D3E] border border-white/20 rounded-md px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
          >
            <option value="rating" className="bg-[#2A2D3E] text-white">Rating</option>
            <option value="year" className="bg-[#2A2D3E] text-white">Tahun</option>
            <option value="title" className="bg-[#2A2D3E] text-white">Judul</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="button-primary bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner />
              <span>Mencari...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Cari Film</span>
            </div>
          )}
        </button>
      </div>
    </form>
  );
};