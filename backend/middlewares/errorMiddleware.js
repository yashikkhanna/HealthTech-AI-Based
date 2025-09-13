class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
  
    // Handle MongoDB duplicate key error (code 11000)
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
      err = new ErrorHandler(message, 400);
    }
  
    // Handle invalid JSON Web Token error
    if (err.name === "JsonWebTokenError") {
      const message = "Json Web Token Is Invalid, Try Again!";
      err = new ErrorHandler(message, 400);
    }
  
    // Handle expired JSON Web Token error
    if (err.name === "TokenExpiredError") {
      const message = "Json Web Token Is Expired, Try Again!";
      err = new ErrorHandler(message, 400);
    }
  
    // Handle MongoDB cast error (e.g., invalid object ID)
    if (err.name === "CastError") {
        const message = `Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
      }
  
    // Collect validation error messages if present
    const errorMessage = err.errors
      ? Object.values(err.errors)
          .map((error) => error.message)
          .join(" ")
      : err.message;
  
    // Return the error response
    return res.status(err.statusCode).json({
      success: false,
      message: errorMessage,
    });
  };
  
  export default ErrorHandler;
  