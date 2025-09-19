import { RegisterModel } from "../../Business/Models/RegisterModel";

/**
 * @author Max Sijbrands
 */
export interface IRegisterRepository {
  register(registerModel: RegisterModel, passwordHash: string): Promise<void>;
  verifyRegisterCode(code: string): Promise<boolean>;
}
