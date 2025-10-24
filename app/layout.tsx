import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Football Team Builder',
  description: 'Create your perfect XI with drag-and-drop formations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
