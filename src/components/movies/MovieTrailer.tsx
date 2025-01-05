interface MovieTrailerProps {
  trailer: {
    key: string;
    name: string;
  } | null;
}

export const MovieTrailer = ({ trailer }: MovieTrailerProps) => {
  if (!trailer) return null;

  return (
    <div className="glass-card p-4 md:p-8 rounded-lg mb-6 md:mb-8">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Official Trailer</h2>
      <div className="relative pb-[56.25%] h-0">
        <iframe
          src={`https://www.youtube.com/embed/${trailer.key}`}
          title={trailer.name}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};