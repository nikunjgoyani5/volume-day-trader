export type FieldError = {
  field: string;
  message: string;
};

export type ApiErrorResponse = {
  message?: string;
  errors?: FieldError[];
};
