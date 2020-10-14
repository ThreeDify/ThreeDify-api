import { Model } from 'objection';

const TABLE_NAME: string = 'users';

export class User extends Model {
  id!: number;
  email!: string;
  username!: string;
  password?: string;
  lastName!: string;
  firstName!: string;

  created_at?: Date;
  updated_at?: Date;

  rawPassword?: string;

  static get tableName() {
    return TABLE_NAME;
  }

  static get modifiers() {
    return {
      defaultSelect(builder: any) {
        builder.select('id', 'username', 'lastName', 'firstName');
      },
    };
  }
}

export default User;
