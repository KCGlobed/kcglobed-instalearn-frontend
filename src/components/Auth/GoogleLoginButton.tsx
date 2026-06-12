import { GoogleLogin } from "@react-oauth/google";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

interface GoogleLoginButtonProps {
  /** "popup" shows a modal picker; "redirect" navigates away. Default: "popup" */
  flow?: "implicit" | "auth-code";
  /** Width in px of the rendered Google button. Default: 320 */
  width?: number;
  /** Text shown on the button. Default: "signin_with" */
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
}

const GoogleLoginButton = ({
  width = 320,
  text = "continue_with",
}: GoogleLoginButtonProps) => {
  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth();
  const loading = useSelector((state: RootState) => state.auth.loading);

  return (
    <div className={`w-full flex justify-center ${loading ? "opacity-60 pointer-events-none" : ""}`}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            handleGoogleSuccess(credentialResponse.credential);
          }
        }}
        onError={handleGoogleError}
        width={width}
        text={text}
        shape="rectangular"
        theme="outline"
        size="large"
        logo_alignment="left"
        useOneTap={false}
      />
    </div>
  );
};

export default GoogleLoginButton;
