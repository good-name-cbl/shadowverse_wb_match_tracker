'use client';

import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 text-center text-slate-500 text-xs border-t border-white/5 bg-slate-950/30">
      <div className="max-w-4xl mx-auto px-4 space-y-2">
        <p>&copy; {currentYear} Shadowverse Record</p>
        <p>
          Shadowverse™ および Shadowverse: Worlds Beyond™ は Cygames, Inc. の商標です。
        </p>
        <p>&copy; Cygames, Inc.</p>
        <p className="text-slate-600">
          本アプリケーションは Cygames, Inc. と提携関係になく、Cygames, Inc. が推薦するものでもありません。
        </p>
      </div>
    </footer>
  );
};
