'use client'

import { Geist, Geist_Mono } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <div className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
                <main className="grow">{children}</main>
                <footer className="text-center text-sm text-gray-500 py-4 border-t">
                    All Rights Reserved 2025 ©︎ Hiroaki Ito
                </footer>
            </div>
        </SessionProvider>
    );
}
