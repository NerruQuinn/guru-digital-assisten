import { createClient } from '@supabase/supabase-js';

// 1. Ambil data dari .env.local
// Gunakan || '' agar jika kunci kosong, aplikasi tidak langsung mati/error
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// 2. Buat koneksi ke Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 3. Tambahkan pengecekan otomatis (Muncul di F12 Console)
// Ini akan memberi tahu kamu jika file .env.local belum terbaca oleh Vite
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ Error: VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY tidak ditemukan!");
  console.log("Pastikan kamu sudah membuat file .env.local di folder luar dan melakukan restart terminal (npm run dev).");
}