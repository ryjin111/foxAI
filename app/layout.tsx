import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FoxAI ElizaOS Dashboard',
  description: 'Autonomous AI Agent Dashboard for Crypto Analysis and Twitter Automation',
  keywords: ['AI', 'Crypto', 'Twitter', 'Automation', 'ElizaOS', 'FoxAI'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
} 