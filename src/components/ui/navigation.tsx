import { useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const ProfileButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProfileClick = () => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      toast({
        title: "Not logged in",
        description: "Please login to view your profile",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    navigate('/profile');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleProfileClick}
      className="text-white/80 hover:text-white transition-colors"
    >
      <UserCircle className="w-6 h-6" />
    </Button>
  );
};