import { useGoogleOneTapLogin } from "@react-oauth/google";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";

/**
 * Renders nothing — but triggers Google One Tap prompt automatically
 * when the user is NOT authenticated. Place this on the Home page.
 */
const GoogleOneTap = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth();

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      if (credentialResponse.credential) {
        handleGoogleSuccess(credentialResponse.credential);
      }
    },
    onError: handleGoogleError,
    // Only prompt if not already logged in
    disabled: isAuthenticated,
    cancel_on_tap_outside: false,
    prompt_parent_id: undefined,
  });

  // This component renders nothing — it only triggers the One Tap prompt via hook
  return null;
};

export default GoogleOneTap;
