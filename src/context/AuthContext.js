"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { identity, configure } from "deso-protocol";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userPublicKey, setUserPublicKey] = useState(null);
  const [altUsers, setAltUsers] = useState({});
  const [isUserPublicKeyLoading, setIsUserPublicKeyLoading] = useState(true);

  const isRunned = useRef(false); // Prevents multiple initializations

  useEffect(() => {
    if (isRunned.current) return;
    isRunned.current = true;

    configure({
      spendingLimitOptions: {
        GlobalDESOLimit: 0.1 * 1e9,
        TransactionCountLimitMap: { SUBMIT_POST: "UNLIMITED" },
      },
      appName: "DeSo Next.js App",
    });

    identity.subscribe((state) => {
      const { currentUser, alternateUsers, event } = state;
      console.log("Identity State:", state);

      switch (event) {
        case "SUBSCRIBE":
        case "LOGIN_END":
        case "CHANGE_ACTIVE_USER":
        case "LOGOUT_END":
          setUserPublicKey(currentUser?.publicKey || null);
          setAltUsers(alternateUsers || {});
          setIsUserPublicKeyLoading(false);
          break;
      }
    });
  }, []);

  const login = async () => {
    await identity.login();
  };

  const logout = async () => {
    await identity.logout();
  };

  return (
    <AuthContext.Provider value={{ userPublicKey, login, logout, altUsers, isUserPublicKeyLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

