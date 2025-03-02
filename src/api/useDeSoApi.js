import { useMemo, useCallback } from "react";
import { createApiHandler } from "./apiDeSoUtils";

export function useDeSoApi() {
  const baseUrl = "https://node.deso.org/api/v0";
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

  return {
    getSingleProfile,
    getUsersStateless,
    getTotalSupply,
    getExchangeRate
  };
}
