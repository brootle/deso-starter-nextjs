"use client";

import styles from './Footer.module.css';

export const Footer = () => {

  return (
    <footer className={styles.container}>
        <div>
          Designed by <a href="https://focus.xyz/brootle" target="_blank" rel="noreferrer">brootle</a>
        </div>
        <div>
          Extra Info
        </div>
    </footer>
  );
}
