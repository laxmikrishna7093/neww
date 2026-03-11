import './globals.css';
import Header from '../components/header';
import Footer from '../components/footer';

export const metadata = {
  title: 'Nachi Consultation Pvt. Ltd. | Employment Solutions',
  description: 'Bridging the gap between talent and opportunity. Security, Cleaning, Housekeeping, Packers, Drivers and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}