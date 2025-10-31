import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '簡単レシピ検索',
  description: '楽天レシピAPIを活用して食材名から簡単に人気のレシピを検索できるアプリです',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
