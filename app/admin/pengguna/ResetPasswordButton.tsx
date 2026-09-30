'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Copy, KeyRound, Loader2, AlertCircle, X } from 'lucide-react';
import { resetUserPassword } from '@/lib/actions/users';

// Tanpa huruf/angka yang mudah tertukar saat dibaca lewat telepon: tidak ada I, O, 0, 1.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

function randomTempPassword() {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join('');
}

interface ResetPasswordButtonProps {
  userId: string;
  userName: string;
  userEmail: string;
}

export default function ResetPasswordButton({ userId, userName, userEmail }: ResetPasswordButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savedPassword, setSavedPassword] = useState('');

  const open = () => {
    setError('');
    setPassword('');
    setConfirmPassword('');
    setSavedPassword('');
    setIsOpen(true);
  };

  const close = () => {
    if (isPending) return;
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Sandi baru minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi sandi tidak sama.');
      return;
    }

    setIsPending(true);
    try {
      const formData = new FormData();
      formData.set('userId', userId);
      formData.set('newPassword', password);

      const res = await resetUserPassword(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSavedPassword(password);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan sandi. Silakan coba lagi.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <button
        onClick={open}
        className="btn-icon text-charcoal-muted hover:text-neutral-900 dark:hover:text-neutral-100"
        title="Atur ulang sandi pengguna"
      >
        <KeyRound className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={close} />
          <div className="relative w-full max-w-md bg-surface border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">Atur Sandi Pengguna</h2>
              <button onClick={close} className="btn-icon" disabled={isPending} title="Tutup">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-charcoal-muted mb-4">
              {userName} - <span className="font-medium text-neutral-900 dark:text-neutral-100">{userEmail}</span>
            </p>

            {error && (
              <div className="text-xs text-semantic-danger-dark bg-semantic-danger-light border border-semantic-danger-DEFAULT dark:bg-semantic-danger-darkBg dark:text-semantic-danger-200 dark:border-semantic-danger-900 p-2.5 rounded mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {savedPassword ? (
              <div className="space-y-4">
                <div className="text-xs text-brand-forest-700 bg-brand-forest-100 border border-brand-forest-300 dark:bg-brand-forest-900/30 dark:text-brand-forest-300 dark:border-brand-forest-700 p-3 rounded flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Sandi baru tersimpan.</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 font-mono text-sm tracking-wide bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded px-3 py-2 select-all break-all">
                    {savedPassword}
                  </code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(savedPassword)}
                    className="btn-icon text-charcoal-muted hover:text-neutral-900 dark:hover:text-neutral-100"
                    title="Salin sandi"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-charcoal-muted">
                  Sampaikan sandi ini ke pengguna lewat kanal resmi Anda, lalu minta mereka menggantinya sendiri di halaman Profil.
                </p>
                <div className="flex justify-end">
                  <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary text-xs py-1.5 px-3">
                    Tutup
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label htmlFor={`pw-${userId}`} className="font-medium text-neutral-900 dark:text-neutral-100">
                    Sandi Baru
                  </label>
                  <div className="flex gap-2">
                    <input
                      id={`pw-${userId}`}
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isPending}
                      required
                      minLength={6}
                      autoComplete="off"
                      className="input flex-1 text-sm font-mono disabled:opacity-50"
                      placeholder="Minimal 6 karakter"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const generated = randomTempPassword();
                        setPassword(generated);
                        setConfirmPassword(generated);
                      }}
                      disabled={isPending}
                      className="btn-secondary text-xs px-3 shrink-0"
                      title="Buat sandi acak"
                    >
                      Acak
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor={`pw-confirm-${userId}`} className="font-medium text-neutral-900 dark:text-neutral-100">
                    Ulangi Sandi
                  </label>
                  <input
                    id={`pw-confirm-${userId}`}
                    type="text"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isPending}
                    required
                    autoComplete="off"
                    className="input w-full text-sm font-mono disabled:opacity-50"
                  />
                  <p className="text-[10px] text-charcoal-muted">
                    Sandi ditampilkan sebagai teks biasa supaya mudah Anda sampaikan ke pengguna.
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={close} disabled={isPending} className="btn-secondary text-xs py-1.5 px-3">
                    Batal
                  </button>
                  <button type="submit" disabled={isPending} className="btn-primary text-xs py-1.5 px-3">
                    {isPending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <span>Simpan Sandi</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
