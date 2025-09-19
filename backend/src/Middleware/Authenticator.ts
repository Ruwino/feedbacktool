import { NextFunction, Request } from "express";
import { AuthService } from "../Business/Service/AuthService";
import { UnauthorizedError } from "../Errors/UnauthorizedError";
import { SessionModel } from "../Business/Models/SessionModel";
import { NotFoundError } from "../Errors/NotFoundError";

/**
 * @author Roan Slingerland
 */
export class Authenticator {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    public async validateSession(req: Request, next: NextFunction, requiredRoles: string[]): Promise<void> {
        try {
            const sessionId: string = req.cookies.sessionId;
            if(!sessionId) {
                throw new UnauthorizedError("Login to perform this action.");
            }

            const activeSession: SessionModel | null = await this.authService.getSessionById(sessionId);
            if(!activeSession){
                throw new UnauthorizedError("Invalid session, try again.");
            }

            const userRole: string = await this.authService.getUserRoleByEmail(activeSession.email);
                
            if(userRole !== 'Admin' && !requiredRoles.includes(userRole)) throw new UnauthorizedError("Permission denied.");

            req.body.email = activeSession.email;
            req.body.userType = userRole;

            next();
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
}