'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Building2, Phone, MapPin, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { registerUser } from '@/lib/actions/auth';
import { Input, Button } from '@/components/ui';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    address: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });

      const res = await registerUser(formDataObj);

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        const signInRes = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });
        
        if (signInRes?.error) {
          router.push('/login');
        } else {
          router.push('/');
          router.refresh();
        }
      }
    } catch (err) {
      setError('Terjadi kesalahan yang tidak terduga');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-charcoal dark:text-dark-text">Pendaftaran Akun</h1>
        <p className="text-sm text-charcoal-muted dark:text-dark-muted mt-1">
          Daftarkan bisnis Anda untuk mulai melakukan pemesanan rutin
        </p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-xs text-[#B91C1C] dark:text-[#F87171] flex items-center gap-2 bg-red-50 dark:bg-red-950/20 p-3 rounded border border-red-200 dark:border-red-900/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-charcoal dark:text-dark-text mb-1" htmlFor="name">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted dark:text-dark-muted" />
                              <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nama penanggung jawab"
                  required
                  disabled={loading}
                  className="input-with-icon w-full pl-9"
                />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal dark:text-dark-text mb-1" htmlFor="company">
              Nama Usaha / Perusahaan <span className="text-charcoal-muted dark:text-dark-muted font-normal">(opsional)</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted dark:text-dark-muted" />
              <Input
                id="company"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Contoh: CV Rasa Utama / Restoran Selasa"
                disabled={loading}
                className="input-with-icon w-full pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal dark:text-dark-text mb-1" htmlFor="phone">
              Nomor Telepon / WhatsApp
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted dark:text-dark-muted" />
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="input input-with-icon w-full pl-9"
                placeholder="081234567890"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal dark:text-dark-text mb-1" htmlFor="address">
              Alamat Pengiriman
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-charcoal-muted dark:text-dark-muted" />
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input input-with-icon w-full pl-9 min-h-[70px]"
                placeholder="Alamat lengkap tujuan pengiriman..."
                disabled={loading}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-border dark:border-dark-border">
            <label className="block text-xs font-medium text-charcoal dark:text-dark-text mb-1" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted dark:text-dark-muted" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-with-icon w-full pl-9"
                placeholder="email@perusahaan.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal dark:text-dark-text mb-1" htmlFor="password">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted dark:text-dark-muted" />
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-with-icon w-full pl-9"
                placeholder="Minimal 6 karakter"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full mt-3" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-border dark:border-dark-border text-center text-xs text-charcoal-muted dark:text-dark-muted">
          Sudah memiliki akun?{' '}
          <Link href="/login" className="font-medium text-charcoal dark:text-dark-text underline underline-offset-2 hover:text-sage">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
