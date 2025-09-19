import { Op, Transaction } from "sequelize";
import { DatabaseError } from "../../Errors/DatabaseError";
import { ITestRepository } from "../Interfaces/ITestRepository";

import QuestionTable from "../Tables/QuestionTable";
import TestHasQuestionTable from "../Tables/TestHasQuestionTable";
import { TestQuestionModel } from "../../Business/Models/TestQuestionModel";
import ClassTable from "../Tables/ClassTable";
import TestTable from "../Tables/TestTable";
import ClassHasUser from "../Tables/ClassHasUser";
import { AnswerTestQuestionModel } from "../../Business/Models/AnswerTestQuestionModel";
import UserAnsweredQuestionTable from "../Tables/UserAnsweredQuestionTable";
import { AnswerResultModel } from "../../Business/Models/AnswerResultModel";
import AnswerTable from "../Tables/AnswerTable";
import QuestionTypeTable from "../Tables/QuestionTypeTable";
import LearningObjectiveTable from "../Tables/LearningObjectiveTable";
import { sequelize } from "../../Database/Configuration";
import SubjectTable from "../Tables/SubjectTable";
import { TestModel } from "../../Business/Models/TestModel";
import { ClassModel } from "../../Business/Models/ClassModel";
import { SubjectModel } from "../../Business/Models/SubjectModel";
import { UserTestModel } from "../../Business/Models/UserTestModel";
import { TeacherTestModel } from "../../Business/Models/TeacherTestModel";
import HintTable from "../Tables/HintTable";
import ClassHasTestTable from "../Tables/ClassHasTestTable";
import { SubjectType } from "../../Enums/SubjectType";
import { TeacherQuestionModel } from "../../Business/Models/TeacherQuestionModel";
import { QuestionType } from "../../Enums/QuestionType";
import { TeacherAnswerModel } from "../../Business/Models/TeacherAnswerModel";
import { ISubjectRepository } from "../Interfaces/ISubjectRepository";
import UserTable from "../Tables/UserTable";
import UserTypeTable from "../Tables/UserTypeTable";
import { TeacherObjectiveModel } from "../../Business/Models/TeacherObjectiveModel";
import { QuestionRepository } from "./QuestionRepository";
import { LearningObjectiveRepository } from "./LearningObjectiveRepository";
import { TeacherHintModel } from "../../Business/Models/TeacherHintModel";

export class TestRepository implements ITestRepository {
  private subjectRepository: ISubjectRepository;
  private questionRepository: QuestionRepository;
  private learningObjectiveRepository: LearningObjectiveRepository;

  constructor(subjectRepository: ISubjectRepository, questionRepository: QuestionRepository, learningObjectiveRepository: LearningObjectiveRepository) {
    this.subjectRepository = subjectRepository;
    this.questionRepository = questionRepository;
    this.learningObjectiveRepository = learningObjectiveRepository;
  }

  /**
  * @author Luka Piersma
  */
  private async upsertTestTable(testModel: TeacherTestModel, transaction: Transaction): Promise<TestTable> {
    const subject = await this.subjectRepository.getSubjectByName(testModel.subject);

    if (!subject) throw new Error('Subject not found');

    const [test] = await TestTable.upsert({
      id: testModel.id,
      name: testModel.name,
      subject_id: subject.id,
      duration: testModel.duration,
      randomized: testModel.randomized,
      creator_email: testModel.creatorEmail
    });

    const learningObjectives = [];

    for (const o of testModel.learningObjectives) {
      const learningObjective = await this.learningObjectiveRepository.upsertLearningObjectiveTable(o, transaction);

      learningObjectives.push(learningObjective);
    }

    learningObjectives.sort((a, b) => a.id - b.id);

    const questions = [];

    for (const q of testModel.questions) {
      const question = await this.questionRepository.upsertQuestionTable(q, transaction);

      await question.$set('objectives', learningObjectives[q.learningObjectiveIndex], { transaction });

      questions.push(question);
    }

    await test.$set('questions', questions, { transaction });

    const existingLinks = await ClassHasTestTable.findAll({
      where: { test_id: test.id },
      include: [{ model: ClassTable }],
      transaction: transaction
    });

    for (const link of existingLinks) {
      if (link.class.subject_id !== test.subject_id) {
        await link.destroy({ transaction });
      }
    }

    const validClasses = await ClassTable.findAll({
      where: { subject_id: test.subject_id },
      transaction
    });

    const existingClassIds = existingLinks
      .filter(link => link.class.subject_id === test.subject_id)
      .map(link => link.class_id);

    const newClasses = validClasses.filter(c => !existingClassIds.includes(c.id));

    for (const c of newClasses) {
      await ClassHasTestTable.create({ class_id: c.id, test_id: test.id, visible: false }, { transaction });
    }

    return test;
  }

  /**
  * @author Luka Piersma
  */
  public async updateTest(testModel: TeacherTestModel): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      await this.upsertTestTable(testModel, transaction);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();

      throw new DatabaseError('Something went wrong while updating the test.');
    }
  }

  /**
  * @author Luka Piersma
  */

  public async getTest(testId: number): Promise<TeacherTestModel | null> {
    const test = await TestTable.findByPk(testId, {
      include: [
        {
          model: SubjectTable,
          attributes: ['name']
        },
        {
          model: QuestionTable,
          include: [
            {
              model: AnswerTable
            },
            {
              model: HintTable
            },
            {
              model: LearningObjectiveTable,
              through: { attributes: [] }
            },
            {
              model: QuestionTypeTable,
              attributes: ['question_type']
            }
          ]
        },
        {
          model: UserTable,
          include: [
            {
              model: UserTypeTable
            }
          ]
        }
      ]
    });

    if (!test) {
      return null;
    }

    const learningObjectives: TeacherObjectiveModel[] = [];

    for (const q of test.questions) {
      const { id, description } = q.objectives[0];
      
      if (!learningObjectives.some(o => o.id === id)) {
        learningObjectives.push(new TeacherObjectiveModel(id, description));
      }
    }


    const questions = test.questions.map((q) => {
      const answers = q.answers.map(a => new TeacherAnswerModel(a.id, a.answer, a.correct));
      const hints = q.hints.map(h => new TeacherHintModel(h.id, h.hint));
      const learningObjectiveIndex = learningObjectives.findIndex(o => o.id === q.objectives[0].id);

      return new TeacherQuestionModel(
        q.id,
        q.question_type.question_type as QuestionType,
        q.question,
        learningObjectiveIndex,
        answers,
        hints
      );
    });

    const testModel = new TeacherTestModel(
      test.id,
      test.name,
      test.subject.name as SubjectType,
      test.duration,
      test.randomized,
      learningObjectives,
      questions,
      test.creator_email
    );

    return testModel;
  }

  /**
  * @author Luka Piersma
  */

  public async createTest(testModel: TeacherTestModel): Promise<TeacherTestModel> {
    const transaction = await sequelize.transaction();

    try {
      const test = await this.upsertTestTable(testModel, transaction);

      transaction.commit();

      testModel.id = test.id;

      return testModel;
    } catch (error: unknown) {
      await transaction.rollback();

      throw new DatabaseError('Something went wrong while creating a test.');
    }
  }


  /**
   * Controleert of gebruiker toegang heeft tot een test
   * @param email Email van de gebruiker
   * @param testId ID van de test
   * @returns Boolean die aangeeft of de gebruiker toegang heeft
   */
  public async hasAccessToTest(
    email: string,
    testId: number
  ): Promise<boolean> {
    try {
      const userClassesWithTest = await ClassHasUser.findAll({
        where: { user_email: email },
        include: [
          {
            model: ClassTable,
            include: [
              {
                model: TestTable,
                where: { id: testId },
              },
            ],
          },
        ],
      });

      if (userClassesWithTest.length === 0) {
        return false;
      }

      return true;
    } catch (error) {
      throw new DatabaseError("Error checking user access to the test");
    }
  }

  /**
   * Controleert of gebruiker toegang heeft tot een specifieke test-vraag
   * @param email Email van de gebruiker
   * @param answerModel Model met vraag- en testgegevens
   * @returns Boolean die aangeeft of de gebruiker toegang heeft
   */
  public async hasAccessToTestQuestion(
    email: string,
    answerModel: AnswerTestQuestionModel
  ): Promise<boolean> {
    try {
      // Check if the user is enrolled in the class and the test includes the specific question
      const userClassWithTestQuestion = await ClassHasUser.findAll({
        where: { user_email: email },
        include: [
          {
            model: ClassTable,
            include: [
              {
                model: TestTable,
                where: { id: answerModel.testId },
                include: [
                  {
                    model: QuestionTable,
                    where: { id: answerModel.questionId },
                  },
                ],
              },
            ],
          },
        ],
      });

      if (userClassWithTestQuestion.length === 0) {
        return false;
      }

      return true;
    } catch (error) {
      throw new DatabaseError("Error checking user access to the test");
    }
  }

  /**
   * Haalt antwoord op van een gebruiker op een specifieke vraag
   * @param email Email van de gebruiker
   * @param answerModel Model met vraag- en testgegevens
   * @returns Het UserAnsweredQuestionTable object of null als niet gevonden
   */
  private async getUserAnsweredQuestion(
    email: string,
    answerModel: AnswerTestQuestionModel
  ): Promise<UserAnsweredQuestionTable | null> {
    try {
      const userAnsweredQuestion = await UserAnsweredQuestionTable.findOne({
        where: {
          user_email: email,
          question_id: answerModel.questionId,
          test_id: answerModel.testId,
          answer: answerModel.answer,
        },
        include: {
          model: QuestionTable,
          include: [AnswerTable],
        },
      });

      return userAnsweredQuestion;
    } catch (error: unknown) {
      throw new DatabaseError(
        "Error checking if user has answered test question with same answer before"
      );
    }
  }

  /**
   * Verwerkt een antwoord van een gebruiker op een test-vraag
   * @param email Email van de gebruiker
   * @param answerModel Model met vraag- en antwoordgegevens
   * @returns AnswerResultModel met informatie over het resultaat
   */
  public async answerTestQuestion(
    email: string,
    answerModel: AnswerTestQuestionModel
  ): Promise<AnswerResultModel> {
    const transaction = await sequelize.transaction();

    try {
      let userAnsweredQuestion: UserAnsweredQuestionTable | null =
        await this.getUserAnsweredQuestion(email, answerModel);

      if (userAnsweredQuestion === null) {
        userAnsweredQuestion = await UserAnsweredQuestionTable.create(
          {
            user_email: email,
            question_id: answerModel.questionId,
            test_id: answerModel.testId,
            answer: answerModel.answer,
            timestamp: new Date(),
          },
          { transaction }
        );
      }

      let answerResultModel: AnswerResultModel;

      if (await userAnsweredQuestion.isCorrect()) {
        answerResultModel = new AnswerResultModel(true);
      } else {
        answerResultModel = new AnswerResultModel(
          false,
          await userAnsweredQuestion.getCurrentHint()
        );
      }

      await transaction.commit();

      return answerResultModel;
    } catch (error: unknown) {
      await transaction.rollback();
      throw new DatabaseError("Error while answering test question");
    }
  }

  /**
   * Haalt alle nog niet correct beantwoorde vragen op voor een gebruiker voor een test
   * @param email Email van de gebruiker
   * @param testId ID van de test
   * @returns Array van TestQuestionModel objecten
   */
  public async getTestQuestions(
    email: string,
    testId: number
  ): Promise<TestQuestionModel[]> {
    try {
      // Get all questions for the test.
      const testQuestions = await TestHasQuestionTable.findAll({
        where: {
          test_id: testId
        }
      });

      // Get ID for each question
      const questionIds = testQuestions.map((q) => q.question_id);

      // Retreiving the actual question data.
      const questions = await QuestionTable.findAll({
        where: { id: { [Op.in]: questionIds } },
        include: [
          { model: QuestionTypeTable, as: "question_type" },
          { model: AnswerTable, as: "answers" },
          { model: LearningObjectiveTable, as: "objectives" },
        ]
      });

      // Map to the appropriate format (QuestionTestModel)
      return questions.map((q) => q.toTestQuestionModel());
    } catch (error: any) {

      throw new DatabaseError(
        "Something went wrong while trying to get questions by test ID"
      );
    }
  }

  /**
   * @author Roan Slingerland
   */
  public async getQuestionAmount(testId: number): Promise<number> {
    try {
      return await UserAnsweredQuestionTable.count({
        where: {
          test_id: testId
        },
        distinct: true,
        col: "question_id"
      });
    } catch (error) {
      throw new DatabaseError("Something went wrong while fetching questions.");
    }
  }

  /**
   * @author Roan Slingerland
   */
  public async getAmountOfAnswers(email: string, testId: number): Promise<number> {
    try {
      return await UserAnsweredQuestionTable.count({
        where: {
          user_email: email,
          test_id: testId
        },
        distinct: true,
        col: 'question_id'
      });
    } catch (error) {
      throw new DatabaseError("Something went wrong while fetching answered questions.");
    }
  }

  /**
   * @author Roan Slingerland
   */
  public async getAmountOfCorrectAnswers(email: string, testId: number): Promise<number> {
    try {
      const userAnswers = await UserAnsweredQuestionTable.findAll({
        where: {
          user_email: email,
          test_id: testId,
        },
        attributes: ['question_id', 'answer'],
      });

      const questionIds = userAnswers.map(userAnswer => userAnswer.question_id);

      const correctAnswers = await AnswerTable.findAll({
        where: {
          correct: true,
        },
        include: [{
          model: QuestionTable,
          where: {
            id: questionIds
          },
          through: { attributes: [] }
        }]
      });

      const correctAnswerMap = new Map();

      correctAnswers.forEach(answer => {
        answer.questions.forEach(question => {
          correctAnswerMap.set(question.id, answer.answer.trim().toLowerCase());
        });
      });

      const correctCount: number = userAnswers.filter(userAnswer => {
        const correct = correctAnswerMap.get(userAnswer.question_id);
        return correct && correct === userAnswer.answer.trim().toLowerCase();
      }).length;

      return correctCount;
    } catch (error) {
      throw new DatabaseError("Something went wrong while fetching correctly answered questions.");
    }
  }

  /**
   * Haalt toetsen op die bij specifieke vakken horen
   * @param subjectIds Array van vak-IDs
   * @returns Array van TestTable objecten met vak-informatie
   */
  public async getTestsBySubjects(subjectIds: number[]): Promise<TestModel[]> {
    try {
      // Inclusief de join met SubjectTable
      const tests = await TestTable.findAll({
        attributes: ["id", "name", "duration"],
        include: [
          {
            model: ClassTable,
            as: "classes",
            where: {
              subject_id: {
                [Op.in]: subjectIds,
              },
            },
            include: [{ model: SubjectTable, as: "subject" }],
          },
        ],
      });
      const visibleStatuses = await Promise.all(tests.map(async (test) => {
        const result = await ClassHasTestTable.findOne({
          where: {
            test_id: test.id
          },
          attributes: ['visible']
        });
        return {
          testId: test.id,
          visible: result ? result.visible : null
        };
      }));

      return tests.map((test) => {
        const classes = test.classes.map((cls) => {
          // Hier zit de fix: Maak expliciet een SubjectModel aan
          const subject = new SubjectModel(cls.subject.id, cls.subject.name);

          // Creëer een aangepaste ClassModel die ook subject info bevat
          const classModel = new ClassModel(
            cls.name || "",
            cls.grade_year || 0,
            cls.subject_id,
            [],
            cls.id
          );

          // Voeg subject toe aan de class als extra property
          (classModel as any).subject = subject;

          return classModel;
        });

        return new TestModel(
          test.id,
          test.name,
          test.duration,
          visibleStatuses.find(v => v.testId === test.id)?.visible || false,
          classes
        );
      });
    } catch (error) {
      console.error("Error fetching tests by subjects:", error);
      throw new DatabaseError(
        "Something went wrong while trying to get tests by subject IDs"
      );
    }
  }
  /**
   * Haalt een specifieke toets op met vakgegevens
   * @param testId ID van de toets
   * @returns TestTable object met vak-informatie
   */
  public async getTestById(testId: number): Promise<TestModel | null> {
    try {
      const test = await TestTable.findOne({
        where: { id: testId },
        include: [
          {
            model: ClassTable,
            as: "classes",
            include: [{ model: SubjectTable, as: "subject" }],
          },
        ],
      });

      // Als test niet gevonden is
      if (!test) {
        return null;
      }

      // Converteer database entities naar domeinmodellen
      const classes =
        test.classes?.map((cls) => {
          // Converteer subject naar SubjectModel

          // Creëer ClassModel
          return new ClassModel(
            cls.name || "",
            cls.grade_year || 0,
            cls.subject_id,
            [], // Lege studenten array
            cls.id
          );
        }) || [];

      const visible = await ClassHasTestTable.findOne({
        where: {
          test_id: test.id
        },
        attributes: ['visible']
      });

      // Creëer TestModel met alle data
      return new TestModel(
        test.id,
        test.name,
        test.duration,
        visible ? visible.visible : false,
        classes
      );
    } catch (error) {
      console.error("Error fetching test by ID:", error);
      throw new DatabaseError(
        `Something went wrong while trying to get test with ID ${testId}`
      );
    }
  }

  /**
   * Haalt vragen op voor een specifieke toets
   * @param testId ID van de toets
   * @returns Array van TestHasQuestionTable objecten
   */
  public async getQuestionsForTest(testId: number): Promise<any[]> {
    try {
      return await TestHasQuestionTable.findAll({
        where: { test_id: testId },
      });
    } catch (error) {
      console.error("Error fetching questions for test:", error);
      throw new DatabaseError(
        `Something went wrong while trying to get questions for test with ID ${testId}`
      );
    }
  }

  public async deleteUserAnswers(email: string, testId: number): Promise<void> {
    try {
      await UserAnsweredQuestionTable.destroy({
        where: {
          user_email: email,
          test_id: testId
        }
      });

    } catch (error) {
      throw new DatabaseError("Something went wrong while deleting user answers.");
    }
  }
  /**
   * @author Roan Slingerland
   */
  public async getTestDataById(testId: number): Promise<UserTestModel> {
    try {
      const test = await TestTable.findOne({
        attributes: ['name'],
        where: { id: testId },
      });

      if (!test) {
        throw new Error(`Test with ID ${testId} not found`);
      }

      const questions = await QuestionTable.findAll({
        include: [
          {
            model: TestTable,
            where: { id: testId },
            through: { attributes: [] },
          },
        ],
      });

      const questionIds = questions.map((q) => q.id);

      const learningObjectives = await LearningObjectiveTable.findAll({
        include: [
          {
            model: QuestionTable,
            where: { id: questionIds },
            through: { attributes: [] },
          },
        ],
      });


      const uniqueDescriptions: string[] = [];
      const uniqueObjectiveIds = new Set<number>;

      for (const object of learningObjectives) {
        if (!uniqueObjectiveIds.has(object.id)) {
          uniqueObjectiveIds.add(object.id);
          uniqueDescriptions.push(object.description);
        }
      };

      return new UserTestModel(
        test.name,
        uniqueDescriptions
      );
    } catch (error) {
      throw new DatabaseError("Something went wrong while retreiving test data.");
    }
  }

  /**
   * Haalt alle toetsen op voor een specifieke klas
   * @param classId ID van de klas
   * @returns Array van TestModel objecten
   * @author Stijn Prent
   */
  public async getTestsByClassId(classId: number): Promise<TestModel[]> {
    try {
      const tests = await TestTable.findAll({
        include: [
          {
            model: ClassTable,
            where: {
              id: classId
            }
          }
        ]
      });
      const visibleStatuses = await Promise.all(tests.map(async (test) => {
        const result = await ClassHasTestTable.findOne({
          where: {
            class_id: classId,
            test_id: test.id
          },
          attributes: ['visible']
        });
        return {
          testId: test.id,
          visible: result ? result.visible : null
        };
      }));

      return tests.map((test) => {
        return new TestModel(
          test.id,
          test.name,
          test.duration,
          visibleStatuses.find(v => v.testId === test.id)?.visible || false,
          []
        );
      });
    } catch (error) {
      console.error("Error fetching tests by class ID:", error);
      throw new DatabaseError(
        `Something went wrong while trying to get tests by class ID ${classId}`
      );
    }
  }

  /**
   * Stelt de zichtbaarheid van een toets in voor een specifieke klas
   * @param testId ID van de toets
   * @param classId ID van de klas
   * @param visible Boolean die aangeeft of de toets zichtbaar moet zijn
   * @author Stijn Prent
   */
  public async setVisibility(testId: number, classId: number, visible: boolean): Promise<void> {
    const visible_date = new Date();
    try {
      await ClassHasTestTable.update({
        visible,
        visible_date
      }, {
        where: {
          test_id: testId,
          class_id: classId
        }
      });
    } catch (error) {
      console.error("Error setting visibility for test:", error);
      throw new DatabaseError(
        `Something went wrong while trying to set visibility for test with ID ${testId}`
      );
    }
  }
}
