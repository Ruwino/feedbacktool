import { ILoginRepository } from "../../Data/Interfaces/ILoginRepository";
import { NotFoundError } from "../../Errors/NotFoundError";
import { UnauthorizedError } from "../../Errors/UnauthorizedError";
import { LoginModel } from "../Models/LoginModel";
import argon2 from "argon2"; 
import { v4 as uuidv4 } from "uuid";

/**
 * @author Roan Slingerland
 */
export class LoginService {
    private database: ILoginRepository;

    constructor(database: ILoginRepository) {
        this.database = database;
    }

    public async login(loginData: LoginModel): Promise<string> {
        if(await this.validateUserWithPassword(loginData)) {
            const activeSession: string | null = await this.database.getSessionIdByEmail(loginData.email);
            if(!activeSession) {
                const newSessionId: string = this.generateSessionId();
                await this.database.createSession(newSessionId, loginData.email);
                return newSessionId;
            } else {
                return activeSession;
            }
        } else {
            throw new UnauthorizedError("Unauthorized.");
        }
    }

    public async logout(sessionId: string): Promise<void> {
        await this.database.deleteSessionById(sessionId);
    }

    private generateSessionId(): string {
        const sessionId: string = uuidv4();
        return sessionId;
    }

    private async validateUserWithPassword(loginData: LoginModel): Promise<boolean> {
        const userCredentials: LoginModel | null = await this.database.getUserCredentialsByEmail(loginData.email);

        if(!userCredentials) {
            throw new NotFoundError("User not found.");
        }

        const isValidPassword: boolean = await this.validatePassword(loginData.password, userCredentials.password);

        return isValidPassword;
    }

    private async validatePassword(userPassword: string, existingHash: string): Promise<boolean> {
        try {
            const passwordMatch: boolean = await argon2.verify(existingHash, userPassword);
            return passwordMatch;
        } catch (error) {
            console.error("Validation error: ", error);
            return false;
        }
    }

}