import { IRegisterRepository } from "../Interfaces/IRegisterRepository";
import { RegisterModel } from "../../Business/Models/RegisterModel";
import UserTable from "../Tables/UserTable";
import SubjectTable from "../Tables/SubjectTable";
import RegisterCodeTable from "../Tables/RegisterCodeTable";
import SubjectHasTeacherTable from "../Tables/SubjectHasTeacherTable";
import { DatabaseError } from "../../Errors/DatabaseError";
import { Transaction } from "sequelize";
import { sequelize } from "../../Database/Configuration";

export class RegisterRepository implements IRegisterRepository {
  public async register(
    registerModel: RegisterModel,
    passwordHash: string
  ): Promise<void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      // Create teacher account
      await UserTable.create(
        {
          email: registerModel.email,
          first_name: registerModel.firstName,
          last_name: registerModel.lastName,
          password_hash: passwordHash,
          user_type_id: 2,
        },
        { transaction }
      );

      // Process all subjects
      for (const subjectName of registerModel.subjects) {
        // Find the subject
        const subject = await SubjectTable.findOne({
          where: {
            name: subjectName,
          },
        });

        if (!subject) {
          throw new DatabaseError(
            `Subject '${subjectName}' not found. Please select valid subjects.`
          );
        }

        // Create association between teacher and subject
        await SubjectHasTeacherTable.create(
          {
            user_email: registerModel.email,
            subject_id: subject.id,
          },
          { transaction }
        );
      }

      await transaction.commit();
    } catch (error: any) {
      await transaction.rollback();
      console.error("Registration error details:", error);
      throw new DatabaseError(error.message);
    }
  }
  /**
   * Verifies if a registration code exists and is valid
   * @param code The registration code to verify
   * @returns Boolean indicating if the code is valid
   */
  public async verifyRegisterCode(code: string): Promise<boolean> {
    try {
      const registerCode = await RegisterCodeTable.findOne({
        where: {
          code: code,
        },
      });

      return registerCode !== null;
    } catch (error) {
      console.error("Error verifying registration code:", error);
      throw new DatabaseError("Failed to verify registration code");
    }
  }
}
