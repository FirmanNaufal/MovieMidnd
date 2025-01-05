import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getMovieDetails } from "@/services/tmdb";
import { MovieBackdrop } from "@/components/movies/MovieBackdrop";
import { MovieInfo } from "@/components/movies/MovieInfo";
import { MovieActions } from "@/components/movies/MovieActions";
import { MovieCast } from "@/components/movies/MovieCast";
import { MovieProduction } from "@/components/movies/MovieProduction";
import { MovieTrailer } from "@/components/movies/MovieTrailer";

const MovieDetail = () => {
  const { id } = useParams();
  
  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">Film tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <MovieBackdrop backdropPath={movie.backdrop_path} />

      <div className="container mx-auto px-4 -mt-[30vh] md:-mt-[60vh] relative z-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-full md:w-auto">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full md:w-72 rounded-lg shadow-xl glass-card mx-auto md:mx-0"
            />
          </div>

          {/* Informasi Film */}
          <div className="flex-1 w-full">
            <MovieInfo
              title={movie.title}
              voteAverage={movie.vote_average}
              runtime={movie.runtime}
              releaseDate={movie.release_date}
            />

            <MovieActions movie={movie} />

            <div className="glass-card p-4 md:p-8 rounded-lg mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Ringkasan</h2>
              <p className="text-white/90 leading-relaxed text-sm md:text-lg">{movie.overview}</p>
            </div>
          </div>
        </div>

        {/* Bagian Trailer */}
        <div className="mt-6 md:mt-8">
          <MovieTrailer trailer={movie.trailer} />
        </div>

        {/* Bagian Pemeran */}
        <div className="mt-6 md:mt-8">
          {movie.credits?.cast && <MovieCast cast={movie.credits.cast} />}
        </div>
        
        {/* Perusahaan Produksi */}
        <div className="mt-6 md:mt-8 mb-12">
          {movie.production_companies && (
            <MovieProduction companies={movie.production_companies} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;