import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdmin, STORAGE_BUCKET } from "@/lib/supabase";
import { getErrorMessage } from "@/lib/utils/errors";
import { logError } from "@/lib/utils/logger";
import { apiSuccess, ApiErrors } from "@/lib/utils/apiResponse";
import { getServerMessages } from "@/lib/serverMessages";

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function POST(req: NextRequest) {
  const t = await getServerMessages();
  
  try {
    // Hanya admin yang bisa upload gambar produk
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return ApiErrors.forbidden(t.server.uploadAccessDenied);
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return ApiErrors.badRequest(t.server.fileNotFound);
    }

    // Validasi MIME type (SVG dikecualikan untuk mencegah Stored XSS)
    const ext = MIME_TO_EXT[file.type];
    if (!ext) {
      return ApiErrors.badRequest(t.server.invalidImageFormat);
    }

    // Validasi ukuran (max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return ApiErrors.badRequest(t.server.fileTooLarge);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat filename yang unik dan aman
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const cleanName = file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30) || "product";
    const fileName = `products/${Date.now()}-${cleanName}-${randomSuffix}${ext}`;

    // Cek apakah env Supabase Storage sudah dikonfigurasi
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return ApiErrors.internal(t.server.supabaseNotConfigured);
    }

    // Upload ke Supabase Storage
    const { data, error } = await getAdmin().storage
      .from(STORAGE_BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      logError("Supabase upload error:", error);
      return ApiErrors.internal(`${t.server.uploadFailed}: ${error.message}`);
    }

    // Dapatkan URL publik gambar
    const { data: publicUrlData } = getAdmin().storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return apiSuccess({ url: publicUrlData.publicUrl });
  } catch (error: unknown) {
    logError("Upload error:", error);
    return ApiErrors.internal(getErrorMessage(error, t.server.uploadFailed));
  }
}
