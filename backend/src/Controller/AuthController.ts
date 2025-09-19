import { Request, Response } from 'express';
import {AuthService} from "../Business/Service/AuthService";

export class AuthController {

    constructor(private authService: AuthService) { }

    public async userRole(req: Request, res: Response): Promise<void> {
        try {
            const userRole = await this.authService.getUserRoleBySessionId(req.cookies.sessionId);
            res.status(200).json(userRole);
        } catch (err: unknown) {
            res.status(500).json(err);
        }
    }
}