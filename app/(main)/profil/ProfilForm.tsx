"use client";

import { useState } from "react";
import { User, Building2, Phone, MapPin, Mail, AlertCircle, Save, Loader2, CheckCircle2 } from "lucide-react";
import { updateProfile } from "@/lib/actions/users";
import { Input, Button, Card } from "@/components/ui";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  companyName?: string | null;
  phone?: string | null;
  address?: string | null;
}

export default function ProfilForm({ user }: { user: ProfileData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await updateProfile(formData);

      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Terjadi kesalahan yang tidak terduga.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-6 font-sans">
      {error && (
        <div className="text-xs text-[#B91C1C] dark:text-[#F87171] flex items-center gap-2 bg-red-50 dark:bg-red-950/20 p-3 rounded border border-red-200 dark:border-red-900/30">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="text-xs text-primary flex items-center gap-2 bg-primary/10 p-3 rounded border border-primary/30">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Data profil berhasil diperbarui!</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-charcoal border-b border-border pb-2">
            Data Penanggung Jawab
          </h3>
          
          <div>
            <label className="block text-xs font-medium text-charcoal mb-1" htmlFor="name">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={user.name}
                required
                disabled={loading}
                className="input-with-icon w-full pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal mb-1" htmlFor="company">
              Nama Usaha / Perusahaan <span className="text-charcoal-muted font-normal">(opsional)</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
              <Input
                id="company"
                name="companyName"
                type="text"
                defaultValue={user.companyName || ""}
                disabled={loading}
                className="input-with-icon w-full pl-9"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-charcoal mb-1">
              Alamat Email Akun
            </label>
            <div className="relative opacity-60">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
              <Input
                type="email"
                value={user.email}
                disabled
                readOnly
                className="input-with-icon w-full pl-9 bg-bg-subtle"
              />
            </div>
            <p className="text-[10px] text-charcoal-muted mt-1">Email digunakan untuk login dan tidak dapat diubah.</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-charcoal border-b border-border pb-2">
            Kontak & Pengiriman
          </h3>

          <div>
            <label className="block text-xs font-medium text-charcoal mb-1" htmlFor="phone">
              Nomor Telepon / WhatsApp
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={user.phone || ""}
                required
                disabled={loading}
                className="input input-with-icon w-full pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal mb-1" htmlFor="address">
              Alamat Pengiriman Utama
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-charcoal-muted" />
              <textarea
                id="address"
                name="address"
                defaultValue={user.address || ""}
                required
                disabled={loading}
                className="input input-with-icon w-full pl-9 min-h-[95px]"
                placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kodepos..."
              />
            </div>
            <p className="text-[10px] text-charcoal-muted mt-1">Ini akan otomatis digunakan saat pemesanan baru (Checkout).</p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border flex justify-end">
        <Button type="submit" variant="primary" disabled={loading} className="gap-2 px-6">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Simpan Perubahan</span>
        </Button>
      </div>
    </form>
  );
}
