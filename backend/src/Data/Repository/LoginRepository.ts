import { LoginModel } from "../../Business/Models/LoginModel";
import { ILoginRepository } from "../Interfaces/ILoginRepository";
import SessionTable from "../Tables/SessionTable";
import { DatabaseError } from "../../Errors/DatabaseError";
import UserTable from "../Tables/UserTable";

/**
 * @author Roan Slingerland
 */
export class LoginRepository implements ILoginRepository {
    public async createSession(sessionId: string, email: string): Promise<void> {
        // Expiration date expires after 8 hours.
        const expirationDate: Date = new Date(Date.now() + 28800000); 

        try {
            await SessionTable.create({
                id: sessionId,
                expiration_date: expirationDate,
                user_email: email
            })
        } catch (error) {
            throw new DatabaseError("Something went wrong.");
        }
    }

    public async getSessionIdByEmail(email: string): Promise<string | null> {
        try {
            const results = await SessionTable.findOne({
                where: {
                    user_email: email
                }
            });
    
            if(!results) {
                return null;
            } else if (results.expiration_date.getTime() < Date.now()) {
                await this.deleteSessionById(results.id);
                return null;
            }
    
            return results.id;
        } catch (error) {
            throw new DatabaseError("Something went wrong.");
        }
    }

    public async getUserCredentialsByEmail(email: string): Promise<LoginModel | null> {
        try {
            const results = await UserTable.findOne({
                where: {
                    email: email
                },
                attributes: {
                    exclude: ["first_name", "last_name", "user_type_id"]
                },
            });

            if(!results) {
                return null;
            }

            return new LoginModel(
                results.email,
                results.password_hash
            );
        } catch (error) {
            throw new DatabaseError("Something went wrong.");
        }
    }

    public async deleteSessionById(sessionId: string): Promise<void> {
        try {
            await SessionTable.destroy({
                where: {
                    id: sessionId
                }
            })
        } catch (error) {
            throw new DatabaseError("Something went wrong.");
        }
    }
}