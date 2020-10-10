import Joi from 'joi';
import { NewUser } from '../domain/users';

export const NewUserValidationSchema: Joi.ObjectSchema<NewUser> = Joi.object<
  NewUser
>({
  last_name: Joi.string().required(),
  first_name: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  rawPassword: Joi.string().min(8).max(20).required(),
  username: Joi.string()
    .regex(/^[a-zA-Z0-9_]*$/)
    .min(5)
    .max(15)
    .required(),
});

export default NewUserValidationSchema;
