// Custom error class — every intentional error uses this
// Unintentional errors (bugs) are plain Error objects
// The error handler uses this distinction to decide what to show users

export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(
    message: string,
    statusCode = 500,
    isOperational = true
  ) {
    super(message)
    this.statusCode     = statusCode
    this.isOperational  = isOperational

    // Maintains proper stack trace in V8
    Error.captureStackTrace(this, this.constructor)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

// Common errors as static methods — used throughout the app
export class NotFoundError     extends AppError { constructor(msg = 'Resource not found')     { super(msg, 404) } }
export class UnauthorizedError extends AppError { constructor(msg = 'Not authenticated')       { super(msg, 401) } }
export class ForbiddenError    extends AppError { constructor(msg = 'Access denied')           { super(msg, 403) } }
export class ValidationError   extends AppError { constructor(msg = 'Validation failed')       { super(msg, 400) } }
export class ConflictError     extends AppError { constructor(msg = 'Resource already exists') { super(msg, 409) } }