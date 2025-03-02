"use client";

import styles from "./Navbar.module.css";
import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const { userPublicKey, login, logout, isUserPublicKeyLoading } = useAuth();

  return (
    <nav className={styles.container}>
      <div>
        {isUserPublicKeyLoading && <div>Checking...</div>}
      </div>

      <div></div>

      <div>
        {userPublicKey ? (
          <button onClick={logout} disabled={isUserPublicKeyLoading}>Log out</button>
        ) : (
          <button onClick={login} disabled={isUserPublicKeyLoading}>Log in</button>
        )}
      </div>
    </nav>
  );
};
