"use client";

import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

import { avatarUrl } from "@/utils/profileUtils";

export default function Home() {
  const { userPublicKey, isUserPublicKeyLoading } = useAuth();
  const { userProfile, isUserProfileLoading, userProfileError } = useUser();

  return (
    <div>
      <h1>Home Page</h1>
      <p>This is a simple Home page.</p>

      {/* Public Key Loading State */}
      {isUserPublicKeyLoading && <p>Checking authentication...</p>}

      {/* Show Public Key */}
      {userPublicKey && <p><strong>Public Key:</strong> {userPublicKey}</p>}

      {/* User Profile Loading State */}
      {isUserProfileLoading && <p>Loading profile...</p>}

      {/* Error Handling */}
      {userProfileError && <p style={{ color: "red" }}>Error: {userProfileError}</p>}

      {/* Show User Profile Info */}
      {userProfile && (
        <div>
          <h2>{userProfile.ExtraData?.DisplayName || userProfile.Username }</h2>
          <img src={avatarUrl(userProfile)} alt="Profile" width="100" />
          <p>{userProfile.Description}</p>
        </div>
      )}
    </div>
  );
}



// export default function Home() {
//   return (
//     <div>
//       <h1>Home Page</h1>
//       <p>This is a simple Home page.</p>      
//     </div>
//   );
// }
