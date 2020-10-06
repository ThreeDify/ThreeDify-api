import Joi from 'joi';

export const CheckUniqueEmailValidationSchema: Joi.ObjectSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
});

export default CheckUniqueEmailValidationSchema;
