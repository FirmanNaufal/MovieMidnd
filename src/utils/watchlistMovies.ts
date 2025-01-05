// Impor klien supabase
import { supabase } from "@/integrations/supabase/client";

// Mendefinisikan interface WatchlistMovie
export interface WatchlistMovie {
  id: number;
  title: string;
  poster: string;
  rating: string;
  year: string;
}

// Fungsi untuk mendapatkan film watchlist untuk pengguna saat ini
export const getWatchlistMovies = async (): Promise<WatchlistMovie[]> => {
  // Mendapatkan sesi saat ini
  const { data: session } = await supabase.auth.getSession();
  // Jika tidak ada pengguna yang masuk, kembalikan array kosong
  if (!session?.session?.user) return [];

  // Mengambil film watchlist dari database
  const { data, error } = await supabase
    .from('watchlist_movies')
    .select('*')
    .eq('user_id', session.session.user.id);

  // Jika ada kesalahan, log dan kembalikan array kosong
  if (error) {
    console.error('Kesalahan mengambil film watchlist:', error);
    return [];
  }

  // Memetakan data ke interface WatchlistMovie dan mengembalikannya
  return data.map(movie => ({
    id: movie.movie_id,
    title: movie.title,
    poster: movie.poster || '',
    rating: movie.rating || '',
    year: movie.year || ''
  }));
};

// Fungsi untuk mengubah status film di watchlist
export const toggleWatchlistMovie = async (movie: WatchlistMovie): Promise<boolean> => {
  // Mendapatkan sesi saat ini
  const { data: session } = await supabase.auth.getSession();
  // Jika tidak ada pengguna yang masuk, kembalikan false
  if (!session?.session?.user) return false;

  // Memeriksa apakah film sudah ada di watchlist
  const { data: existingMovie, error: fetchError } = await supabase
    .from('watchlist_movies')
    .select()
    .eq('user_id', session.session.user.id)
    .eq('movie_id', movie.id)
    .maybeSingle();

  // Jika ada kesalahan, log dan kembalikan false
  if (fetchError) {
    console.error('Kesalahan memeriksa status watchlist:', fetchError);
    return false;
  }

  // Jika film ada di watchlist, hapus
  if (existingMovie) {
    const { error } = await supabase
      .from('watchlist_movies')
      .delete()
      .eq('user_id', session.session.user.id)
      .eq('movie_id', movie.id);

    // Jika ada kesalahan, log dan kembalikan true
    if (error) {
      console.error('Kesalahan menghapus film dari watchlist:', error);
      return true;
    }
    // Kembalikan false yang menunjukkan film telah dihapus
    return false;
  } else {
    // Jika film tidak ada di watchlist, tambahkan
    const { error } = await supabase
      .from('watchlist_movies')
      .insert({
        user_id: session.session.user.id,
        movie_id: movie.id,
        title: movie.title,
        poster: movie.poster,
        rating: movie.rating,
        year: movie.year
      });

    // Jika ada kesalahan, log dan kembalikan false
    if (error) {
      console.error('Kesalahan menambahkan film ke watchlist:', error);
      return false;
    }
    // Kembalikan true yang menunjukkan film telah ditambahkan
    return true;
  }
};

// Fungsi untuk memeriksa apakah film ada di watchlist
export const isMovieInWatchlist = async (movieId: number): Promise<boolean> => {
  // Mendapatkan sesi saat ini
  const { data: session } = await supabase.auth.getSession();
  // Jika tidak ada pengguna yang masuk, kembalikan false
  if (!session?.session?.user) return false;

  // Memeriksa apakah film ada di watchlist
  const { data, error } = await supabase
    .from('watchlist_movies')
    .select()
    .eq('user_id', session.session.user.id)
    .eq('movie_id', movieId)
    .maybeSingle();

  // Jika ada kesalahan, log dan kembalikan false
  if (error) {
    console.error('Kesalahan memeriksa apakah film ada di watchlist:', error);
    return false;
  }

  // Kembalikan true jika film ada di watchlist, jika tidak kembalikan false
  return !!data;
};