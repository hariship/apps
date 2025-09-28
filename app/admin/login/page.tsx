"use client";

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        const session = await getSession();
        if (session) {
          router.push('/admin');
        }
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 border-2 border-amber-600 p-8 max-w-md w-full mx-4" style={{borderRadius: '0 20px 20px 0'}}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-200 tracking-wider mb-2" style={{fontFamily: 'Orbitron, sans-serif'}}>
            ADMIN ACCESS
          </h1>
          <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-yellow-500 to-transparent mb-4" />
          <p className="text-gray-400" style={{fontFamily: 'Share Tech Mono, monospace'}}>
            RESTRICTED AREA - AUTHORIZED PERSONNEL ONLY
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2" style={{fontFamily: 'Share Tech Mono, monospace'}}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-amber-600/50 text-gray-200 focus:outline-none focus:border-amber-600 transition-colors"
              style={{fontFamily: 'Share Tech Mono, monospace'}}
              placeholder="admin username"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2" style={{fontFamily: 'Share Tech Mono, monospace'}}>
              ACCESS CODE
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-amber-600/50 text-gray-200 focus:outline-none focus:border-amber-600 transition-colors"
              style={{fontFamily: 'Share Tech Mono, monospace'}}
              placeholder="admin password"
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-600 text-red-300 px-4 py-3 text-sm" style={{fontFamily: 'Share Tech Mono, monospace'}}>
              ▪ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold py-4 px-6 transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
          >
            {isLoading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-amber-600/30">
          <p className="text-gray-500 text-xs text-center" style={{fontFamily: 'Share Tech Mono, monospace'}}>
            SYSTEM SECURITY ENABLED - ALL ACCESS ATTEMPTS ARE LOGGED
          </p>
        </div>
      </div>
    </div>
  );
}