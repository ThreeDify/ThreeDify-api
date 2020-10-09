export interface LoginCredential {
  username: string;
  password: string;
}

export interface TokenCredential {
  accessToken: string;
  refreshToken: string;
}

export default LoginCredential;
