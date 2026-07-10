'use client';

import { useState } from 'react';
import { createRegistration, LanguagePreference } from '@/lib/api';

// Máscara simples de telefone/WhatsApp brasileiro: (99) 99999-9999
function maskWhatsapp(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  let masked = digits;

  if (digits.length > 0) masked = `(${digits.slice(0, 2)}`;
  if (digits.length >= 3) masked += `) ${digits.slice(2, 7)}`;
  if (digits.length >= 8) masked += `-${digits.slice(7, 11)}`;

  return masked;
}

// Máscara simples para nome completo: bloqueia números e símbolos, mantém acentos
function maskFullName(value: string) {
  return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
}

type FormState = {
  fullName: string;
  whatsapp: string;
  email: string;
  language: LanguagePreference | '';
};

const initialState: FormState = {
  fullName: '',
  whatsapp: '',
  email: '',
  language: '',
};

export default function RegistrationForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (form.fullName.trim().length < 3) {
      newErrors.fullName = 'Informe o nome completo';
    }
    if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(form.whatsapp)) {
      newErrors.whatsapp = 'Informe um WhatsApp válido: (99) 99999-9999';
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (!form.language) {
      newErrors.language = 'Selecione um idioma de preferência';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    setSuccess(false);

    if (!validate()) return;

    setLoading(true);
    try {
      await createRegistration({
        fullName: form.fullName.trim(),
        whatsapp: form.whatsapp,
        email: form.email || undefined,
        language: form.language as LanguagePreference,
      });
      setSuccess(true);
      setForm(initialState);
    } catch (err: any) {
      setServerError(err.message || 'Erro ao enviar cadastro');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="bg-cna-red px-8 py-6">
        <span className="inline-block bg-white text-cna-red font-extrabold text-xl px-3 py-1 rounded-md tracking-wide">
          CNA
        </span>
        <h1 className="text-white text-lg font-semibold mt-3">
          Cadastro CNA
        </h1>
        <p className="text-red-100 text-sm mt-1">
          Preencha seus dados para participar.
        </p>
      </div>

      <div className="p-8 space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="fullName">
          Nome completo
        </label>
        <input
          id="fullName"
          type="text"
          value={form.fullName}
          onChange={(e) =>
            setForm((f) => ({ ...f, fullName: maskFullName(e.target.value) }))
          }
          placeholder="Digite seu nome completo"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cna-red"
        />
        {errors.fullName && (
          <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="whatsapp">
          Número de WhatsApp
        </label>
        <input
          id="whatsapp"
          type="tel"
          inputMode="numeric"
          value={form.whatsapp}
          onChange={(e) =>
            setForm((f) => ({ ...f, whatsapp: maskWhatsapp(e.target.value) }))
          }
          placeholder="(99) 99999-9999"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cna-red"
        />
        {errors.whatsapp && (
          <p className="text-red-600 text-xs mt-1">{errors.whatsapp}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="email">
          E-mail <span className="text-gray-400">(opcional)</span>
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm((f) => ({ ...f, email: e.target.value }))
          }
          placeholder="seuemail@exemplo.com"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cna-red"
        />
        {errors.email && (
          <p className="text-red-600 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <span className="block text-sm font-medium mb-2">
          Preferência de idioma
        </span>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="language"
              value="EN"
              checked={form.language === 'EN'}
              onChange={() => setForm((f) => ({ ...f, language: 'EN' }))}
            />
            <span>🇺🇸 Inglês</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="language"
              value="ES"
              checked={form.language === 'ES'}
              onChange={() => setForm((f) => ({ ...f, language: 'ES' }))}
            />
            <span>🇪🇸 Espanhol</span>
          </label>
        </div>
        {errors.language && (
          <p className="text-red-600 text-xs mt-1">{errors.language}</p>
        )}
      </div>

      {serverError && (
        <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">
          {serverError}
        </p>
      )}
      {success && (
        <p className="text-green-700 text-sm bg-green-50 rounded-lg px-3 py-2">
          Cadastro realizado com sucesso!
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cna-red text-white font-semibold rounded-lg py-2.5 hover:bg-cna-red-dark transition disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Cadastrar'}
      </button>
      </div>
    </form>
  );
}
