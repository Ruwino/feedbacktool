import { IAuthRepository } from "../../Data/Interfaces/IAuthRepository";
import { SessionModel } from "../Models/SessionModel";

/**
 * @author Roan Slingerland
 */
export class AuthService {
    private database: IAuthRepository;

    constructor(database: IAuthRepository) {
        this.database = database;
    }

    public async getSessionById(sessionId: string): Promise<SessionModel | null> {
        const session: SessionModel | null = await this.database.getSessionById(sessionId);

        return session;
    }

    public async getUserRoleByEmail(email: string): Promise<string> {
        return await this.database.getUserRoleByEmail(email);
    }

    public async getUserRoleBySessionId(sessionId: string): Promise<string> {
        const session: SessionModel | null = await this.getSessionById(sessionId);
        return await this.getUserRoleByEmail(session!.email);
    }
}