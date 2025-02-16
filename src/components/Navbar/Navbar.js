"use client";

import styles from './Navbar.module.css';

import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const { userPublicKey, login, logout, isUserPublicKeyLoading } = useAuth();

  return (
    <nav className={styles.container}>
      <div>
        {
          isUserPublicKeyLoading && <div>checking...</div>
        }        
      </div>

      <div>

      </div>

      <div>
        {userPublicKey ? (
          <>
            Logged in as: {userPublicKey} <button onClick={logout}>Log out</button>
          </>
        ) : (
          <button onClick={login}>Log in</button>
        )}        
      </div>
    </nav>
  );
}
