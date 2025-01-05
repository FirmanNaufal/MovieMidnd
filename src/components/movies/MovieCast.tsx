import { Users } from "lucide-react";

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface MovieCastProps {
  cast: CastMember[];
}

export const MovieCast = ({ cast }: MovieCastProps) => {
  if (!cast?.length) return null;

  return (
    <div className="glass-card p-4 md:p-8 rounded-lg mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
        <h2 className="text-xl md:text-2xl font-semibold text-white">Aktor</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {cast.slice(0, 10).map((actor) => (
          <div key={actor.id} className="flex flex-col items-center text-center">
            <img
              src={actor.profile_path 
                ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                : 'https://via.placeholder.com/185x185?text=No+Image'
              }
              alt={actor.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-3"
            />
            <p className="text-white font-medium text-sm md:text-base truncate max-w-full">{actor.name}</p>
            <p className="text-white/60 text-xs md:text-sm truncate max-w-full">{actor.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
};