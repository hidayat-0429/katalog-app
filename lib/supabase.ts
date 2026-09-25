// lib/supabase.ts
// Supabase storage client untuk upload gambar produk

import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const STORAGE_BUCKET = "product-images";

// Lazy initialization client hanya dibuat saat pertama kali dipanggil,
// bukan saat module di-load. Ini mencegah crash saat startup jika env belum diset.
let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Supabase environment variables are not configured. " +
      "Tambahkan NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di file .env"
    );
  }

  // Gunakan service role key agar upload bisa bypass RLS
  _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  return _supabaseAdmin;
}

/**
 * Mendapatkan Supabase admin client.
 * Melempar error jika env belum dikonfigurasi.
 * Gunakan ini di route handler & server actions yang memang butuh Supabase.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  return getSupabaseAdmin();
}

/**
 * Alias langsung — dipakai di app/api/upload/route.ts.
 * Menggunakan getter function bukan Proxy untuk kompatibilitas penuh.
 */
export function getAdmin(): SupabaseClient {
  return getSupabaseAdmin();
}

export async function deleteImageFromSupabase(publicUrl: string | null | undefined) {
  if (!publicUrl) return;

  // Jika env Supabase belum dikonfigurasi, skip saja (jangan crash)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("Supabase env tidak dikonfigurasi — skip hapus gambar.");
    return;
  }

  try {
    const client = getSupabaseAdmin();
    const urlObj = new URL(publicUrl);
    // Format standar: https://[PROJECT].supabase.co/storage/v1/object/public/[BUCKET]/[FILEPATH]
    const pathPrefix = `/storage/v1/object/public/${STORAGE_BUCKET}/`;

    if (urlObj.pathname.includes(pathPrefix)) {
      const filePath = urlObj.pathname.split(pathPrefix)[1];
      if (filePath) {
        const { error } = await client.storage.from(STORAGE_BUCKET).remove([filePath]);
        if (error) {
          console.error("Supabase GC Error:", error);
        }
      }
    }
  } catch (err) {
    console.error("Failed to parse or delete image URL:", err);
  }
}
