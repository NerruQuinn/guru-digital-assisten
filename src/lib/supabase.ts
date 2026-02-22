import { createClient } from '@supabase/supabase-js';

// Mengambil data dari env dengan fallback (cadangan) string kosong agar tidak crash
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Buat client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Debug sederhana: Muncul di console browser (F12) jika kunci tidak terbaca
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Waduh! Kunci Supabase tidak ditemukan di .env.local");
}