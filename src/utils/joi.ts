import { ValidationError } from 'joi';

import { ValidationErrorResponse } from '../domain/validations';

export function errorToResponse(
  errors: ValidationError
): ValidationErrorResponse {
  return {
    errors: errors.details.map((value) => {
      return {
        [value.context?.key || '']: {
          message: value.message,
          value: value.context?.value,
        },
      };
    }),
  };
}
