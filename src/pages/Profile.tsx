import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { User, Mail, MapPin, Calendar, Phone, LogOut, ArrowLeft } from 'lucide-react';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { useEffect } from 'react';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mendapatkan data pengguna dari localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const isLoggedIn = !!userData.username;

  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Akses Ditolak",
        description: "Silakan login untuk melihat profil Anda",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [isLoggedIn, navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    toast({
      title: "Berhasil keluar",
      description: "Sampai jumpa lagi!",
    });
    navigate('/login');
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2F]">
      {/* Header */}
      <div className="w-full bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-white hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Beranda
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
            <User className="w-16 h-16 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-4">{userData.username}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                {userData.email}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {userData.location || 'Lokasi belum diatur'}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Bergabung sejak {new Date(userData.joinDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                {userData.phone || 'Nomor telepon belum diatur'}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ProfileTabs />
      </div>
    </div>
  );
};

export default Profile;