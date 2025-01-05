// Impor klien supabase
import { supabase } from "@/integrations/supabase/client";

// Mendefinisikan interface LikedMovie
export interface LikedMovie {
  id: number;
  title: string;
  poster: string;
  rating: string;
  year: string;
}

// Fungsi untuk mendapatkan film yang diFavoriti untuk pengguna saat ini
export const getLikedMovies = async (): Promise<LikedMovie[]> => {
  // Mendapatkan sesi saat ini
  const { data: session } = await supabase.auth.getSession();
  // Jika tidak ada pengguna yang masuk, kembalikan array kosong
  if (!session?.session?.user) return [];

  // Mengambil film yang diFavoriti dari database
  const { data, error } = await supabase
    .from('favorite_movies')
    .select('*')
    .eq('user_id', session.session.user.id);

  // Jika ada kesalahan, log dan kembalikan array kosong
  if (error) {
    console.error('Kesalahan mengambil film yang diFavoriti:', error);
    return [];
  }

  // Memetakan data ke interface LikedMovie dan mengembalikannya
  return data.map(movie => ({
    id: movie.movie_id,
    title: movie.title,
    poster: movie.poster || '',
    rating: movie.rating || '',
    year: movie.year || ''
  }));
};

// Fungsi untuk mengubah status Favorit film
export const toggleLikeMovie = async (movie: LikedMovie): Promise<boolean> => {
  // Mendapatkan sesi saat ini
  const { data: session } = await supabase.auth.getSession();
  // Jika tidak ada pengguna yang masuk, kembalikan false
  if (!session?.session?.user) return false;

  // Memeriksa apakah film sudah ada di daftar Favorit
  const { data: existingLike, error: fetchError } = await supabase
    .from('favorite_movies')
    .select()
    .eq('user_id', session.session.user.id)
    .eq('movie_id', movie.id)
    .maybeSingle();

  // Jika ada kesalahan, log dan kembalikan false
  if (fetchError) {
    console.error('Kesalahan memeriksa status Favorit:', fetchError);
    return false;
  }

  // Jika film ada di daftar Favorit, hapus
  if (existingLike) {
    const { error } = await supabase
      .from('favorite_movies')
      .delete()
      .eq('user_id', session.session.user.id)
      .eq('movie_id', movie.id);

    // Jika ada kesalahan, log dan kembalikan true
    if (error) {
      console.error('Kesalahan menghapus film dari daftar Favorit:', error);
      return true;
    }
    // Kembalikan false yang menunjukkan film telah dihapus
    return false;
  } else {
    // Jika film tidak ada di daftar Favorit, tambahkan
    const { error } = await supabase
      .from('favorite_movies')
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
      console.error('Kesalahan menambahkan film ke daftar Favorit:', error);
      return false;
    }
    // Kembalikan true yang menunjukkan film telah ditambahkan
    return true;
  }
};

// Fungsi untuk memeriksa apakah film ada di daftar Favorit
export const isMovieLiked = async (movieId: number): Promise<boolean> => {
  // Mendapatkan sesi saat ini
  const { data: session } = await supabase.auth.getSession();
  // Jika tidak ada pengguna yang masuk, kembalikan false
  if (!session?.session?.user) return false;

  // Memeriksa apakah film ada di daftar Favorit
  const { data, error } = await supabase
    .from('favorite_movies')
    .select()
    .eq('user_id', session.session.user.id)
    .eq('movie_id', movieId)
    .maybeSingle();

  // Jika ada kesalahan, log dan kembalikan false
  if (error) {
    console.error('Kesalahan memeriksa apakah film ada di daftar Favorit:', error);
    return false;
  }

  // Kembalikan true jika film ada di daftar Favorit, jika tidak kembalikan false
  return !!data;
};