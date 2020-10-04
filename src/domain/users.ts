export interface User {
  id?: number;
  email: string;
  username: string;
  password?: string;
  last_name: string;
  first_name: string;
}

export interface NewUser {
  email: string;
  username: string;
  last_name: string;
  first_name: string;
  rawPassword: string;
}

export default User;
