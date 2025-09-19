import { IClassRepository } from "../../Data/Interfaces/IClassRepository";
import { ClassModel } from "../Models/ClassModel";
import {StudentModel} from "../Models/StudentModel";

export class ClassService {
    private classRepository: IClassRepository;

    constructor(classRepository: IClassRepository) {
        this.classRepository = classRepository;
    }

    public async addClass(classData: ClassModel, teacher: string): Promise<void> {
        classData.students.push(new StudentModel(teacher, "", ""));
        return this.classRepository.addClass(classData);
    }

    public async getClasses(email: string): Promise<ClassModel[]> {
        return await this.classRepository.getClassesByEmail(email);
    }

    public async getClassById(id: number): Promise<ClassModel> {
        return this.classRepository.getClassById(id);
    }

    public async addStudentsToClass(classId: number, students: StudentModel[]): Promise<void> {
        return this.classRepository.addStudentsToClass(classId, students);
    }

    public async removeStudentFromClass(classId: number, studentEmail: string): Promise<void> {
        return this.classRepository.removeStudentFromClass(classId, studentEmail);
    }
}