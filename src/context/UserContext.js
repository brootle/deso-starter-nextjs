"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useDeSoApi } from "@/api/useDeSoApi";
import { useAuth } from "@/context/AuthContext";

const UserContext = createContext(null);

export function UserProvider({ children }) {

  const { userPublicKey, altUsers, isUserPublicKeyLoading } = useAuth();
  const { getSingleProfile, getUsersStateless } = useDeSoApi();

  // single profile
  const [userProfile, setUserProfile] = useState(null);
  const [isUserProfileLoading, setIsUserProfileLoading] = useState(isUserPublicKeyLoading);
  const [userProfileError, setUserProfileError] = useState(null);

  // alt user profiles
  const [altUserProfiles, setAltUserProfiles] = useState(null);
  const [isAltUserProfileSLoading, setIsAltUserProfilesLoading] = useState(isUserPublicKeyLoading);
  const [altUserProfilesError, setAltUserProfilesError] = useState(null);  

  // fetch auth user profile
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

  // fetch alt profiles 
  const fetchAltUserProfiles = useCallback(async () => {
    if (!altUsers || Object.keys(altUsers).length === 0) {
      setAltUserProfiles(null);
      setAltUserProfilesError(null);
      return;
    }

    const publicKeys = Object.keys(altUsers); // make a list of public keys

    setIsAltUserProfilesLoading(true);
    setAltUserProfilesError(null);

    try {
      const result = await getUsersStateless({ 
        PublicKeysBase58Check: publicKeys,
        SkipForLeaderboard: true
      });

      if (result.success) {
        setAltUserProfiles(result.data.UserList);
      } else {
        setAltUserProfiles(null);
        setAltUserProfilesError(result.error);
      }
    } catch (error) {
      setAltUserProfiles(null);
      setAltUserProfilesError(error.message);
    } finally {
      setIsAltUserProfilesLoading(false);
    }
  }, [altUsers, getUsersStateless]);  

  // get user profile on load
  // and get alt user profiles as well
  useEffect(() => {
    fetchUserProfile();
    fetchAltUserProfiles();
  }, [fetchUserProfile, fetchAltUserProfiles]);

  return (
    <UserContext.Provider value={{ 
      userProfile, isUserProfileLoading, userProfileError, fetchUserProfile, // single profile
      altUserProfiles, isAltUserProfileSLoading, altUserProfilesError, fetchAltUserProfiles // alt profiles
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);

