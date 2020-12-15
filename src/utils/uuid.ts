import { v4 as uuidv4 } from 'uuid';

export function generate() {
  return uuidv4();
}

export default {
  generate,
};
