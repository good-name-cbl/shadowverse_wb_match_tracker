import React from 'react';
import { AuthContainer } from '../auth/AuthContainer';

export const LandingPage: React.FC = () => {
  const scrollToAuth = () => {
    const authSection = document.getElementById('auth-section');
    if (authSection) {
      authSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-indigo-600/10 blur-[100px]" />
      </div>

      {/* Header / Nav */}
      <header className="relative z-50 border-b border-white/5 backdrop-blur-sm bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚔️</span>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
              Shadowverse Record
            </span>
          </div>
          <button
            onClick={scrollToAuth}
            className="px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            ログイン
          </button>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8">
            <span className="block text-white mb-2">勝利への道を</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">
              データで切り拓く
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed">
            Shadowverseの対戦記録をスマートに管理。<br className="hidden sm:block" />
            デッキごとの勝率分析や相性確認で、ランクマッチを有利に進めましょう。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToAuth}
              className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-full shadow-lg shadow-violet-900/20 transition-all transform hover:scale-105"
            >
              無料で始める
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 text-lg font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-full transition-all"
            >
              機能を見る
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-slate-900/50 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">主な機能</h2>
              <p className="text-slate-400">ランクマッチに必要な全てのツールを揃えました</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl bg-slate-950 border border-white/5 hover:border-violet-500/30 transition-colors group">
                <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-violet-500/20 transition-colors">
                  <span className="text-2xl">🃏</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">デッキ管理</h3>
                <p className="text-slate-400 leading-relaxed">
                  使用するデッキをクラスごとに無制限に登録可能。
                  環境に合わせてデッキを使い分け、それぞれの戦績を個別に追跡できます。
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-2xl bg-slate-950 border border-white/5 hover:border-fuchsia-500/30 transition-colors group">
                <div className="w-12 h-12 bg-fuchsia-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-fuchsia-500/20 transition-colors">
                  <span className="text-2xl">⚔️</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">対戦記録</h3>
                <p className="text-slate-400 leading-relaxed">
                  対戦相手のクラス、デッキタイプ、先攻・後攻、勝敗を数タップで記録。
                  ストレスなく継続できるシンプルなUI設計です。
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-2xl bg-slate-950 border border-white/5 hover:border-indigo-500/30 transition-colors group">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">統計・分析</h3>
                <p className="text-slate-400 leading-relaxed">
                  記録したデータから勝率を自動算出。
                  クラス別、先攻・後攻別の勝率を可視化し、得意・不得意を客観的に把握できます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Auth Section */}
        <section id="auth-section" className="py-24 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-md mx-auto">
            <div className="glass p-8 rounded-2xl border border-white/10 shadow-2xl shadow-violet-900/20">
              <AuthContainer />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-slate-500 text-sm border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} Shadowverse Record. All rights reserved.</p>
      </footer>
    </div>
  );
};
