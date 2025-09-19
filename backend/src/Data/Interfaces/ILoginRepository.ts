import { LoginModel } from "../../Business/Models/LoginModel";

/**
 * @author Roan Slingerland
 */
export interface ILoginRepository {
    createSession(sessionId: string, email: string): Promise<void>;
    getSessionIdByEmail(email: string): Promise<string | null>;
    getUserCredentialsByEmail(email: string): Promise<LoginModel | null>;
    deleteSessionById(sessionId: string): Promise<void>;
}