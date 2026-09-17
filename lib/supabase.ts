// lib/supabase.ts
// Supabase storage client untuk upload gambar produk

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase environment variables are not configured. Check your .env file.");
}

// Gunakan service role key agar upload bisa bypass RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const STORAGE_BUCKET = "product-images";

export async function deleteImageFromSupabase(publicUrl: string | null | undefined) {
  if (!publicUrl) return;

  try {
    const urlObj = new URL(publicUrl);
    // Format standar: https://[PROJECT].supabase.co/storage/v1/object/public/[BUCKET]/[FILEPATH]
    const pathPrefix = `/storage/v1/object/public/${STORAGE_BUCKET}/`;

    if (urlObj.pathname.includes(pathPrefix)) {
      const filePath = urlObj.pathname.split(pathPrefix)[1];
      if (filePath) {
        const { error } = await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([filePath]);
        if (error) {
          console.error("Supabase GC Error:", error);
        }
      }
    }
  } catch (err) {
    console.error("Failed to parse or delete image URL:", err);
  }
}
