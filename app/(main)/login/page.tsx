'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Input, Button } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Email atau password tidak sesuai');
        setLoading(false);
      } else {
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const target = urlParams?.get('callbackUrl') || '/';
        router.push(target);
        router.refresh();
      }
    } catch (err) {
      setError('Terjadi kesalahan, silakan coba beberapa saat lagi');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto py-10 px-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-charcoal dark:text-dark-text">Masuk ke Akun</h1>
        <p className="text-sm text-charcoal-muted dark:text-dark-muted mt-1">
          Akses katalog pemesanan dan riwayat transaksi
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
            <label className="block text-xs font-medium text-charcoal dark:text-dark-text mb-1" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted dark:text-dark-muted" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.com"
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
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="input-with-icon w-full pl-9"
              />
            </div>
          </div>

                      <Button type="submit" variant="primary" className="w-full mt-2" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Masuk'}
            </Button>
            
        </form>

        <div className="mt-5 pt-4 border-t border-border dark:border-dark-border text-center text-xs text-charcoal-muted dark:text-dark-muted">
          Belum punya akun?{' '}
          <Link href="/register" className="font-medium text-charcoal dark:text-dark-text underline underline-offset-2 hover:text-sage">
            Daftar di sini
          </Link>
        </div>
      </div>

      {/* Demo Credentials Box (Hanya tampil di lingkungan pengembangan) */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-6 bg-bg-subtle dark:bg-dark-surface rounded p-4 border border-border dark:border-dark-border text-xs">
          <p className="font-semibold text-charcoal dark:text-dark-text mb-2">Akun Uji Coba (Demo)</p>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@katalog.test');
                setPassword('admin123');
              }}
              className="w-full flex items-center justify-between p-2 rounded bg-white dark:bg-dark-bg border border-border dark:border-dark-border hover:border-charcoal dark:hover:border-dark-text text-left transition-colors"
            >
              <span>Admin: admin@katalog.test</span>
              <span className="text-[11px] text-charcoal-muted dark:text-dark-muted">admin123</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('buyer@katalog.test');
                setPassword('buyer123');
              }}
              className="w-full flex items-center justify-between p-2 rounded bg-white dark:bg-dark-bg border border-border dark:border-dark-border hover:border-charcoal dark:hover:border-dark-text text-left transition-colors"
            >
              <span>Pembeli: buyer@katalog.test</span>
              <span className="text-[11px] text-charcoal-muted dark:text-dark-muted">buyer123</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
