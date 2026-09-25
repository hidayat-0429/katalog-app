'use client';

import { useState } from 'react';
import { Send, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui';

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear status when user starts typing again
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.name.trim()) {
      setErrorMessage('Nama harus diisi');
      setSubmitStatus('error');
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage('Email harus diisi');
      setSubmitStatus('error');
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrorMessage('Format email tidak valid');
      setSubmitStatus('error');
      return;
    }

    if (!formData.company.trim()) {
      setErrorMessage('Nama perusahaan harus diisi');
      setSubmitStatus('error');
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMessage('Nomor telepon harus diisi');
      setSubmitStatus('error');
      return;
    }

    if (!formData.subject.trim()) {
      setErrorMessage('Topik pertanyaan harus diisi');
      setSubmitStatus('error');
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMessage('Pesan minimal 10 karakter');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate email sending (in production, integrate with nodemailer or email service)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim pesan');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim pesan');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 text-sm">Pesan berhasil dikirim!</h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-200 mt-1">
              Tim kami akan segera menghubungi Anda dalam waktu 24 jam.
            </p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100 text-sm">Terjadi kesalahan</h3>
            <p className="text-xs text-red-700 dark:text-red-200 mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          Nama Lengkap <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Contoh: Budi Santoso"
          disabled={isSubmitting}
          className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-transparent transition-all disabled:bg-neutral-50 dark:disabled:bg-neutral-900 disabled:cursor-not-allowed"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          Email Bisnis <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="nama@perusahaan.com"
          disabled={isSubmitting}
          className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-transparent transition-all disabled:bg-neutral-50 dark:disabled:bg-neutral-900 disabled:cursor-not-allowed"
        />
      </div>

      {/* Company & Phone - 2 column */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            Nama Perusahaan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Contoh: CV Rasa Utama"
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-transparent transition-all disabled:bg-neutral-50 dark:disabled:bg-neutral-900 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            Nomor Telepon <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="081234567890"
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-transparent transition-all disabled:bg-neutral-50 dark:disabled:bg-neutral-900 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          Topik Pertanyaan <span className="text-red-500">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-transparent transition-all disabled:bg-neutral-50 dark:disabled:bg-neutral-900 disabled:cursor-not-allowed"
        >
          <option value="">-- Pilih topik --</option>
          <option value="inquiry">Pertanyaan Umum Produk</option>
          <option value="bulk-order">Pesanan Grosir / B2B</option>
          <option value="partnership">Kerja Sama & Partnership</option>
          <option value="technical">Masalah Teknis / Pengiriman</option>
          <option value="other">Lainnya</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          Pesan <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Jelaskan pertanyaan atau kebutuhan Anda secara detail..."
          disabled={isSubmitting}
          rows={5}
          className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-transparent transition-all resize-none disabled:bg-neutral-50 dark:disabled:bg-neutral-900 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          {formData.message.length} / 1000 karakter
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Mengirim...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Kirim Pesan
          </>
        )}
      </Button>

      <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
        Kami akan merespons dalam waktu 24 jam kerja
      </p>
    </form>
  );
}
