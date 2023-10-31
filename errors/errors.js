class HttpError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.name = 'HttpError';
      this.statusCode = statusCode;
    }
  }
  
  class AuthenticationError extends HttpError {
    constructor(message = 'Unauthorized') {
      super(message, 401);
    }
  }
  
  class InternalServerError extends HttpError {
    constructor(message = 'Internal Server Error') {
      super(message, 500);
    }
  }
  
  class NotFoundError extends HttpError {
    constructor(message = 'Not Found') {
      super(message, 404);
    }
  }
  
  module.exports = {
    HttpError,
    AuthenticationError,
    InternalServerError,
    NotFoundError,
  };
  