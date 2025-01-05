import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Bookmark } from 'lucide-react';
import { FavoritesTab } from './FavoritesTab';
import { WatchlistTab } from './WatchlistTab';

export const ProfileTabs = () => {
  return (
    <Tabs defaultValue="favorites" className="w-full">
      <TabsList className="w-full bg-black/20 border-b border-white/10">
        <TabsTrigger value="favorites" className="flex-1">
          <Heart className="w-4 h-4 mr-2" />
          Favorites
        </TabsTrigger>
        <TabsTrigger value="watchlist" className="flex-1">
          <Bookmark className="w-4 h-4 mr-2" />
          Watchlist
        </TabsTrigger>
      </TabsList>

      <TabsContent value="favorites">
        <FavoritesTab />
      </TabsContent>
      <TabsContent value="watchlist">
        <WatchlistTab />
      </TabsContent>
    </Tabs>
  );
};