export interface ValidationError {
  value?: string;
  message: string;
}

export interface ValidationErrorItem {
  [key: string]: ValidationError;
}

export interface ValidationErrorResponse {
  errors: ValidationErrorItem[];
}
