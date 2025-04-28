import { ValidationError } from "./validation.service";

export type ErrorType = "network" | "validation" | "system" | "auth";
export type ErrorSeverity = "low" | "medium" | "high";

export interface AppError {
  type: ErrorType;
  severity: ErrorSeverity;
  operation: string;
  retry?: boolean;
}

export class ErrorHandlingService {
  private static instance: ErrorHandlingService;
  private errors: Map<string, AppError> = new Map();
  private retryQueue: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService();
    }
    return ErrorHandlingService.instance;
  }

  async handleError(error: unknown, context: AppError): Promise<void> {
    const errorId = `${context.type}_${context.operation}_${Date.now()}`;
    this.errors.set(errorId, {
      ...context,
      retry: context.retry ?? false,
    });

    // Enhanced error logging
    console.error("[Error] Application error:", {
      id: errorId,
      type: context.type,
      severity: context.severity,
      operation: context.operation,
      retry: context.retry,
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
              name: error.name,
            }
          : String(error),
      timestamp: new Date().toISOString(),
    });

    if (context.retry) {
      const retryCount = this.retryQueue.get(errorId) || 0;
      if (retryCount < 3) {
        this.retryQueue.set(errorId, retryCount + 1);
        console.log(
          `[Error] Retrying operation ${context.operation} (attempt ${
            retryCount + 1
          }/3)`
        );
        // Implement retry logic here
      } else {
        console.error(
          `[Error] Max retries reached for operation ${context.operation}`
        );
      }
    }
  }

  getActiveErrors(): AppError[] {
    return Array.from(this.errors.values());
  }

  clearError(errorId: string): void {
    this.errors.delete(errorId);
    this.retryQueue.delete(errorId);
  }
}

export const errorService = ErrorHandlingService.getInstance();
