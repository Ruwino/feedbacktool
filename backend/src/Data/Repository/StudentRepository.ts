import { IStudentRepository } from "../Interfaces/IStudentRepository";
import { StudentModel } from "../../Business/Models/StudentModel";
import UserTable from "../Tables/UserTable";
import UserTypeTable from "../Tables/UserTypeTable";
import ClassHasUser from "../Tables/ClassHasUser";
import ClassTable from "../Tables/ClassTable";

export class StudentRepository implements IStudentRepository {
    /**
     * @description Fetch students
     * @returns Promise<StudentModel[]>
     */
    public async getStudents(): Promise<StudentModel[]> {
        try {
            const users = await UserTable.findAll({
                include: [
                    {
                        model: UserTypeTable,
                        as: "user_type",
                        where: { name: "Student" },
                    }
                ]
            });

      return users.map(
        (user) => new StudentModel(user.email, user.first_name, user.last_name)
      );
    } catch (error) {
      console.error("Error fetching students:", error);
      throw new Error("Database query failed.");
    }
  }

  public async getStudentsByClass(classId: string): Promise<StudentModel[]> {
    try {
      const users = await UserTable.findAll({
        include: [
          {
            model: UserTypeTable,
            as: "user_type",
            where: { name: "Student" }, // Alleen gebruikers die studenten zijn
          },
          {
            model: ClassHasUser,
            as: "user_classes", // Gebruik de juiste alias
            where: { class_id: classId }, // Alleen gebruikers die in de opgegeven klas zitten
            include: [
              {
                model: ClassTable,
                as: "class",
              },
            ],
          },
        ],
      });
      return users.map(
        (user) => new StudentModel(user.email, user.first_name, user.last_name)
      );
    } catch (error) {
      console.error("Error fetching students:", error);
      throw new Error("Database query failed.");
    }
  }
}
