import Joi from 'joi';

export const LoginCredentialValidationSchema: Joi.ObjectSchema = Joi.object({
  password: Joi.string().required(),
  username: Joi.string()
    .regex(/^[a-zA-Z0-9_]*$/)
    .min(5)
    .max(15)
    .required(),
});

export default LoginCredentialValidationSchema;
