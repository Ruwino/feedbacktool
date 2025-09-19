import { GradeModel } from "../../Business/Models/GradeModel";
import { StudentGradeViewModel } from "../../Business/Models/StudentGradeViewModel";
import { UserModel } from "../../Business/Models/UserModel";

export interface IGradeRepository {
    getStudentGradesByTeacher(student: UserModel, teacherEmail: string): Promise<StudentGradeViewModel[]>;
    calculateGradeForTest(studentEmail: string, testId: number): Promise<GradeModel>;
    getStudentGrades(student: UserModel, requestorEmail: string, isTeacher: boolean): Promise<StudentGradeViewModel[]>;
  }