export interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
}

export interface PkcePair {
  codeVerifier: string;
  codeChallenge: string;
}
