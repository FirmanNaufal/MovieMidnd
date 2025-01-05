import { Building2 } from "lucide-react";

interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
}

interface MovieProductionProps {
  companies: ProductionCompany[];
}

export const MovieProduction = ({ companies }: MovieProductionProps) => {
  if (!companies?.length) return null;

  return (
    <div className="glass-card p-4 md:p-8 rounded-lg">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
        <h2 className="text-xl md:text-2xl font-semibold text-white">Perusahaan Produksi</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {companies.map((company) => (
          <div key={company.id} className="flex flex-col items-center text-center">
            {company.logo_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                alt={company.name}
                className="h-12 md:h-16 object-contain mb-3 bg-white/10 rounded-lg p-2"
              />
            ) : (
              <div className="h-12 md:h-16 w-full flex items-center justify-center bg-white/10 rounded-lg mb-3">
                <span className="text-white/60 text-sm md:text-base px-2">{company.name}</span>
              </div>
            )}
            <p className="text-white/80 text-xs md:text-sm truncate max-w-full">{company.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};