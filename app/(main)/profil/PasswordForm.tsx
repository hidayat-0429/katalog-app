"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, KeyRound, Loader2, Lock, Save, ShieldCheck } from "lucide-react";
import { changePassword } from "@/lib/actions/users";
import { Button, Input } from "@/components/ui";
import { useTranslations } from "@/hooks/useTranslations";

export default function PasswordForm() {
  const t = useTranslations();
  const tp = t.profile.password;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [values, setValues] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const setValue = (name: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await changePassword(new FormData(e.currentTarget));

      if (res?.error) {
        setError(res.error);
      } else {
        setValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setSuccess(true);
      }
    } catch (err) {
      setError(t.profile.form.unexpectedError);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      id: "currentPassword",
      name: "currentPassword",
      label: tp.current,
      autoComplete: "current-password",
      icon: Lock,
      value: values.currentPassword,
      onChange: setValue("currentPassword"),
    },
    {
      id: "newPassword",
      name: "newPassword",
      label: tp.new,
      autoComplete: "new-password",
      icon: KeyRound,
      value: values.newPassword,
      onChange: setValue("newPassword"),
    },
    {
      id: "confirmPassword",
      name: "confirmPassword",
      label: tp.confirm,
      autoComplete: "new-password",
      icon: ShieldCheck,
      value: values.confirmPassword,
      onChange: setValue("confirmPassword"),
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6 pb-3 border-b border-neutral-200 dark:border-neutral-700">
        {tp.title}
      </h3>

      {error && (
        <div className="text-sm text-semantic-danger-dark flex items-center gap-2 bg-semantic-danger-light p-3 rounded-md border border-semantic-danger-DEFAULT dark:bg-semantic-danger-darkBg dark:text-semantic-danger-200 dark:border-semantic-danger-900">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="text-sm text-brand-forest-700 flex items-center gap-2 bg-brand-forest-100 p-3 rounded-md border border-brand-forest-300 dark:bg-brand-forest-900/30 dark:text-brand-forest-300 dark:border-brand-forest-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{tp.saved}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.id}>
              <label className="block text-xs uppercase tracking-wide font-medium text-neutral-700 dark:text-neutral-300 mb-2" htmlFor={field.id}>
                {field.label}
              </label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
                <Input
                  id={field.id}
                  name={field.name}
                  type="password"
                  value={field.value}
                  onChange={field.onChange}
                  autoComplete={field.autoComplete}
                  required
                  minLength={6}
                  disabled={loading}
                  className="pl-10"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <p className="text-xs text-charcoal-muted">{tp.hint}</p>
        <Button type="submit" variant="primary" disabled={loading} className="shrink-0">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{tp.saving}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{tp.save}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
