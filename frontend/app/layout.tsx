import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CNA - Cadastro',
  description: 'Cadastro de alunos e sorteio CNA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen text-gray-800 antialiased">
        {children}
      </body>
    </html>
  );
}
