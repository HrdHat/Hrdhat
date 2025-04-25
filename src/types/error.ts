export interface AppError {
  message?: string;
  code?: string;
  details?: unknown;
  stack?: string;
}
