export interface User {
  id?: number;
  email?: string;
  username: string;
  password?: string;
  last_name: string;
  first_name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface NewUser {
  email: string;
  username: string;
  last_name: string;
  first_name: string;
  rawPassword: string;
}

export default User;
