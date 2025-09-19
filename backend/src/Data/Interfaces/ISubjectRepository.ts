import { ClassModel } from "../../Business/Models/ClassModel";
import { SubjectModel } from "../../Business/Models/SubjectModel";
import { SubjectTestModel } from "../../Business/Models/SubjectTestModel";

/**
 * @author Stijn Prent
 * @description Interface for the SubjectRepository class.
 */
export interface ISubjectRepository {
    getAllSubjects(): Promise<SubjectModel[]>;
    getSubjectsByTeacherEmail(teacherEmail: string): Promise<SubjectModel[]>;
    getSubjectsWithTests(classes: ClassModel[]): Promise<SubjectTestModel[]>
    getSubjectByName(name: string): Promise<SubjectModel | null>
}