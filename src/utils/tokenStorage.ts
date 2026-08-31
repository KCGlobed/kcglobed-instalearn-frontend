export const getToken = () => localStorage.getItem("token");
export const getRefreshToken = () => localStorage.getItem("refreshToken");
export const storeToken = (token: string) => localStorage.setItem("token", token);
export const storeRefreshToken = (token: string) => localStorage.setItem("refreshToken", token);
export const storeUserID = (userID: string) => localStorage.setItem("userID", userID);
export const storeUserRole = (userRole: any) => {
  localStorage.setItem("userRole", userRole);
  window.dispatchEvent(new Event('userRoleChanged'));
};
export const storeUserProfile = (userProfile: string) => localStorage.setItem("userProfile", userProfile);
export const storeSubscriptionStatus = (isSubscribe: boolean) => localStorage.setItem("isSubscribe", String(isSubscribe));

export const clearToken = () => {
  const deviceId = localStorage.getItem("device_id");
  localStorage.clear();
  if (deviceId) {
    localStorage.setItem("device_id", deviceId);
  }
  window.dispatchEvent(new Event('userRoleChanged'));
}