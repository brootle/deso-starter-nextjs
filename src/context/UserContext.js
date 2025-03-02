"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useDeSoApi } from "@/api/useDeSoApi";
import { useAuth } from "@/context/AuthContext";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const { userPublicKey } = useAuth();
  const { getSingleProfile } = useDeSoApi();
  const [userProfile, setUserProfile] = useState(null);
  const [isUserProfileLoading, setIsUserProfileLoading] = useState(false);
  const [userProfileError, setUserProfileError] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    if (!userPublicKey) {
      setUserProfile(null);
      setUserProfileError(null);
      return;
    }

    setIsUserProfileLoading(true);
    setUserProfileError(null);

    try {
      const result = await getSingleProfile({ PublicKeyBase58Check: userPublicKey });

      if (result.success) {
        setUserProfile(result.data.Profile);
      } else {
        setUserProfile(null);
        setUserProfileError(result.error);
      }
    } catch (error) {
      setUserProfile(null);
      setUserProfileError(error.message);
    } finally {
      setIsUserProfileLoading(false);
    }
  }, [userPublicKey, getSingleProfile]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return (
    <UserContext.Provider value={{ userProfile, isUserProfileLoading, userProfileError, fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);

