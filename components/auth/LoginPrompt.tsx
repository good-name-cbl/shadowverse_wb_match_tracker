'use client';

import React from 'react';
import Link from 'next/link';

/**
 * 未ログイン時にログインを促すバナー
 * データがローカルのみであることを明示し、クラウド同期のメリットを伝える
 */
export const LoginPrompt: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/30 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
            <span className="text-xl">💾</span>
          </div>
          <div>
            <p className="text-slate-200 text-sm font-medium">
              現在のデータはこのブラウザにのみ保存されています
            </p>
            <p className="text-slate-400 text-xs mt-1">
              ログインすると、クラウドに保存してデバイス間で同期できます
            </p>
          </div>
        </div>
        <Link
          href="/auth"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-200 shadow-lg shadow-violet-900/20 whitespace-nowrap"
        >
          ログイン / 新規登録
        </Link>
      </div>
    </div>
  );
};
