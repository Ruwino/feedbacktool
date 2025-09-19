import {StudentModel} from "../../Business/Models/StudentModel";

/**
 * @author Stijn Prent
 * @description Interface for the StudentRepository class.
 */
export interface IStudentRepository {
    getStudents(): Promise<StudentModel[]>;
    getStudentsByClass(classId: string): Promise<StudentModel[]>;
}