import { IUserRepository } from "../Interfaces/IUserRepository";
import UserTable from "../Tables/UserTable";
import UserTypeTable from "../Tables/UserTypeTable";
import ClassTable from "../Tables/ClassTable";
import SubjectTable from "../Tables/SubjectTable";
import { UserModel } from "../../Business/Models/UserModel";
import { ClassModel } from "../../Business/Models/ClassModel";
import { SubjectModel } from "../../Business/Models/SubjectModel";
import { UserType } from "../../Enums/UserType";
import SubjectHasTeacherTable from "../Tables/SubjectHasTeacherTable";
import ClassHasUser from "../Tables/ClassHasUser";

export class UserRepository implements IUserRepository {
  /**
   * Haalt gebruiker op basis van email
   * @param email Email van de gebruiker
   * @returns UserModel met gebruikersgegevens of null indien niet gevonden
   */
  public async getUserByEmail(email: string): Promise<UserModel | null> {
    const user = await UserTable.findOne({
      where: { email },
      include: [
        {
          model: UserTypeTable,
          as: "user_type",
        },
      ],
    });

    if (!user) {
      return null;
    }

    return new UserModel(
      user.email,
      user.first_name,
      user.last_name,
      user.user_type.name as UserType
    );
  }

  /**
   * @deprecated Gebruik getUserByEmail
   * Haalt student gegevens op basis van email en controleert of het een student is
   */
  public async getStudentByEmail(email: string): Promise<UserModel | null> {
    const user = await this.getUserByEmail(email);
    if (!user || !user.isStudent()) {
      return null;
    }
    return user;
  }

  /**
   * @deprecated Gebruik getUserByEmail
   * Haalt docent gegevens op basis van email en controleert of het een docent is
   */
  public async getTeacherByEmail(email: string): Promise<UserModel | null> {
    const user = await this.getUserByEmail(email);
    if (!user || !user.isTeacher()) {
      return null;
    }
    return user;
  }

  /**
   * Haalt klassen op waar een docent toegang toe heeft
   * @param teacherEmail Email van de docent
   * @returns Array van ClassModel objecten
   */
  public async getTeacherClasses(teacherEmail: string): Promise<ClassModel[]> {
    const classes = await ClassTable.findAll({
      include: [
        {
          model: UserTable,
          as: "users",
          through: {
            where: { user_email: teacherEmail },
          },
        },
        { model: SubjectTable, as: "subject" },
      ],
    });

    // Converteer naar ClassModel objecten
    return classes.map(cls => {
      const subject = new SubjectModel(cls.subject.id, cls.subject.name);

      // Gebruik de juiste constructor parameters voor je ClassModel
      // (pas dit aan op basis van je ClassModel definitie)
      return new ClassModel(
        cls.name || '',
        cls.grade_year || 0,
        cls.subject_id,
        [],
        cls.id
      );
    });
  }

  public async getTeacherSubjectsId(teacherEmail: string): Promise<number[]> {
    const subjectTeacherRecords = await SubjectHasTeacherTable.findAll({
      where: {
        user_email: teacherEmail
      },
      attributes: ['subject_id']
    });

    // Extract de subject_id waardes
    return subjectTeacherRecords.map(record => record.subject_id);
  }

  /**
   * Haalt alle klas-IDs op waar een student in zit
   * @author Rowin Schoon
   * @param studentEmail Email van de student
   * @returns Array van klas-IDs
   */
  public async getStudentClassIds(studentEmail: string): Promise<number[]> {
    try {
      const classHasUsers = await ClassHasUser.findAll({
        where: {
          user_email: studentEmail,
        },
        attributes: ["class_id"],
      });

      return classHasUsers.map((chu) => chu.class_id);
    } catch (error) {
      console.error("Error fetching student class IDs:", error);
      throw new Error("Database query failed.");
    }
  }
}
