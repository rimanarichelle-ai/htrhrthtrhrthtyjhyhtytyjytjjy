import React, { useState } from 'react';
import { Lock, User, Shield, ArrowLeft, AlertCircle } from 'lucide-react';
import { DZLogo } from '../../components/common/DZLogo';

interface AdminLoginViewProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('dzrentcar2026');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Verify credentials
    if (username === 'admin' && (password === 'dzrentcar2026' || password === 'admin')) {
      localStorage.setItem('dz_admin_auth', 'true');
      setLoading(false);
      onLoginSuccess();
    } else {
      setLoading(false);
      setError('Identifiant ou mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090a0d] text-gray-900 dark:text-zinc-100 flex flex-col justify-center items-center px-4 py-12 transition-colors duration-200">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <DZLogo size="lg" className="mx-auto" />
          <div className="pt-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#F59E0B] dark:text-[#FBBF24]">
              Portail d'Administration Sécurisé
            </span>
            <h2 className="text-2xl font-black uppercase text-gray-900 dark:text-white tracking-tight mt-1">
              Connexion Gestionnaire
            </h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Accès réservé au personnel et à la direction de DZ RENT CAR
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#12141c] border border-gray-200 dark:border-white/10 rounded-2xl p-7 shadow-xl dark:shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#F59E0B] dark:text-[#FBBF24]" />
                Identifiant
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FBBF24]"
                placeholder="Identifiant administrateur"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#F59E0B] dark:text-[#FBBF24]" />
                Mot de Passe
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FBBF24]"
                placeholder="••••••••"
              />
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 text-[11px] text-gray-600 dark:text-zinc-400">
              <span className="text-[#F59E0B] dark:text-[#FBBF24] font-bold">Identifiants de démonstration :</span>
              <br />
              Utilisateur : <code className="text-gray-900 dark:text-zinc-200 font-bold">admin</code> · Mot de passe : <code className="text-gray-900 dark:text-zinc-200 font-bold">dzrentcar2026</code>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] active:scale-[0.98] text-gray-950 font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 stroke-[2.5]" />
              <span>{loading ? 'Connexion...' : 'Accéder au Tableau de Bord'}</span>
            </button>
          </form>
        </div>

        <div className="text-center">
          <button
            onClick={onBackToSite}
            className="text-xs text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour au site public DZ RENT CAR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
