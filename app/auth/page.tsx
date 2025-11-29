'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContainer } from '@/components/auth/AuthContainer';
import { useAuth } from '@/contexts/AuthContext';
import { Footer } from '@/components/layout/Footer';

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // ログイン済みの場合はホームにリダイレクト
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-slate-400">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/5 backdrop-blur-sm bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">⚔️</span>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
              Shadowverse Record
            </span>
          </Link>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            ← ホームに戻る
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">アカウント</h1>
            <p className="text-slate-400">
              ログインまたは新規登録してデータをクラウドに保存
            </p>
          </div>
          <div className="glass p-8 rounded-2xl border border-white/10 shadow-2xl shadow-violet-900/20">
            <AuthContainer />
          </div>
          <p className="text-center text-slate-500 text-sm mt-6">
            ログインせずに使用する場合、データはこのブラウザにのみ保存されます
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
