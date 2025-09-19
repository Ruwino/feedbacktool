import { IClassRepository } from "../../Data/Interfaces/IClassRepository";
import { ISubjectRepository } from "../../Data/Interfaces/ISubjectRepository";
import { ClassModel } from "../Models/ClassModel";
import { SubjectModel } from "../Models/SubjectModel";
import { SubjectTestModel } from "../Models/SubjectTestModel";

export class SubjectService {
    private _subjectRepository: ISubjectRepository;
    private _classRepository: IClassRepository

    constructor(subjectRepository: ISubjectRepository, classRepository: IClassRepository) {
        this._subjectRepository = subjectRepository;
        this._classRepository = classRepository
    }

    /**
     * @author Luka Piersma
     */
    public async getSubjectsByTeacherEmail(teacherEmail: string): Promise<SubjectModel[]> {
        return await this._subjectRepository.getSubjectsByTeacherEmail(teacherEmail);
    }

    /**
     * @author Stijn Prent
     * @description Fetch subjects
     * @returns Promise<SubjectModel[]>
     */
    public async getAllSubjects(): Promise<SubjectModel[]> {
        return await this._subjectRepository.getAllSubjects();
    }

    /**
     * @author Latricha Seym
     * @description 
     * @returns 
     * 
     */
    public async getSubjectsWithTests(email: string): Promise<SubjectTestModel[]> {
        const classes: ClassModel[] = await this._classRepository.getClassesByEmail(email);
        return await this._subjectRepository.getSubjectsWithTests(classes);
    }
}