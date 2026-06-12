import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { useAppDispatch } from "./useAppDispatch";
import { googleLogin } from "../store/slices/authSlice";

interface GoogleJwtPayload {
  name: string;
  email: string;
  sub: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

const getDeviceId = (): string => {
  let deviceId = localStorage.getItem("device_id");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("device_id", deviceId);
  }
  return deviceId;
};

const getDeviceType = (): string => {
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile/i.test(ua)) return "mobile";
  if (/tablet/i.test(ua)) return "tablet";
  return "desktop";
};

export const useGoogleAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credential: string) => {
    try {
      // Decode the Google JWT to extract user info
      const decoded = jwtDecode<GoogleJwtPayload>(credential);

      const payload = {
        name: decoded.name,
        email: decoded.email,
        social_id: decoded.sub,
        social_type: "Google",
        token: credential,
        role: "Student",
        device_id: getDeviceId(),
        device_type: getDeviceType(),
      };

      const result = await dispatch(googleLogin(payload));

      if (googleLogin.fulfilled.match(result)) {
        toast.success("Logged in with Google!");
        navigate("/");
      } else if (googleLogin.rejected.match(result)) {
        const msg = result.payload as string;
        toast.error(msg || "Google login failed. Please try again.");
      }
    } catch (err) {
      console.error("Google auth error:", err);
      toast.error("Something went wrong during Google login.");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in was cancelled or failed.");
  };

  return { handleGoogleSuccess, handleGoogleError };
};
