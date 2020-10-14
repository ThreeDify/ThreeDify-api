import Joi from 'joi';
import { NewReconstruction } from '../domain/NewReconstruction';

export const NewReconstructionValidationSchema: Joi.ObjectSchema<NewReconstruction> = Joi.object<
  NewReconstruction
>({
  reconstruction_name: Joi.string().max(20).required(),
});

export default NewReconstructionValidationSchema;
