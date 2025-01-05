import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MovieBackdropProps {
  backdropPath: string;
}

export const MovieBackdrop = ({ backdropPath }: MovieBackdropProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="fixed top-4 left-4 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </div>

      <div 
        className="relative h-[50vh] md:h-[80vh] w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${backdropPath})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F2C] via-[#1A1F2C]/80 to-transparent" />
      </div>
    </>
  );
};