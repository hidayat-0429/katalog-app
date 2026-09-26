"use client";

import { useState } from "react";
import { User, Building2, Phone, MapPin, Mail, AlertCircle, Save, Loader2, CheckCircle2 } from "lucide-react";
import { updateProfile } from "@/lib/actions/users";
import { Input, Button } from "@/components/ui";
import { useTranslations } from "@/hooks/useTranslations";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  companyName?: string | null;
  phone?: string | null;
  address?: string | null;
}

export default function ProfilForm({ user }: { user: ProfileData }) {
  const t = useTranslations();
  const tf = t.profile.form;
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
      setError(tf.unexpectedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
      {error && (
        <div className="text-sm text-semantic-danger-dark flex items-center gap-2 bg-semantic-danger-light p-3 rounded-md border border-semantic-danger-DEFAULT dark:bg-semantic-danger-darkBg dark:text-red-200 dark:border-red-900">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="text-sm text-brand-forest-700 flex items-center gap-2 bg-brand-forest-100 p-3 rounded-md border border-brand-forest-300 dark:bg-brand-forest-900/30 dark:text-brand-forest-300 dark:border-brand-forest-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{t.profile.saved}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6">
          <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6 pb-3 border-b border-neutral-200 dark:border-neutral-700">
            {tf.picTitle}
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wide font-medium text-neutral-700 dark:text-neutral-300 mb-2" htmlFor="name">
                {tf.name}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={user.name}
                  required
                  disabled={loading}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide font-medium text-neutral-700 dark:text-neutral-300 mb-2" htmlFor="company">
                {tf.company} <span className="text-neutral-500 dark:text-neutral-400 font-normal normal-case">({tf.optional})</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                <Input
                  id="company"
                  name="companyName"
                  type="text"
                  defaultValue={user.companyName || ""}
                  disabled={loading}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-wide font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                {tf.emailLabel}
              </label>
              <div className="relative opacity-60">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                <Input
                  type="email"
                  value={user.email}
                  disabled
                  readOnly
                  className="pl-10 bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">{tf.emailLocked}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6">
          <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6 pb-3 border-b border-neutral-200 dark:border-neutral-700">
            {tf.contactTitle}
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wide font-medium text-neutral-700 dark:text-neutral-300 mb-2" htmlFor="phone">
                {tf.phone}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={user.phone || ""}
                  required
                  disabled={loading}
                  className="w-full pl-10 px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-base focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-brand-forest-500 transition-colors duration-150 ease-out placeholder:text-neutral-400 dark:placeholder:text-neutral-500 disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed dark:disabled:bg-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide font-medium text-neutral-700 dark:text-neutral-300 mb-2" htmlFor="address">
                {tf.address}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                <textarea
                  id="address"
                  name="address"
                  defaultValue={user.address || ""}
                  required
                  disabled={loading}
                  rows={4}
                  className="w-full pl-10 px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-base focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-brand-forest-500 transition-colors duration-150 ease-out placeholder:text-neutral-400 dark:placeholder:text-neutral-500 resize-none disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed dark:disabled:bg-neutral-900"
                  placeholder={tf.addressPlaceholder}
                />
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">{tf.addressHint}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-neutral-200 dark:border-neutral-700">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{tf.saving}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{t.profile.save}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
