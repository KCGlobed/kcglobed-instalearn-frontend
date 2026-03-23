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

export interface LoginCred {
  email: string;
  password: string;
  role: string; // Optional, if you want to include user role in login
  device_id:string,
  device_type:string
}