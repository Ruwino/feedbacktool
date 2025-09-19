import { SessionModel } from "../../Business/Models/SessionModel";
import { DatabaseError } from "../../Errors/DatabaseError";
import { NotFoundError } from "../../Errors/NotFoundError";
import { IAuthRepository } from "../Interfaces/IAuthRepository";
import SessionTable from "../Tables/SessionTable";
import UserTable from "../Tables/UserTable";
import UserTypeTable from "../Tables/UserTypeTable";

/**
 * @author Roan Slingerland
 */
export class AuthRepository implements IAuthRepository {
    public async getSessionById(sessionId: string): Promise<SessionModel | null> {
        try {
            const results = await SessionTable.findOne({
                where: {
                    id: sessionId
                }
            });

            if(!results) {
                return null;
            } else if(new Date(results.expiration_date).getTime() < Date.now()) {
                await this.deleteSessionById(results.id);
                return null;
            }

            return new SessionModel(
                results.id,
                new Date(results.expiration_date),
                results.user_email
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
            });
        } catch (error) {
            throw new DatabaseError("Something went wrong.");
        }
    }

    public async getUserRoleByEmail(email: string): Promise<string> {
        try {
            const results = await UserTable.findOne({
                where: {
                    email: email
                },
                attributes: {
                    exclude: ["password_hash", "first_name", "last_name"]
                },
                include: [
                    {
                        model: UserTypeTable,
                        as: "user_type",
                        attributes: ["id", "name"]
                    },
                ],
            });

            if(!results || !results.user_type) {
                throw new NotFoundError("Not found.");
            } 

            const roleData = results.user_type as UserTypeTable;


            return roleData.name;
        } catch (error) {
            throw new DatabaseError("Something went wrong.");
        }
    }
}