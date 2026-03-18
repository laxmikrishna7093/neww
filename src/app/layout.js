'use client';
import './globals.css';
import Header from '../components/header';
import Footer from '../components/footer';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <title>Nachi Consultation Pvt. Ltd. | Employment Solutions</title>
        <meta name="description" content="Bridging the gap between talent and opportunity. Security, Cleaning, Housekeeping, Packers, Drivers and more." />
      </head>
      <body>
        {isAdmin ? (
          <>{children}</>
        ) : (
          <>
            <Header />
            <main>{children}</main>
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}