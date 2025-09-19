import { UserModel } from "../../Business/Models/UserModel";
import { ClassModel } from "../../Business/Models/ClassModel";

export interface IUserRepository {
  getUserByEmail(email: string): Promise<UserModel | null>;
  getStudentByEmail(email: string): Promise<UserModel | null>;
  getTeacherByEmail(email: string): Promise<UserModel | null>;
  getTeacherClasses(teacherEmail: string): Promise<ClassModel[]>;
  getTeacherSubjectsId(teacherEmail: string): Promise<number[]>;
  getStudentClassIds(studentEmail: string): Promise<number[]>;
}