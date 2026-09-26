'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Input, Button } from '@/components/ui';
import { useTranslations } from '@/hooks/useTranslations';

export default function LoginPage() {
  const t = useTranslations();
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
        setError(t.login.error);
        setLoading(false);
      } else {
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const rawCallback = urlParams?.get('callbackUrl') || '/';
        // Validasi: hanya izinkan path relatif (dimulai '/') dan tidak mengandung '//' 
        // untuk mencegah open redirect ke domain eksternal
        const isSafeRedirect = rawCallback.startsWith('/') && !rawCallback.startsWith('//');
        const target = isSafeRedirect ? rawCallback : '/';
        router.push(target);
        router.refresh();
      }
    } catch (err) {
      setError(t.login.errorGeneral);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto py-10 px-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-150 ease-out mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {t.login.backToHome}
      </Link>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">{t.login.title}</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          {t.login.subtitle}
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
            <label className="block text-xs font-medium text-neutral-900 dark:text-neutral-100 mb-1" htmlFor="email">
              {t.login.email}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.login.emailPlaceholder}
                required
                disabled={loading}
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-900 dark:text-neutral-100 mb-1" htmlFor="password">
              {t.login.password}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="pl-9"
              />
            </div>
          </div>

                      <Button type="submit" variant="primary" className="w-full mt-2" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : t.login.submit}
            </Button>
            
        </form>

        <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-700 text-center text-xs text-neutral-500 dark:text-neutral-400">
          {t.login.noAccount}{' '}
          <Link href="/register" className="font-medium text-neutral-900 dark:text-neutral-100 underline underline-offset-2 hover:text-brand-sage-600 dark:hover:text-brand-sage-400">
            {t.login.register}
          </Link>
        </div>
      </div>

      {/* Demo Credentials Box (Hanya tampil di lingkungan pengembangan) */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-6 bg-neutral-50 dark:bg-neutral-800/50 rounded p-4 border border-neutral-200 dark:border-neutral-700 text-xs">
          <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">{t.login.demoCredentials}</p>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@katalog.test');
                setPassword('admin123');
              }}
              className="w-full flex items-center justify-between p-2 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100 text-left transition-colors"
            >
              <span>{t.login.adminEmail}</span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{t.login.adminPassword}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('buyer@katalog.test');
                setPassword('buyer123');
              }}
              className="w-full flex items-center justify-between p-2 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100 text-left transition-colors"
            >
              <span>{t.login.buyerEmail}</span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{t.login.buyerPassword}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
