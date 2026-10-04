import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, User as UserIcon, Mail, AlertCircle, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { PLANT_BG_IMG } from '../services/storage';
import { KraftHeinzLogo } from './KraftHeinzLogo';

export const LoginView: React.FC = () => {
  const { loginWithNip, loginWithEmail, isLoading, error, clearError } = useAuth();

  const [useEmailMode, setUseEmailMode] = useState(false);
  const [identifier, setIdentifier] = useState('10293'); // Pre-fill with Rista's NIP
  const [password, setPassword] = useState('password123');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    if (useEmailMode) {
      await loginWithEmail(identifier, password);
    } else {
      await loginWithNip(identifier, password);
    }
  };

  const handleQuickFill = (nip: string, email: string, pass: string) => {
    if (useEmailMode) {
      setIdentifier(email);
    } else {
      setIdentifier(nip);
    }
    setPassword(pass);
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#123C6E] via-[#0d2a4d] to-[#081b33] text-slate-100 flex flex-col justify-center relative overflow-hidden px-4 py-8">
      {/* Subtle industrial background texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
        <img
          src={PLANT_BG_IMG}
          alt="Factory Production Facility"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Grid overlay lines */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Company Header & Brand with Kraft Heinz ABC Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white shadow-xl mb-3">
            <KraftHeinzLogo size="lg" />
          </div>
          <div className="text-type-caption uppercase tracking-widest text-[#FFB800] font-bold mb-1 font-mono">
            PT HEINZ ABC INDONESIA
          </div>
          <h1 className="text-type-h1 text-white">
            5S MONITORING SYSTEM
          </h1>
          <p className="text-type-caption text-slate-300 mt-1 max-w-xs mx-auto">
            Audit Standar Kebersihan, Kerapian, & Disiplin 5S Lantai Produksi
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-[#E32128] text-type-caption flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#E32128] shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Identifier input */}
            <div>
              <label className="block text-type-caption font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {useEmailMode ? 'Email Karyawan' : 'Nomor Induk Pekerja (NIP / NIK)'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  {useEmailMode ? <Mail className="w-4 h-4 text-[#123C6E]" /> : <UserIcon className="w-4 h-4 text-[#123C6E]" />}
                </div>
                <input
                  type={useEmailMode ? 'email' : 'text'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={useEmailMode ? 'operator@kraftheinz.com' : 'Contoh: 10293'}
                  required
                  disabled={isLoading}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-3 text-type-body-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#123C6E] focus:border-transparent transition-all font-mono"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-type-caption font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-type-caption text-[#123C6E] hover:text-[#E32128] font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-[#123C6E]" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-3 text-type-body-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#123C6E] focus:border-transparent transition-all font-mono"
                />
              </div>
            </div>

            {/* Submit Button in Brand Red #E32128 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-2 bg-[#E32128] hover:bg-[#cc1d23] disabled:opacity-60 text-white font-bold text-type-body-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#E32128]/25 active:scale-[0.99] transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>MEMPROSES LOGIN...</span>
                </>
              ) : (
                <>
                  <span>LOGIN KE SISTEM</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Alternative Email Login Switch */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => {
                setUseEmailMode(!useEmailMode);
                clearError();
                if (!useEmailMode) {
                  setIdentifier('RistaSihotang43@gmail.com');
                } else {
                  setIdentifier('10293');
                }
              }}
              className="text-type-caption text-slate-500 hover:text-[#123C6E] font-medium transition-colors"
            >
              {useEmailMode ? '← Kembali ke login NIP / NIK' : 'Opsi alternatif: Login menggunakan Email'}
            </button>
          </div>

          {/* Quick Demo Credentials for Fast Evaluation */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="text-type-caption font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Pilih Akun Demo Cepat:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('10293', 'RistaSihotang43@gmail.com', 'password123')}
                className="px-2.5 py-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-[#123C6E] rounded-xl text-type-caption transition-colors"
              >
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>Rista</span>
                  <span className="text-[10px] text-[#123C6E] font-mono font-bold">OPR</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">NIP: 10293</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('99001', 'hendra.supervisor@kraftheinz.com', 'adminpassword')}
                className="px-2.5 py-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-[#E32128] rounded-xl text-type-caption transition-colors"
              >
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>Hendra</span>
                  <span className="text-[10px] text-[#E32128] font-mono font-bold">SPV</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">NIP: 99001</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-500">
          Plant Quality & 5S Operational Assurance © 2026
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-left">
            <h3 className="text-base font-bold text-white mb-2">Bantuan Lupa Password</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Untuk keamanan operasional pabrik, reset password dapat dilakukan melalui Supervisor Plant atau menghubungi Helpdesk IT Produksi di ekstensi <strong>#4401</strong>.
            </p>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs text-slate-300 mb-5 space-y-1">
              <div>Default Password Operator: <code className="text-blue-400 font-mono">password123</code></div>
              <div>Default Password Supervisor: <code className="text-emerald-400 font-mono">adminpassword</code></div>
            </div>
            <button
              onClick={() => setShowForgotPassword(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-colors"
            >
              Mengerti & Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
