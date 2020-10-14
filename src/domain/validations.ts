export interface ValidationError {
  value?: any;
  message: string;
}

export interface ValidationErrorItem {
  [key: string]: ValidationError;
}

export interface ValidationErrorResponse {
  errors: ValidationErrorItem[];
}
