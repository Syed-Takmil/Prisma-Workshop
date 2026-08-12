"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const client_1 = require("@prisma/client");
const globalErrorHandler = (err, req, res, _next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errorDetails = err;
    // Handle Prisma Known Request Errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = 400;
            message = 'Duplicate field value entered (Unique constraint failed)';
        }
        else if (err.code === 'P2025') {
            statusCode = 404;
            message = 'Requested record was not found in the database';
        }
    }
    // Handle Prisma Validation Errors
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = 'Invalid input data provided to database query';
    }
    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
    });
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=errorHandler.js.map