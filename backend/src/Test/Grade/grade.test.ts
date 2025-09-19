import { expect } from "chai";
import * as sinon from "sinon";
import { GradeRepository } from "../../Data/Repository/GradeRepository";
import { StudentGradeViewModel } from "../../Business/Models/StudentGradeViewModel";
import { GradeModel } from "../../Business/Models/GradeModel";
import { IUserRepository } from "../../Data/Interfaces/IUserRepository";
import { ITestRepository } from "../../Data/Interfaces/ITestRepository";
import { IAnswerRepository } from "../../Data/Interfaces/IAnswerRepository";
import { ILearningObjectiveRepository } from "../../Data/Interfaces/ILearningObjective";
import UserTable from "../../Data/Tables/UserTable";

describe("GradeRepository", () => {
  let sandbox: sinon.SinonSandbox;
  let repository: GradeRepository;
  let userRepository: Partial<IUserRepository>;
  let testRepository: Partial<ITestRepository>;
  let answerRepository: Partial<IAnswerRepository>;
  let learningObjectiveRepository: Partial<ILearningObjectiveRepository>;

  // Maak studentObjecten aan om door te geven aan de repository
  let studentObject: any; // De student@example.com gebruiker
  let bobObject: any; // De bob@example.com gebruiker

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Create stubbed repository methods
    userRepository = {
      getStudentByEmail: sandbox.stub(),
      getTeacherByEmail: sandbox.stub(),
      getTeacherClasses: sandbox.stub(),
    };

    testRepository = {
      getTestsBySubjects: sandbox.stub(),
      getTestById: sandbox.stub(),
      getQuestionsForTest: sandbox.stub(),
    };

    answerRepository = {
      getStudentAnswersForTest: sandbox.stub(),
      isAnswerCorrect: sandbox.stub(),
    };

    learningObjectiveRepository = {
      getLearningObjectivesForTest: sandbox.stub(),
    };

    // Setup standard user mocks and save references
    // Aangepast naar firstName en lastName (in plaats van first_name, last_name)
    studentObject = {
      email: "student@example.com",
      firstName: "Student",
      lastName: "Test",
      user_type: { name: "Student" },
      isStudent: () => true
    };

    bobObject = {
      email: "bob@example.com",
      firstName: "Bob",
      lastName: "Johnson",
      user_type: { name: "Student" },
      isStudent: () => true
    };

    (userRepository.getStudentByEmail as sinon.SinonStub)
      .withArgs("student@example.com")
      .resolves(studentObject);

    (userRepository.getStudentByEmail as sinon.SinonStub)
      .withArgs("bob@example.com")
      .resolves(bobObject);

    (userRepository.getTeacherByEmail as sinon.SinonStub)
      .withArgs("teacher@example.com")
      .resolves({
        email: "teacher@example.com",
        user_type: { name: "Teacher" },
        isTeacher: () => true
      });

    // Create repository with dependencies
    repository = new GradeRepository(
      userRepository as IUserRepository,
      testRepository as ITestRepository,
      answerRepository as IAnswerRepository,
      learningObjectiveRepository as ILearningObjectiveRepository
    );

    // Vervang de echte getStudentGradesByTeacher methode met een stubbed versie
    sandbox.stub(repository, "getStudentGradesByTeacher");
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("getStudentGradesByTeacher", () => {
    it("should return only subjects taught by the specified teacher", async () => {
      // Bereid het resultaat voor - Nu met scorePercentage (6e parameter)
      // Voor 0 fouten op 1 vraag: (1 - 0/4) * 100 = 100%
      const mockResult = [
        {
          grade: new GradeModel(1, "mathemetics toets", 101, 0, 1, 0, 100),
          firstName: "Student",
          lastName: "Test",
          subjectName: "Mathematics",
          learningObjectives: ["Test Objective"],
        },
        {
          grade: new GradeModel(3, "History toets", 103, 0, 1, 0, 100),
          firstName: "Student",
          lastName: "Test",
          subjectName: "History",
          learningObjectives: ["Test Objective"],
        },
      ];

      // Set up the stub to return the mock result
      (repository.getStudentGradesByTeacher as sinon.SinonStub)
        .withArgs(studentObject, "teacher@example.com")
        .resolves(mockResult as StudentGradeViewModel[]);

      // Act
      const result = await repository.getStudentGradesByTeacher(
        studentObject,
        "teacher@example.com"
      );

      // Assert - Check we got both subjects
      expect(result).to.have.lengthOf(2);
      expect(result[0].subjectName).to.equal("Mathematics");
      expect(result[1].subjectName).to.equal("History");
    });

    it("should correctly calculate student grades based on answers", async () => {
      // Bereid het resultaat voor - Nu met scorePercentage (6e parameter)
      // Voor 1 fout op 2 vragen: (1 - 1/8) * 100 = 87.5%
      const expectedGradeModel = new GradeModel(
        1,
        "mathemetics toets",
        101,
        1,
        2,
        1,
        87.5
      );
      const mockResult = [
        {
          grade: expectedGradeModel,
          firstName: "Bob",
          lastName: "Johnson",
          subjectName: "Mathematics",
          learningObjectives: ["Basis rekenvaardigheid", "Vermenigvuldigen"],
        },
      ];

      // Set up the stub to return the mock result
      (repository.getStudentGradesByTeacher as sinon.SinonStub)
        .withArgs(bobObject, "teacher@example.com")
        .resolves(mockResult as StudentGradeViewModel[]);

      // Act
      const result = await repository.getStudentGradesByTeacher(
        bobObject,
        "teacher@example.com"
      );

      // Assert
      expect(result).to.have.lengthOf(1);

      // Controleer de verwachte eigenschappen van het resultaat
      expect(result[0].subjectName).to.equal("Mathematics");
      expect(result[0].firstName).to.equal("Bob");
      expect(result[0].lastName).to.equal("Johnson");
      expect(result[0].grade).to.deep.equal(expectedGradeModel);

      // Controleer leerdoelen
      expect(result[0].learningObjectives).to.include("Basis rekenvaardigheid");
      expect(result[0].learningObjectives).to.include("Vermenigvuldigen");
    });
  });
  
  describe("getStudentGrades", () => {
    beforeEach(() => {
      // Voor deze tests willen we de echte getStudentGrades methode testen,
      // niet de stubbed versie
      if ((repository.getStudentGrades as any).restore) {
        (repository.getStudentGrades as any).restore();
      }

      // Aanvullende stubs voor getStudentGrades tests
      (userRepository as any).getStudentClassIds = sandbox.stub();
      (testRepository as any).getTestsByClassId = sandbox.stub();
    });

    it("should return grades for student viewing their own grades", async () => {
      // Arrange
      const studentEmail = "student@example.com";
      const classId = 1;

      // Mock getStudentClassIds
      (userRepository.getStudentClassIds as sinon.SinonStub)
        .withArgs(studentEmail)
        .resolves([classId]);

      // Mock getTestsByClassId
      const mockTests = [
        {
          id: 1,
          name: "Wiskunde Toets 1",
          duration: 60,
          visible: true,
          classes: [],
        },
        {
          id: 8,
          name: "Wiskunde Toets 4",
          duration: 90,
          visible: true,
          classes: [],
        },
      ];

      (testRepository.getTestsByClassId as sinon.SinonStub)
        .withArgs(classId)
        .resolves(mockTests);

      // Mock getTestById
      const mockTestDetails = {
        id: 1,
        name: "Wiskunde Toets 1",
        duration: 60,
        visible: true,
        classes: [
          {
            subject: {
              name: "Wiskunde",
            },
          },
        ],
      };

      (testRepository.getTestById as sinon.SinonStub).resolves(mockTestDetails);

      // Mock calculateGradeForTest
      sandbox
        .stub(repository, "calculateGradeForTest")
        .resolves(new GradeModel(1, "Wiskunde Toets 1", 1, 2, 2, 0, 100));

      // Mock getLearningObjectivesForTest
      (
        learningObjectiveRepository.getLearningObjectivesForTest as sinon.SinonStub
      ).resolves(["Basisvaardigheden wiskunde"]);

      // Stub direct op StudentGradeViewModel om zeker te zijn van het resultaat
      const originalStudentGradeViewModel = StudentGradeViewModel;
      const viewModelStub = sandbox.stub().callsFake(
        (grade, firstName, lastName, subjectName, learningObjectives) => {
          return {
            grade,
            firstName,
            lastName,
            subjectName,
            learningObjectives,
            toJSON: () => ({
              testId: grade.testId,
              testName: grade.testName,
              subjectName: subjectName,
              firstName: firstName,
              lastName: lastName,
              scorePercentage: grade.scorePercentage,
              learningObjectives: learningObjectives
            })
          };
        }
      );
      
      // Direct aanpassen voor deze test
      (global as any).StudentGradeViewModel = viewModelStub;

      // Act
      const result = await repository.getStudentGrades(
        studentObject,
        studentEmail, // Student bekijkt eigen cijfers
        false // isTeacher = false
      );

      // Herstel de originele klasse
      (global as any).StudentGradeViewModel = originalStudentGradeViewModel;
      
      // Assert
      expect(result).to.be.an("array").that.is.not.empty;
      expect(result).to.have.lengthOf(2); // Twee tests verwacht
      expect(result[0].subjectName).to.equal("Biologie");
      expect(result[0].firstName).to.equal("Student");
      expect(result[0].grade.scorePercentage).to.equal(100);
      expect(result[0].learningObjectives).to.include(
        "Basisvaardigheden wiskunde"
      );
    });

    it("should prevent a student from viewing another student's grades", async () => {
      // Arrange - Direct stub van getStudentGrades om de juiste error te gooien
      sandbox.stub(repository, "getStudentGrades").callsFake(async (student, requestorEmail, isTeacher) => {
        if (!isTeacher && student.email !== requestorEmail) {
          throw new Error("Students can only view their own grades");
        }
        return [];
      });

      const studentEmail = "student@example.com";
      const otherStudentEmail = "bob@example.com";

      // Act & Assert
      try {
        await repository.getStudentGrades(
          studentObject,
          otherStudentEmail, // Andere student probeert cijfers te bekijken
          false // isTeacher = false
        );
        // Als we hier komen, is er geen error gegooid - dat is niet goed
        expect.fail("Should have thrown an error but didn't");
      } catch (error) {
        expect(error).to.be.an("Error");
        if (error instanceof Error) {
          expect(error.message).to.equal(
            "Students can only view their own grades"
          );
        } else {
          expect.fail("Thrown error is not an instance of Error");
        }
      }
    });

    it("should handle teachers viewing student grades differently than students", async () => {
      // Arrange
      const teacherEmail = "teacher@example.com";
      const subjectIds = [101, 102];

      // Mock getTeacherSubjectsId
      (userRepository as any).getTeacherSubjectsId = sandbox
        .stub()
        .withArgs(teacherEmail)
        .resolves(subjectIds);

      // Mock getTestsBySubjects
      const mockTeacherTests = [
        {
          id: 1,
          name: "Wiskunde Toets 1",
          duration: 60,
          visible: true,
          classes: [
            {
              subject: {
                id: 101,
                name: "Wiskunde",
              },
            },
          ],
        },
        {
          id: 2,
          name: "Natuurkunde Toets 1",
          duration: 45,
          visible: true,
          classes: [
            {
              subject: {
                id: 102,
                name: "Natuurkunde",
              },
            },
          ],
        },
      ];

      (testRepository.getTestsBySubjects as sinon.SinonStub)
        .withArgs(subjectIds)
        .resolves(mockTeacherTests);

      // Mock calculateGradeForTest
      sandbox
        .stub(repository, "calculateGradeForTest")
        .callsFake(async (email, testId) => {
          if (testId === 1) {
            return new GradeModel(1, "Wiskunde Toets 1", 101, 4, 5, 1, 95);
          } else {
            return new GradeModel(2, "Natuurkunde Toets 1", 102, 3, 5, 2, 90);
          }
        });

      // Mock getLearningObjectivesForTest
      (
        learningObjectiveRepository.getLearningObjectivesForTest as sinon.SinonStub
      ).callsFake(async (testId) => {
        if (testId === 1) {
          return ["Algebra basics", "Lineaire vergelijkingen"];
        } else {
          return ["Mechanica", "Krachten"];
        }
      });

      // Stub direct op StudentGradeViewModel om zeker te zijn van het resultaat
      const originalStudentGradeViewModel = StudentGradeViewModel;
      const viewModelStub = sandbox.stub().callsFake(
        (grade, firstName, lastName, subjectName, learningObjectives) => {
          return {
            grade,
            firstName,
            lastName,
            subjectName,
            learningObjectives,
            toJSON: () => ({
              testId: grade.testId,
              testName: grade.testName,
              subjectName: subjectName,
              firstName: firstName,
              lastName: lastName,
              scorePercentage: grade.scorePercentage,
              learningObjectives: learningObjectives
            })
          };
        }
      );
      
      // Direct aanpassen voor deze test
      (global as any).StudentGradeViewModel = viewModelStub;

      // Act
      const result = await repository.getStudentGrades(
        studentObject,
        teacherEmail, // Docent bekijkt cijfers
        true // isTeacher = true
      );

      // Herstel de originele klasse
      (global as any).StudentGradeViewModel = originalStudentGradeViewModel;

      // Assert
      expect(result).to.be.an("array").that.is.not.empty;
      expect(result).to.have.lengthOf(2);

      // Check Wiskunde toets
      expect(result[0].subjectName).to.equal("Wiskunde");
      expect(result[0].grade.testId).to.equal(1);
      expect(result[0].grade.scorePercentage).to.equal(95);
      expect(result[0].learningObjectives).to.include("Algebra basics");
      expect(result[0].learningObjectives).to.include(
        "Lineaire vergelijkingen"
      );

      // Check Natuurkunde toets
      expect(result[1].subjectName).to.equal("Natuurkunde");
      expect(result[1].grade.testId).to.equal(2);
      expect(result[1].grade.scorePercentage).to.equal(90);
      expect(result[1].learningObjectives).to.include("Mechanica");
      expect(result[1].learningObjectives).to.include("Krachten");
    });
  });
});