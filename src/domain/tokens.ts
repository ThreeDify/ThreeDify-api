export interface Tokens {
  id?: number;
  user_id: number;
  access_token: string;
  refresh_token: string;
  created_at?: Date;
  updated_at?: Date;
}

export default Tokens;
