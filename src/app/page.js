"use client";

import { useState } from "react"

import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

import { useDeSoApi } from "@/api/useDeSoApi";

import { avatarUrl } from "@/utils/profileUtils";

export default function Home() {

  const { 
    userPublicKey, isUserPublicKeyLoading, 
    signAndSubmitTransaction
  } = useAuth();

  const { userProfile, isUserProfileLoading, userProfileError } = useUser();

  const { createSubmitPostTransaction } = useDeSoApi();

  // for post
  const [postText, setPostText] = useState('');
  const [loading, setLoading] = useState(false);  
  const [postError, setPostError] = useState(null);  

  const handlePostChange = (event) => {
    setPostError(null) // clears possible error from previous post attempt
    setPostText(event.target.value);
  };

  const submitPost = async () => {

    setLoading(true)

    try {

      let settings = {
        UpdaterPublicKeyBase58Check: userPublicKey,
        Body: postText,
        MinFeeRateNanosPerKB: 1500
      }    
          
      const result = await createSubmitPostTransaction(settings)    
      console.log("createSubmitPostTransaction result: ", result)

      if(result.error){
          console.log("error: ", error)
          setPostError(error)
      }

      if(result.success && result.data?.TransactionHex){

        const submittedTransaction = await signAndSubmitTransaction(result.data?.TransactionHex)

        // submittedTransaction.PostEntryResponse is posted post
        console.log({submittedTransaction})

        setPostText(""); // ✅ clear post
      }      

      setLoading(false)

    } catch (error) {
      console.log("Error: ", error)
      setPostError(error)
      setLoading(false)
    }   
  }  

  return (
    <div>
      <h1>DeSo App</h1>

      {/* Public Key Loading State */}
      {isUserPublicKeyLoading && <p>Checking authentication...</p>}

      {/* Show Public Key */}
      {userPublicKey && <p><strong>Public Key:</strong> {userPublicKey}</p>}

      {/* User Profile Loading State */}
      {isUserProfileLoading 
        ?
        <p>Loading profile...</p>
        :
        <div>
        {/* Show User Profile Info */}
        {userProfile && (
          <div>
            <h2>{userProfile.ExtraData?.DisplayName || userProfile.Username }</h2>
            <img src={avatarUrl(userProfile)} alt="Profile" width="100" />
            <p>{userProfile.Description}</p>
          </div>
        )}
        </div>
      }

      {/* Error Handling */}
      {userProfileError && <p style={{ color: "red" }}>Error: {userProfileError}</p>}

      {userPublicKey && (
        <div>
          <div>
            <textarea 
              disabled={loading} 
              value={postText} 
              onChange={handlePostChange} 
              placeholder={`Write some epic post to DeSo as ${userProfile?.Username || userPublicKey}`} 
            /> 
          </div> 
          <button disabled={loading || !postText} onClick={submitPost}>Post to DeSo</button>  
          {postError && <p style={{ color: "red" }}>Error: {postError}</p>}
        </div>
      )}
    </div>
  );
}