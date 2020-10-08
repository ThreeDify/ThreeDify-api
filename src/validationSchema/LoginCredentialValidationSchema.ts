import Joi from 'joi';

export const LoginCredentialValidationSchema: Joi.ObjectSchema = Joi.object({
  password: Joi.string().required(),
  username: Joi.string().alphanum().required(),
});

export default LoginCredentialValidationSchema;
