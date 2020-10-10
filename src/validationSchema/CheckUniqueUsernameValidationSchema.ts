import Joi from 'joi';

export const CheckUniqueUsernameValidationSchema: Joi.ObjectSchema<{
  username: string;
}> = Joi.object<{
  username: string;
}>({
  username: Joi.string()
    .regex(/^[a-zA-Z0-9_]*$/)
    .min(5)
    .max(15)
    .required(),
});

export default CheckUniqueUsernameValidationSchema;
