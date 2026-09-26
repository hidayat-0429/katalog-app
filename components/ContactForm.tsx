'use client';

import { useState } from 'react';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { useTranslations } from '@/hooks/useTranslations';

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
}

const EMPTY_FORM: ContactFormData = {
  name: '',
  email: '',
  company: '',
  phone: '',
  subject: '',
  message: '',
};

const SUBJECT_OPTIONS = ['inquiry', 'bulkOrder', 'partnership', 'technical', 'other'] as const;

export default function ContactForm() {
  const t = useTranslations();
  const tf = t.contact.form;

  const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM);
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

    const fail = (message: string) => {
      setErrorMessage(message);
      setSubmitStatus('error');
    };

    if (!formData.name.trim()) return fail(tf.errors.nameRequired);
    if (!formData.email.trim()) return fail(tf.errors.emailRequired);
    if (!validateEmail(formData.email)) return fail(tf.errors.emailInvalid);
    if (!formData.company.trim()) return fail(tf.errors.companyRequired);
    if (!formData.phone.trim()) return fail(tf.errors.phoneRequired);
    if (!formData.subject.trim()) return fail(tf.errors.subjectRequired);
    if (formData.message.trim().length < 10) return fail(tf.errors.messageMin);

    setIsSubmitting(true);

    try {
      // Submission is stored in the database and shown on /admin/pesan
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || tf.errors.sendFailed);
      }

      setSubmitStatus('success');
      setFormData(EMPTY_FORM);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : tf.errors.unexpected);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass =
    'w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-transparent transition-all disabled:bg-neutral-50 dark:disabled:bg-neutral-900 disabled:cursor-not-allowed';
  const labelClass = 'block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 text-sm">{tf.successTitle}</h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-200 mt-1">
              {tf.successBody}
            </p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100 text-sm">{tf.errorTitle}</h3>
            <p className="text-xs text-red-700 dark:text-red-200 mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className={labelClass}>
          {tf.name} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={tf.namePlaceholder}
          disabled={isSubmitting}
          className={fieldClass}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClass}>
          {tf.email} <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={tf.emailPlaceholder}
          disabled={isSubmitting}
          className={fieldClass}
        />
      </div>

      {/* Company & Phone - 2 column */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="company" className={labelClass}>
            {tf.company} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder={tf.companyPlaceholder}
            disabled={isSubmitting}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            {tf.phone} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="081234567890"
            disabled={isSubmitting}
            className={fieldClass}
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className={labelClass}>
          {tf.subject} <span className="text-red-500">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          disabled={isSubmitting}
          className={fieldClass}
        >
          <option value="">{tf.subjectPlaceholder}</option>
          {SUBJECT_OPTIONS.map((key) => (
            <option key={key} value={key}>
              {tf.subjects[key]}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelClass}>
          {tf.message} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={tf.messagePlaceholder}
          disabled={isSubmitting}
          rows={5}
          maxLength={1000}
          className={`${fieldClass} resize-none`}
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          {formData.message.length} / 1000 {tf.characters}
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
            {tf.sending}
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            {tf.submit}
          </>
        )}
      </Button>

      <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">{tf.responseNote}</p>
    </form>
  );
}
