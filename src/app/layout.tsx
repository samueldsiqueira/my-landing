import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Samuel D' Siqueira - Developer",
  description: "Portfólio pessoal de Samuel D' Siqueira",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans">{children}</body>
    </html>
  );
}
