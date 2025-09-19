import { NextFunction, Request, Response } from "express";
import { LoginService } from "../Business/Service/LoginService";
import { LoginModel } from "../Business/Models/LoginModel";

/**
 * @author Roan Slingerland
 */
export class LoginController {
    private service: LoginService;

    constructor(service: LoginService) {
        this.service = service;
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const loginData: LoginModel = new LoginModel(req.body.email, req.body.password);
            const sessionId: string = await this.service.login(loginData);
            // Cookie expiration is set to 8 hours.
            const expirationDate: Date = new Date(Date.now() + 28800000)

            res.cookie("sessionId", sessionId, {
                httpOnly: true,
                secure: false, //!! Secure must be set to "true" when product goes live!
                sameSite: "strict",
                expires: expirationDate,
                path: "/"
              });

            res.status(201).json("Logged in.");
        } catch (error) {
            next(error);
        }
    }

    public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.service.logout(req.cookies.sessionId);
            
            res.clearCookie("sessionId");
            res.status(201).json("Logged out.");
        } catch (error) {
            next(error);
        }
    }
}