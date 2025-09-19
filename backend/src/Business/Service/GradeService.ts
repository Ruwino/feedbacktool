import { StudentGradeViewModel } from "../Models/StudentGradeViewModel";
import { IGradeRepository } from "../../Data/Interfaces/IGradeRepository";
import { IUserRepository } from "../../Data/Interfaces/IUserRepository";
import { ITestRepository } from "../../Data/Interfaces/ITestRepository"; // Toevoegen
import { NotFoundError } from "../../Errors/NotFoundError";
import { IAnswerRepository } from "../../Data/Interfaces/IAnswerRepository";

/**
 * Service voor het verwerken van cijfergegevens
 */
export class GradeService {
  private gradeRepository: IGradeRepository;
  private userRepository: IUserRepository;
  private testRepository: ITestRepository;
  private answerRepository: IAnswerRepository;

  /**
   * Initialiseert een nieuwe instantie van de GradeService
   * @param gradeRepository Repository voor cijfergegevens
   * @param userRepository Repository voor gebruikersgegevens
   * @param testRepository Repository voor toetsgegevens
   */
  constructor(
    gradeRepository: IGradeRepository,
    userRepository: IUserRepository,
    testRepository: ITestRepository,
    answerRepository: IAnswerRepository
  ) {
    this.gradeRepository = gradeRepository;
    this.userRepository = userRepository;
    this.testRepository = testRepository;
    this.answerRepository = answerRepository;
  }

  /**
   * Haalt cijfers op voor een specifieke student, gefilterd op vakken die de docent onderwijst
   * @author Rowin Schoon
   * @param studentEmail Email van de student
   * @param teacherEmail Email van de docent
   * @returns Array van StudentGradeViewModel objecten met cijfergegevens en feedback
   */
  public async getStudentGradesByTeacher(
    studentEmail: string,
    teacherEmail: string
  ): Promise<StudentGradeViewModel[]> {
    // Haal student op om te valideren
    const student = await this.userRepository.getStudentByEmail(studentEmail);

    if (!student) {
      throw new NotFoundError(`Student with email ${studentEmail} not found`);
    }

    return this.gradeRepository.getStudentGradesByTeacher(
      student,
      teacherEmail
    );
  }

  /**
   * Haalt alle cijfers op voor de ingelogde student
   * @author Rowin Schoon
   * @param studentEmail Email van de student
   * @returns Array van cijfergegevens voor de student
   */
  public async getStudentOwnGrades(studentEmail: string): Promise<StudentGradeViewModel[]> {
    try {

      // Check of student bestaat
      const student = await this.userRepository.getStudentByEmail(studentEmail);

      if (!student) {
        throw new NotFoundError(`Student with email ${studentEmail} not found`);
      }

      const grades = await this.gradeRepository.getStudentGrades(
        student,
        studentEmail, // requestor is de student zelf
        false // BELANGRIJK: isTeacher moet FALSE zijn
      );

      return grades;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error in getStudentOwnGrades: ${error.message}`);
      } else {
        console.error(`Error in getStudentOwnGrades: ${JSON.stringify(error)}`);
      }
      throw error;
    }
  }

  /**
   * Haalt de laatste toetsgegevens op voor een lijst van studenten
   * @author Rowin Schoon
   * @param studentEmails Lijst van email adressen van studenten
   * @param teacherEmail Email van de docent
   * @returns Array van objecten met de laatste toetsgegevens per student
   */
  public async getLatestGradesForStudents(
    studentEmails: string[],
    teacherEmail: string
  ): Promise<any[]> {
    // Resultaten voor alle studenten
    const latestGrades = [];

    // Verwerk elke student
    for (const email of studentEmails) {
      try {
        const studentGrade = await this.getLatestGradeForStudent(
          email,
          teacherEmail
        );
        if (studentGrade) {
          latestGrades.push(studentGrade);
        }
      } catch (error) {
        console.log(`Geen cijfers gevonden voor student ${email}`);
        // Ga door naar de volgende student
      }
    }

    return latestGrades;
  }

  private async getLatestGradeForStudent(
    studentEmail: string,
    teacherEmail: string
  ): Promise<StudentGradeViewModel | null> {
    const grades = await this.getStudentGradesByTeacher(
      studentEmail,
      teacherEmail
    );

    if (!grades || grades.length === 0) {
      return null;
    }

    const sortedGrades = this.sortGradesByRecency(grades);

    const latestGrade = sortedGrades[0];

    return this.formatGradeResponse(latestGrade, studentEmail);
  }

  private sortGradesByRecency(
    grades: StudentGradeViewModel[]
  ): StudentGradeViewModel[] {
    return grades.sort((a, b) => b.grade.testId - a.grade.testId);
  }

  private async formatGradeResponse(
    gradeViewModel: StudentGradeViewModel,
    studentEmail: string
  ): Promise<any> {
    const gradeObj = gradeViewModel.toJSON();

    const timestamp = await this.answerRepository.getLatestAnswerTimestamp(
      studentEmail,
      gradeViewModel.grade.testId
    );

    return {
      studentEmail: studentEmail,
      testName: gradeObj.testName,
      subjectName: gradeObj.subjectName,
      scorePercentage: gradeObj.scorePercentage,
      learningObjectives: gradeObj.learningObjectives || [],
      testDate: timestamp, 
    };
  }
}
