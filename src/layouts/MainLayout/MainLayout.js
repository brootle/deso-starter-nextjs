"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer"
import styles from "./MainLayout.module.css";

export const MainLayout = ({ children }) => {
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.mainContainer}>{children}</main>
      <Footer />
    </div>
  );
};