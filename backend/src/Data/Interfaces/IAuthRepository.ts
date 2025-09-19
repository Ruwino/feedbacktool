import { SessionModel } from "../../Business/Models/SessionModel";

/**
 * @author Roan Slingerland
 */
export interface IAuthRepository {
    getSessionById(sessionId: string): Promise<SessionModel | null>;
    deleteSessionById(sessionId: string): Promise<void>;
    getUserRoleByEmail(email: string): Promise<string>;
}