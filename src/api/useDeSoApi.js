import { useMemo, useCallback } from "react";
import { createApiHandler } from "./apiDeSoUtils";
import { DESO_API_BASE } from "@/config/desoConfig";

export function useDeSoApi() {
  const baseUrl = DESO_API_BASE;
  const apiRequest = useMemo(() => createApiHandler({ baseUrl }), [baseUrl]);

  const getSingleProfile = useCallback((params) => {
    return apiRequest({
      endpoint: "get-single-profile",
      options: { body: JSON.stringify(params) },
    });
  }, [apiRequest]);

  // this can be used to load all alt users to switch account
  const getUsersStateless = useCallback((params) => {
    return apiRequest({
      endpoint: "get-users-stateless",
      options: { body: JSON.stringify(params) },
    });
  }, [apiRequest]);  

  const getTotalSupply = useCallback(() => {
    return apiRequest({
      endpoint: "total-supply",
      options: { method: "GET" },
    });
  }, [apiRequest]);  

  const getExchangeRate = useCallback(() => {
    return apiRequest({
      endpoint: "get-exchange-rate",
      options: { method: "GET" },
    });
  }, [apiRequest]);    

  const submitPost = useCallback((params) => {
    const {
      UpdaterPublicKeyBase58Check,
      ParentStakeID = "",
      RepostedPostHashHex = "",
      PostHashHexToModify = "",
      Body = "",
      ImageURLs = null,
      VideoURLs = null,
      PostExtraData = null,
      MinFeeRateNanosPerKB,
    } = params;
  
    const payload = {
      UpdaterPublicKeyBase58Check,
      PostHashHexToModify,
      ParentStakeID,
      Title: "",
      BodyObj: {
        Body,
        ImageURLs,
        VideoURLs,
      },
      RepostedPostHashHex,
      PostExtraData,
      Sub: "",
      IsHidden: false,
      MinFeeRateNanosPerKB,
      InTutorial: false,
    };
  
    return apiRequest({
      endpoint: "submit-post",
      options: {
        body: JSON.stringify(payload),
      },
    });
  }, [apiRequest]);
  
  return {
    getSingleProfile,
    getUsersStateless,
    getTotalSupply,
    getExchangeRate,
    submitPost
  };
}
