"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { identity, configure } from "deso-protocol";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userPublicKey, setUserPublicKey] = useState(null);
  const [altUsers, setAltUsers] = useState({});
  const [isUserPublicKeyLoading, setIsUserPublicKeyLoading] = useState(false);

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
      console.log({alternateUsers})

      switch (event) {
        case 'LOGIN_START':
          setIsUserPublicKeyLoading(true); 
          break; 
        case "SUBSCRIBE":
        case "LOGIN_END":
        case "CHANGE_ACTIVE_USER":
          setUserPublicKey(currentUser?.publicKey || null);
          setAltUsers(alternateUsers || {});
          setIsUserPublicKeyLoading(false);          
          break;          
        case "LOGOUT_END": // on logout end we can set 1st available alt user if we want
          setUserPublicKey(currentUser?.publicKey || null);
          setAltUsers(alternateUsers || {});
          setIsUserPublicKeyLoading(false);
          break;
      }
    });
  }, []);

  const login = async () => {
    //await identity.login(); // simple

    // user may close Identity window before finishing login flow
    await identity.login().catch((err) => {
      console.log("Error: ", err)
      setIsUserPublicKeyLoading(false)
    })   

    // check errors here 
    // import { ERROR_TYPES } from '@deso/identity';
  };

  const logout = async () => {
    //await identity.logout(); // simple

    // user may close Identity window before finishing logout flow
    await identity.logout().catch((err) => {
      console.log("Error: ", err)
      setIsUserPublicKeyLoading(false)
    })       
  };

  const setActiveUser = (publicKey) => {
    if (publicKey) {
      identity.setActiveUser(publicKey);
    }
  };

  const signTransaction = async (TransactionHex) => {
    return await identity.signTx(TransactionHex);
  };
  
  const submitTransaction = async (TransactionHex) => {
    return await identity.submitTx(TransactionHex);
  };  

  // can just use this instead of signTransaction and submitTransaction
  const signAndSubmitTransaction = async (TransactionHex) => {
    return await identity.signAndSubmit({ TransactionHex });
  };

  return (
    <AuthContext.Provider value={{ 
      userPublicKey, login, logout, setActiveUser, altUsers, isUserPublicKeyLoading,
      signTransaction, submitTransaction, signAndSubmitTransaction 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

