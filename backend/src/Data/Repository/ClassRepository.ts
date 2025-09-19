import { IClassRepository } from "../Interfaces/IClassRepository";
import ClassTable from "../Tables/ClassTable";
import { ClassModel } from "../../Business/Models/ClassModel";
import { Transaction, QueryTypes } from "sequelize";
import { sequelize } from "../../Database/Configuration";
import { StudentModel } from "../../Business/Models/StudentModel";
import UserTable from "../Tables/UserTable";
import UserTypeTable from "../Tables/UserTypeTable";
import { DatabaseError } from "../../Errors/DatabaseError";
import ClassHasUser from "../Tables/ClassHasUser";
import ClassHasTestTable from "../Tables/ClassHasTestTable";
import TestTable from "../Tables/TestTable";

export class ClassRepository implements IClassRepository {
  /**
   * @author Stijn Prent
   * @description Add a class to the database.
   * @param classData
   * @returns Promise<void>
   */
  public async addClass(classData: ClassModel): Promise<void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const newClass = await ClassTable.create(
        {
          name: classData.name,
          grade_year: classData.gradeYear,
          subject_id: classData.subjectId,
        },
        { transaction }
      );

      if (classData.students.length > 0) {
        const studentRelations = classData.students.map((student) => ({
          user_email: student.email,
          class_id: newClass.id,
        }));

        await ClassHasUser.bulkCreate(studentRelations, { transaction });
      }

      const tests = await TestTable.findAll({
        where: {
          subject_id: classData.subjectId
        }
      });

      await ClassHasTestTable.bulkCreate(tests.map(t => ({
        class_id: newClass.id,
        test_id: t.id,
        visible: false
      })), { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error("Error adding class with students:", error);
      throw new Error("Failed to add class with students.");
    }
  }

  /**
   * @description Get all classes from the database.
   * @param sessionId
   * @returns Promise<ClassModel[]>
   */
  public async getClassesByEmail(email: string): Promise<ClassModel[]> {
    try {
      // Haal alle klassen op waar de gebruiker in zit (docent of student)
      const classes = await ClassTable.findAll({
        include: [
          {
            model: UserTable,
            as: "users",
            where: { email: email },
            attributes: [],
            through: { attributes: [] },
          },
        ],
      });

      // Als er geen klassen zijn, return een lege array
      if (classes.length === 0) {
        return [];
      }

      const classIds = classes.map((classItem) => classItem.id);

      // Haal alle studenten op die in deze klassen zitten
      const students = await UserTable.findAll({
        attributes: ["email", "first_name", "last_name"],
        include: [
          {
            model: ClassTable,
            as: "classes",
            attributes: ["id"],
            through: {
              where: { class_id: classIds },
              attributes: [],
            },
          },
          {
            model: UserTypeTable,
            as: "user_type",
            where: { name: "Student" },
            attributes: [],
          },
        ],
      });

      const classMap = new Map<number, StudentModel[]>();

      for (const student of students) {
        for (const classItem of student.classes) {
          const classId = classItem.id;
          if (!classMap.has(classId)) {
            classMap.set(classId, []);
          }

          classMap
            .get(classId)
            ?.push(
              new StudentModel(
                student.email,
                student.first_name,
                student.last_name
              )
            );
        }
      }

      // Bouw de ClassModel objecten
      return classes.map((classItem) => {
        return new ClassModel(
          classItem.name,
          classItem.grade_year,
          classItem.subject_id,
          classMap.get(classItem.id) || [],
          classItem.id
        );
      });
    } catch (error) {
      throw new DatabaseError("Database query failed.");
    }
  }

  public async getClassById(id: number): Promise<ClassModel> {
    try {
      const classData = await ClassTable.findByPk(id, {
        include: [
          {
            model: UserTable,
            through: { attributes: [] },
          },
        ],
      });
      if (!classData) {
        throw new Error("Class not found.");
      }
      const students = classData.users.map(
        (user) => new StudentModel(user.email, user.first_name, user.last_name)
      );
      return new ClassModel(
        classData.name,
        classData.grade_year,
        classData.subject_id,
        students,
        classData.id
      );
    } catch (error) {
      console.error("Error fetching class by id:", error);
      throw new Error("Database query failed.");
    }
  }

  public async addStudentsToClass(classId: number, students: StudentModel[]): Promise<void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const studentRelations = students.map(student => ({
        user_email: student.email,
        class_id: classId
      }));

      await ClassHasUser.bulkCreate(studentRelations, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error("Error adding students to class:", error);
      throw new Error("Failed to add students to class.");
    }
  }

  public async removeStudentFromClass(classId: number, studentEmail: string): Promise<void> {
    try {
      await ClassHasUser.destroy({
        where: {
          class_id: classId,
          user_email: studentEmail
        }
      });
    } catch (error) {
      console.error("Error removing student from class:", error);
      throw new Error("Failed to remove student from class.");
    }
  }
}
