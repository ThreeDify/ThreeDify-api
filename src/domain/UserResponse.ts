export interface UserResponse {
  id: number;
  email?: string;
  username: string;
  last_name: string;
  first_name: string;
  created_at?: Date;
  updated_at?: Date;
}

export default UserResponse;
