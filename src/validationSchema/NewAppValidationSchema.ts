import Joi from 'joi';
import { NewApp } from '../domain/NewApp';

export const NewAppValidationSchema: Joi.ObjectSchema<NewApp> = Joi.object<
  NewApp
>({
  name: Joi.string().required(),
  domain: Joi.string().required(),
});

export default NewAppValidationSchema;
