'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Sidebar.module.css';

const NAV = [
  { href: '/', label: 'Dashboard', icon: '⊞' },
  { href: '/billing', label: 'Billing & Costs', icon: '◈' },
  { href: '/campaigns', label: 'Campaigns', icon: '◉' },
  { href: '/contacts', label: 'Contacts', icon: '◎' },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <rect width="30" height="30" rx="10" fill="url(#lg)"/>
            <path d="M15 6C10.03 6 6 10.03 6 15c0 1.58.41 3.07 1.13 4.36L6 24l4.79-1.08A8.96 8.96 0 0015 24c4.97 0 9-4.03 9-9s-4.03-9-9-9z" fill="#fff" opacity=".85"/>
            <path d="M19.5 16.79c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.39.11-.51.12-.12.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.44.06-.67.31s-.87.85-.87 2.08.89 2.41 1.02 2.58c.12.17 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z" fill="#fff"/>
            <defs><linearGradient id="lg" x1="0" y1="0" x2="30" y2="30"><stop stopColor="#25D366"/><stop offset="1" stopColor="#128C7E"/></linearGradient></defs>
          </svg>
        </div>
        <span className={styles.logoText}>WhatsFlow</span>
      </div>
      <nav className={styles.nav}>
        {NAV.map(n => (
          <Link key={n.href} href={n.href} className={`${styles.navItem} ${path === n.href ? styles.active : ''}`}>
            <span className={styles.navIcon}>{n.icon}</span>
            <span>{n.label}</span>
          </Link>
        ))}
      </nav>
      <div className={styles.footer}>
        <div className={styles.user}>
          <div className={styles.userAvatar}>SM</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Smiley Warrior</span>
            <span className={styles.userRole}>Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
