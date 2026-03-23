
import { API_BASE_URL } from "./apiEndpoints";
import tryRefreshToken from "./tokenService";

import { getToken } from "./tokenStorage";

export async function apiRequest<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE"|"PATCH",
  body?: any,
  retry: boolean = true
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // Set Content-Type only if body is not FormData
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(API_BASE_URL + url, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  // Token expired: attempt refresh and retry
  if (response.status === 401 && retry) {
    const refreshed = await tryRefreshToken();

    if (refreshed) {
      // Retry request once with the new token
      return apiRequest<T>(url, method, body, false);
    }
    else{
      console.error("Token refresh failed, please log in again.");
      localStorage.clear()
    }
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error("Unexpected API error");
    }
    
    // Extract detailed error message if available in the structure provided by the user
    const detailedError = errorData?.error?.errors?.[0]?.detail;
    const errorMessage = detailedError || errorData?.message || "API error";
    
    throw new Error(errorMessage);
  }

  // Handle cases where response is not JSON (e.g., file blob)
  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  // Return full response (for non-JSON types)
  return response as any;
}
