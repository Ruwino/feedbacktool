import {IStudentRepository} from "../../Data/Interfaces/IStudentRepository";
import {StudentModel} from "../Models/StudentModel";

export class StudentService {
    private studentRepository: IStudentRepository;

    constructor(studentRepository: IStudentRepository) {
      this.studentRepository = studentRepository;
    }

    /**
     * @author Stijn Prent
     * @description Get all students.
     * @returns Promise<StudentModel[]>
     */
    public async getStudents(): Promise<StudentModel[]> {
      return await this.studentRepository.getStudents();
    }

    public async getStudentsByClass(classId: string): Promise<StudentModel[]> {
        return await this.studentRepository.getStudentsByClass(classId);
    }
}