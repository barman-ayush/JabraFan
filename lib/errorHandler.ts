class ErrorHandler extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name; // Name of the custom error class
    }
}

export default ErrorHandler;