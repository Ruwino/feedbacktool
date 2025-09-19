import { IRegisterRepository } from "../../Data/Interfaces/IRegisterRepository";
import { RegisterModel } from "../Models/RegisterModel";
import argon2 from "argon2";
import { IUserRepository } from "../../Data/Interfaces/IUserRepository";
import { BadRequestError } from "../../Errors/BadRequestError";
import { UserModel } from "../Models/UserModel";

/**
 * @author Max Sijbrands
 */
export class RegisterService {
  private registerRepository: IRegisterRepository;
  private userRepository: IUserRepository;

  constructor(
    registerRepository: IRegisterRepository,
    userRepository: IUserRepository
  ) {
    this.registerRepository = registerRepository;
    this.userRepository = userRepository;
  }

  public async register(
    registerModel: RegisterModel,
    registerCode: string
  ): Promise<void> {
    // Verify the registration code first
    const isValidCode = await this.registerRepository.verifyRegisterCode(
      registerCode
    );
    if (!isValidCode) {
      throw new BadRequestError("Invalid registration code.");
    }

    // Check if user already exists
    const existingUser: UserModel | null =
      await this.userRepository.getUserByEmail(registerModel.email);

    if (existingUser) {
      throw new BadRequestError("User with this email address already exists.");
    }

    const passwordHash: string = await this.hashPassword(
      registerModel.password
    );

    await this.registerRepository.register(registerModel, passwordHash);
  }

  /**
   * Verifies if a registration code is valid
   * @param code The registration code to verify
   * @returns Boolean indicating if the code is valid
   */
  public async verifyRegisterCode(code: string): Promise<boolean> {
    return await this.registerRepository.verifyRegisterCode(code);
  }

  /**
   * Hashes the password of a user with Argon2
   */
  private async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }
}
