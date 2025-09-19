import {ClassModel} from "../../Business/Models/ClassModel";
import {StudentModel} from "../../Business/Models/StudentModel";

export interface IClassRepository {
    addClass(classData: ClassModel): void;
    getClassesByEmail(email: string): Promise<ClassModel[]>;
    getClassById(id: number): Promise<ClassModel>;
    addStudentsToClass(classId: number, students: StudentModel[]): Promise<void>;
    removeStudentFromClass(classId: number, studentEmail: string): Promise<void>;
}