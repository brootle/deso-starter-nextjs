export function createApiHandler({ baseUrl }) {
  return async function apiRequest({ endpoint, options = {} }) {
    const defaultOptions = {
      method: "POST", // ✅ Default to POST
      headers: {
        "Content-Type": "application/json", // ✅ Default header
        ...options.headers, // Merge user-defined headers
      },
      ...options, // Spread options (user can override)
    };

    try {
      const response = await fetch(`${baseUrl}/${endpoint}`, defaultOptions);
      const data = await response.json();

      return response.ok
        ? { success: true, data }
        : { success: false, error: data?.error || "Unknown API error" };
    } catch (error) {
      return { success: false, error: error?.message || "Network error" };
    }
  };
}
  
  