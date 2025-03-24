"use client";

import { useState } from "react"

import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

import { useDeSoApi } from "@/api/useDeSoApi";

import { avatarUrl } from "@/utils/profileUtils";

import styles from "./page.module.css";

export default function Home() {

  const { 
    userPublicKey, isUserPublicKeyLoading, 
    signAndSubmitTransaction
  } = useAuth();

  const { userProfile, isUserProfileLoading, userProfileError } = useUser();

  const { submitPost } = useDeSoApi();

  // for post
  const [postText, setPostText] = useState('');
  const [loading, setLoading] = useState(false);  
  const [postError, setPostError] = useState(null);  
  const [lastPostTransaction, setLastPostTransaction] = useState(null);  

  const handlePostChange = (event) => {
    if(postError){  
      setPostError(null) // clears possible error from previous post attempt
    }

    setPostText(event.target.value);
  };

  const handleSubmitPost = async () => {

    setLoading(true)

    try {

      let settings = {
        UpdaterPublicKeyBase58Check: userPublicKey,
        Body: postText,
        MinFeeRateNanosPerKB: 1500
      }    
          
      const result = await submitPost(settings)    
      console.log("createSubmitPostTransaction result: ", result)

      if(result.error){
          console.log("error: ", error)
          setPostError(error)
      }

      if(result.success && result.data?.TransactionHex){

        const postTransaction = await signAndSubmitTransaction(result.data?.TransactionHex)

        // postTransaction.PostEntryResponse is posted post
        console.log({postTransaction})
        setLastPostTransaction(postTransaction)

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
    <div className={styles.pageContainer}>

      {/* Public Key Loading State */}
      {isUserPublicKeyLoading 
        ?<p>Checking authentication...</p>
        :
        <>
          {userPublicKey && <p><strong>Public Key:</strong> {userPublicKey}</p>}        
        </>
      }

      {/* Error Handling */}
      {userProfileError && <p className={styles.error}>Error: {userProfileError}</p>}

      {userPublicKey && (
        <div className={styles.postContainer}>
          <textarea 
            disabled={loading || isUserPublicKeyLoading} 
            value={postText} 
            onChange={handlePostChange} 
            placeholder={`Write some epic post to DeSo as ${userProfile?.Username || userPublicKey}`} 
          /> 

          <button disabled={loading || !postText || isUserPublicKeyLoading} onClick={handleSubmitPost}>Post to DeSo</button>  

          {lastPostTransaction && lastPostTransaction?.TxnHashHex &&
            <div>
              Check your last post here: <a href={`https://focus.xyz/post/${lastPostTransaction?.TxnHashHex}`} target="_blank" rel="noreferrer">{lastPostTransaction?.TxnHashHex}</a>
            </div>
          }

          {postError && <p className={styles.error}>Error: {postError}</p>}
        </div>
      )}      


      {/* User Profile Loading State */}
      {isUserProfileLoading 
        ?
        <p>Loading profile...</p>
        :
        <>
        {/* Show User Profile Info */}
        {userProfile && (
          <div className={styles.profileContainer}>
            {userProfile.ExtraData?.DisplayName && <h2>{userProfile.ExtraData?.DisplayName}</h2>}
            {userProfile.Username && <div>{userProfile.Username}</div>}
            <img src={avatarUrl(userProfile)} alt="Profile" width="100" />
            <p>{userProfile.Description}</p>
          </div>
        )}
        </>
      }


    </div>
  );
}