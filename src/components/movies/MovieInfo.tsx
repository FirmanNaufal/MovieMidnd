import { Star, Clock, Calendar } from "lucide-react";

interface MovieInfoProps {
  title: string;
  voteAverage: number;
  runtime: number;
  releaseDate: string;
}

export const MovieInfo = ({ title, voteAverage, runtime, releaseDate }: MovieInfoProps) => {
  return (
    <>
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">{title}</h1>
      
      <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="flex items-center gap-2 glass-card px-3 md:px-4 py-1.5 md:py-2 rounded-full">
          <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" fill="currentColor" />
          <span className="text-sm md:text-base text-white font-semibold">{voteAverage.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-2 glass-card px-3 md:px-4 py-1.5 md:py-2 rounded-full">
          <Clock className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base text-white font-semibold">{runtime} min</span>
        </div>
        <div className="flex items-center gap-2 glass-card px-3 md:px-4 py-1.5 md:py-2 rounded-full">
          <Calendar className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base text-white font-semibold">
            {new Date(releaseDate).getFullYear()}
          </span>
        </div>
      </div>
    </>
  );
};