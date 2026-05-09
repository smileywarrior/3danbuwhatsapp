'use client';
import styles from './Header.module.css';

export default function Header({ title, subtitle }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.sub}>{subtitle}</p>
      </div>
      <div className={styles.right}>
        <div className={styles.search}>
          <span className={styles.searchIcon}>⌕</span>
          <input type="text" placeholder="Search..." className={styles.searchInput}/>
        </div>
        <button className={styles.iconBtn} title="Notifications">
          <span>🔔</span>
          <span className={styles.dot}></span>
        </button>
      </div>
    </header>
  );
}
