// It was from asyncHandler used to handle err from middleware
// We can also see the errors in postman.

const notFound = (req, res, next) => {
     const error = new Error(`Not Found - ${req.originalUrl}`);
     res.status(404);
     next(error);
}
 
const errorHandler = (err, req, res, next) => {
 
     console.log('Error handler middleware:', err); 
 
     let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
     let message = err.message;
 
     if (err.name === "CastError" && err.kind === "ObjectId") {
         message = "Resource not found - Invalid ID";
         statusCode = 404;
     }
 
     res.status(statusCode).json({
         message: message,
     });
 
}

export { notFound, errorHandler };