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

    if (context.retry) {
      const retryCount = this.retryQueue.get(errorId) || 0;
      if (retryCount < 3) {
        this.retryQueue.set(errorId, retryCount + 1);
        // Implement retry logic here
      }
    }

    // Log error for debugging
    console.error("Application error:", {
      id: errorId,
      context,
      error: error instanceof Error ? error.message : String(error),
    });
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
