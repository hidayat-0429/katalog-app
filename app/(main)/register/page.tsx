'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Building2, Phone, MapPin, Mail, Lock, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
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
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-150 ease-out mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kembali ke Beranda
      </Link>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Pendaftaran Akun</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Daftarkan bisnis Anda untuk mulai melakukan pemesanan rutin
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-xs text-semantic-danger-DEFAULT dark:text-semantic-danger-DEFAULT flex items-center gap-2 bg-semantic-danger-light dark:bg-semantic-danger-darkBg p-3 rounded border border-semantic-danger-DEFAULT dark:border-semantic-danger-dark">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-900 dark:text-neutral-100 mb-1" htmlFor="name">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 dark:text-neutral-400" />
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
            <label className="block text-xs font-medium text-neutral-900 dark:text-neutral-100 mb-1" htmlFor="company">
              Nama Usaha / Perusahaan <span className="text-neutral-500 dark:text-neutral-400 font-normal">(opsional)</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 dark:text-neutral-400" />
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
            <label className="block text-xs font-medium text-neutral-900 dark:text-neutral-100 mb-1" htmlFor="phone">
              Nomor Telepon / WhatsApp
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-transparent transition-colors duration-150 input-with-icon w-full pl-9"
                placeholder="081234567890"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-900 dark:text-neutral-100 mb-1" htmlFor="address">
              Alamat Pengiriman
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-transparent transition-colors duration-150 input-with-icon w-full pl-9 min-h-[70px]"
                placeholder="Alamat lengkap tujuan pengiriman..."
                disabled={loading}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
            <label className="block text-xs font-medium text-neutral-900 dark:text-neutral-100 mb-1" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-transparent transition-colors duration-150 input-with-icon w-full pl-9"
                placeholder="email@perusahaan.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-900 dark:text-neutral-100 mb-1" htmlFor="password">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-transparent transition-colors duration-150 input-with-icon w-full pl-9"
                placeholder="Minimal 6 karakter"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-forest-600 hover:bg-brand-forest-700 text-white text-sm font-semibold transition-colors duration-150 w-full mt-3 justify-center" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-700 text-center text-xs text-neutral-500 dark:text-neutral-400">
          Sudah memiliki akun?{' '}
          <Link href="/login" className="font-medium text-neutral-900 dark:text-neutral-100 underline underline-offset-2 hover:text-brand-sage-600 dark:hover:text-brand-sage-400">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
