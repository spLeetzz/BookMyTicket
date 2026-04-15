class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string = "Bad request") {
    return new ApiError(400, message);
  }

  static invalidInput(message: string = "Invalid input") {
    return new ApiError(400, message);
  }

  static conflict(message: string = "Conflict") {
    return new ApiError(409, message);
  }

  static unauthorized(message: string = "Unauthorized") {
    return new ApiError(401, message);
  }

  static notFound(message: string = "Not found") {
    return new ApiError(404, message);
  }

  static internal(message: string = "Internal server error") {
    return new ApiError(500, message);
  }
}

export default ApiError;
