import { GradeModel } from "../../Business/Models/GradeModel";
import { StudentGradeViewModel } from "../../Business/Models/StudentGradeViewModel";
import { IGradeRepository } from "../Interfaces/IGradeRepository";
import { IUserRepository } from "../Interfaces/IUserRepository";
import { ITestRepository } from "../Interfaces/ITestRepository";
import { IAnswerRepository } from "../Interfaces/IAnswerRepository";
import { ILearningObjectiveRepository } from "../Interfaces/ILearningObjective";
import { UserModel } from "../../Business/Models/UserModel";
import { SubjectModel } from "../../Business/Models/SubjectModel";
import { TestModel } from "../../Business/Models/TestModel"; // Toegevoegd voor typering
import SubjectTable from "../Tables/SubjectTable";

export class GradeRepository implements IGradeRepository {
  private userRepository: IUserRepository;
  private testRepository: ITestRepository;
  private answerRepository: IAnswerRepository;
  private learningObjectiveRepository: ILearningObjectiveRepository;

  constructor(
    userRepository: IUserRepository,
    testRepository: ITestRepository,
    answerRepository: IAnswerRepository,
    learningObjectiveRepository: ILearningObjectiveRepository
  ) {
    this.userRepository = userRepository;
    this.testRepository = testRepository;
    this.answerRepository = answerRepository;
    this.learningObjectiveRepository = learningObjectiveRepository;
  }

  /**
   * Haalt cijfers op voor een specifieke student
   * @param student UserModel van de student
   * @param requestorEmail Email van degene die het verzoek doet (docent of student zelf)
   * @param isTeacher Boolean die aangeeft of de requestor een docent is
   * @returns Array van StudentGradeViewModel objecten met cijfergegevens
   */
  public async getStudentGrades(
    student: UserModel,
    requestorEmail: string,
    isTeacher: boolean
  ): Promise<StudentGradeViewModel[]> {
    try {
      let tests: TestModel[] = [];

      if (isTeacher) {
        // Docent flow: Filter op vakken van die docent
        const teacherSubjectIds =
          await this.userRepository.getTeacherSubjectsId(requestorEmail);

        if (teacherSubjectIds.length === 0) {
          return [];
        }

        tests = await this.testRepository.getTestsBySubjects(teacherSubjectIds);
      } else {
        // Controleer of student zichzelf opvraagt
        if (student.email !== requestorEmail) {
          throw new Error("Students can only view their own grades");
        }

        // Haal de klassen op waar de student in zit
        const studentClasses = await this.userRepository.getStudentClassIds(
          student.email
        );

        // Verzamel tests van alle klassen waar de student in zit
        for (const classId of studentClasses) {
          const classTests = await this.testRepository.getTestsByClassId(
            classId
          );
          tests = tests.concat(classTests);
        }
      }

      if (tests.length === 0) {
        return [];
      }
      // Verzamel alle cijferinformatie
      const gradeViewModels: StudentGradeViewModel[] = [];

      for (const test of tests) {
        try {
          // Bereken het cijfer voor de student
          const grade = await this.calculateGradeForTest(
            student.email,
            test.id
          );

          // Haal de leerdoelen op voor deze test
          const learningObjectives =
            await this.learningObjectiveRepository.getLearningObjectivesForTest(
              test.id
            );

          // Voor docenten controleren we classes, voor studenten slaan we dit over
          let subjectName = "Onbekend vak";

          if (isTeacher) {
            // Controleer of classes beschikbaar is voor docenten
            if (!test.classes || test.classes.length === 0) {
              console.warn(
                `Test ${test.id} heeft geen classes, wordt overgeslagen`
              );
              continue;
            }

            subjectName =
              (test.classes[0] as any).subject?.name ||
              // Als bovenstaande niet werkt, gebruik de vak naam uit een andere bron
              "Onbekend vak";
          } 
          else {
            try {
              const subjectId = grade.subjectId;

              if (subjectId) {
                // Direct query op SubjectTable
                const subject = await SubjectTable.findByPk(subjectId);

                if (subject) {
                  subjectName = subject.name;
                } else {
                  console.warn(`Subject met ID ${subjectId} niet gevonden`);
                }
              }
            } catch (subjectError) {
              console.warn(
                `Kon vaknaam niet ophalen voor subjectId ${grade.subjectId}:`,
                subjectError
              );
            }
          }

          // Maak het view model aan
          const gradeViewModel = new StudentGradeViewModel(
            grade,
            student.firstName,
            student.lastName,
            subjectName,
            learningObjectives
          );

          gradeViewModels.push(gradeViewModel);
        } catch (error) {
          console.error(
            `Error verwerken van test ${test.id} voor student ${student.email}:`,
            error
          );
          // Ga door naar de volgende test in plaats van de functie af te breken
          continue;
        }
      }

      return gradeViewModels;
    } catch (error) {
      console.error("Error fetching grades for student:", error);
      throw new Error("Database query failed.");
    }
  }

  /**
   * Haalt cijfers op voor een specifieke student en vakken van een docent
   * @author Rowin Schoon
   * @param student UserModel van de student
   * @param teacherEmail Email van de docent
   * @returns Array van StudentGradeViewModel objecten met cijfergegevens
   */
  public async getStudentGradesByTeacher(
    student: UserModel,
    teacherEmail: string
  ): Promise<StudentGradeViewModel[]> {
    // Hergebruik de nieuwe generieke methode met isTeacher=true
    return this.getStudentGrades(student, teacherEmail, true);
  }

  /**
   * Berekent een cijfer voor een specifieke toets en student
   * @param studentEmail Email van de student
   * @param testId ID van de toets
   * @returns GradeModel met cijferinformatie
   */
  public async calculateGradeForTest(
    studentEmail: string,
    testId: number
  ): Promise<GradeModel> {
    try {
      // Haal de test op met de bijbehorende vakgegevens
      const test = await this.testRepository.getTestById(testId);

      if (!test) {
        throw new Error(`Test with ID ${testId} not found`);
      }

      // Controleer of classes beschikbaar is
      if (!test.classes || test.classes.length === 0) {
        throw new Error(`Test with ID ${testId} has no classes`);
      }

      const subjectId =
        (test.classes[0] as any).subject?.id || test.classes[0].subjectId;

      const testName = test.name;

      // Haal alle vragen voor deze toets op
      const testQuestions = await this.testRepository.getQuestionsForTest(
        testId
      );

      if (testQuestions.length === 0) {
        return new GradeModel(testId, testName, subjectId, 0, 0, 0, 0);
      }

      const totalQuestions = testQuestions.length;
      const questionIds = testQuestions.map((tq) => tq.question_id);

      // Haal de antwoorden van de student op
      const studentAnswers =
        await this.answerRepository.getStudentAnswersForTest(
          studentEmail,
          testId,
          questionIds
        );

      // Groepeer antwoorden per vraag om aantal pogingen te tellen
      const answersByQuestion = new Map<number, string[]>();

      for (const answer of studentAnswers) {
        if (!answersByQuestion.has(answer.question_id)) {
          answersByQuestion.set(answer.question_id, []);
        }
        answersByQuestion.get(answer.question_id)?.push(answer.answer);
      }

      // Tel het aantal fouten (pogingen tot correcte antwoord, max 4 per vraag)
      let totalErrors = 0;
      let correctQuestionsCount = 0;

      for (const questionId of questionIds) {
        const answers = answersByQuestion.get(questionId) || [];
        let correctAnswerFound = false;
        let attemptsForQuestion = 0;

        // Controleer maximaal 4 pogingen per vraag
        for (let i = 0; i < Math.min(answers.length, 4); i++) {
          attemptsForQuestion++;

          try {
            const isCorrect = await this.answerRepository.isAnswerCorrect(
              questionId,
              answers[i]
            );

            if (isCorrect) {
              correctAnswerFound = true;
              correctQuestionsCount++;
              break;
            }
          } catch (err) {
            console.error(
              `Error checking answer for question ${questionId}:`,
              err
            );
          }
        }

        if (!correctAnswerFound) {
          totalErrors += 4;
        } else {
          totalErrors += attemptsForQuestion - 1;
        }
      }

      // Pas de nieuwe formule toe: (1 - F/(T*4))*100
      const scorePercentage = Math.max(
        0,
        (1 - totalErrors / (totalQuestions * 4)) * 100
      );

      return new GradeModel(
        testId,
        testName,
        subjectId,
        correctQuestionsCount,
        totalQuestions,
        totalErrors,
        scorePercentage
      );
    } catch (error) {
      console.error(`Error calculating grade for test ${testId}:`, error);
      throw error;
    }
  }
}
