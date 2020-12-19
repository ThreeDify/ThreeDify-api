import { Model } from 'objection';

const TABLE_NAME: string = 'apps';

export class App extends Model {
  id!: number;
  key!: string;
  name!: string;
  secret!: string;
  domain!: string;

  createdAt?: Date;
  updatedAt?: Date;

  static get tableName() {
    return TABLE_NAME;
  }
}

export default App;
