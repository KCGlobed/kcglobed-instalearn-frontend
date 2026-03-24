export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
  role: Role;
}

export interface Role {
  data: RoleName[]
}

export interface RoleName {
  name: string
}

export interface ForgotPasswordState {
  loading: boolean;
  error: string | null;
  message: string | null;
  success: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  status: boolean;
  data: any;
}

export interface ResetPasswordState {
  loading: boolean;
  error: string | null;
  message: string | null;
  success: boolean;
}

export interface ResetPasswordPayload {
  password:  string;
  confirm_password: string;
  uid: string;
  token: string;
}

export interface LoginCred {
  email: string;
  password: string;
  role: string; // Optional, if you want to include user role in login
  device_id:string,
  device_type:string
}