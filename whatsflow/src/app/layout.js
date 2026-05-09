import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'WhatsFlow — WhatsApp Management Dashboard',
  description: 'Professional WhatsApp Business Management Dashboard with analytics, billing, and campaign tools.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <Sidebar />
          <main className="main-area">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
