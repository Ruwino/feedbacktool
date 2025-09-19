import { NextFunction, Request, Response } from "express";

/**
 * @author Roan Slingerland
 * Error handler will change based on the custom errors people add.
 */
export class ErrorHandler {
    private logging: boolean;

    constructor(logging: boolean = true) {
        this.logging = logging;
    }

    public invoke(error: Error, res: Response): void {
        if(error.name === "DatabaseError") {
            res.status(500).json("Internal server error.");
        } else if (error.name === "UnauthorizedError") {
            res.status(401).json("Unauthorized.");
        } else if (error.name === "NotFoundError") {
            res.status(404).json("Not found");
        } else if (error.name === "Error" || error.name === 'BadRequestError') {
            res.status(400).json("Bad request");
        }

        if (this.logging) {
            console.log(error);
        }
    }
}