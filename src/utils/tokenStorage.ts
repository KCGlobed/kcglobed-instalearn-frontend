export const getToken = () => localStorage.getItem("token");
export const getRefreshToken = () => localStorage.getItem("refreshToken");
export const storeToken = (token: string) => localStorage.setItem("token", token);
export const storeRefreshToken = (token: string) => localStorage.setItem("refreshToken", token);
export const storeUserID = (userID: string) => localStorage.setItem("userID", userID);
export const storeUserRole = (userRole: string) => localStorage.setItem("userRole", userRole);
export const storeUserProfile = (userProfile: string) => localStorage.setItem("userProfile", userProfile);


export const clearToken = () => {
  const deviceId = localStorage.getItem("device_id");
  localStorage.clear();
  if (deviceId) {
    localStorage.setItem("device_id", deviceId);
  }
}