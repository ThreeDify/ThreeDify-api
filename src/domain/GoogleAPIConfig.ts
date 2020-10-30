export interface GoogleAPIConfig {
  scopes: string[];
  client_id: string;
  redirect_url: string;
  client_secret: string;
  refresh_token: string;
  upload_directory_id: string;
}

export default GoogleAPIConfig;
