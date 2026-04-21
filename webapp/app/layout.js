import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Placement Hub | Modern DB App',
  description: 'Internship & Placement Lifecycle Management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav-bar">
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            Placement<span style={{ color: '#3b82f6' }}>Hub</span>
          </div>
          <div className="nav-links">
            <Link href="/">Dashboard</Link>
            <Link href="/students">Students</Link>
            <Link href="/openings">Openings</Link>
            <Link href="/applications">Applications</Link>
            <span style={{ color: 'var(--border)', margin: '0 8px' }}>|</span>
            <Link href="/companies" style={{ color: '#aaa' }}>Admin: Companies</Link>
            <Link href="/openings/manage" style={{ color: '#aaa' }}>Admin: Openings</Link>
          </div>
        </nav>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
