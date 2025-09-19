/**
 * @author Luka Piersma
 */

import { ITestRepository } from "../../Data/Interfaces/ITestRepository";
import { UserType } from "../../Enums/UserType";
import { NotFoundError } from "../../Errors/NotFoundError";
import { UnauthorizedError } from "../../Errors/UnauthorizedError";
import { AnswerResultModel } from "../Models/AnswerResultModel";
import { AnswerTestQuestionModel } from "../Models/AnswerTestQuestionModel";
import { TeacherTestModel } from "../Models/TeacherTestModel";
import { TestQuestionModel } from "../Models/TestQuestionModel";
import { UserTestModel } from "../Models/UserTestModel";
import {TestModel} from "../Models/TestModel";

export class TestService {
  private testRepository: ITestRepository;

  constructor(testRepository: ITestRepository) {
    this.testRepository = testRepository;
  }
  
  /**
  * @author Luka Piersma
  */

  public async updateTest(teacherEmail: string, testModel: TeacherTestModel): Promise<void> {
    const test = testModel.id ? await this.testRepository.getTest(testModel.id) : null;

    if (!test) {
      throw new NotFoundError('Test has not been found');
    }

    if (test.creatorEmail !== teacherEmail) {
      throw new UnauthorizedError('Teacher does not have access to edit the test');
    }

    await this.testRepository.updateTest(testModel);
  }

  /**
  * @author Luka Piersma
  */

  public async getTest(testId: number): Promise<TeacherTestModel> {
    const test = await this.testRepository.getTest(testId);

    if (!test) {
      throw new NotFoundError('Test has not been found.');
    }

    return test;
  }

  /**
  * @author Luka Piersma
  */

  public async createTest(testModel: TeacherTestModel): Promise<TeacherTestModel> {
    return await this.testRepository.createTest(testModel);
  }

  public async getTestQuestions(email: string, userType: UserType, testId: number): Promise<TestQuestionModel[]> {
    if (userType !== UserType.Admin && !await this.testRepository.hasAccessToTest(email, testId)) {
      throw new UnauthorizedError('User does not have access to this test.');
    }
    
    // All questions.
    const questions: TestQuestionModel[] = await this.testRepository.getTestQuestions(email, testId);
    // Amount of questions a user has given an answer for.
    const answerAmount: number = await this.testRepository.getAmountOfAnswers(email, testId);

    // If the total amount of answered questions is lower thanthe total amount of questions, delete all given answers. If this does not happen the questions will be returned normally.
    if(answerAmount > 0 && answerAmount < await this.testRepository.getQuestionAmount(testId)) {
      await this.testRepository.deleteUserAnswers(email, testId);
    }

    return questions;
  }

  public async answerTestQuestion(email: string, userType: UserType, answerModel: AnswerTestQuestionModel): Promise<AnswerResultModel> {
    if (userType !== UserType.Admin && !await this.testRepository.hasAccessToTestQuestion(email, answerModel)) {
      throw new UnauthorizedError('User does not have access to answer this question.');
    }

    return await this.testRepository.answerTestQuestion(email, answerModel);
  }

  public async getTestDataById(testId: number): Promise<UserTestModel> {
    const testData: UserTestModel | null = await this.testRepository.getTestDataById(testId);
    if(!testData) {
      throw new NotFoundError("Test not found.");
    }

    return testData;
  }

  public async getTestsByClassId(classId: number): Promise<TestModel[]> {
    return await this.testRepository.getTestsByClassId(classId);
  }

  public async setVisibility(testId: number, classId: number, visible: boolean): Promise<void> {
    return await this.testRepository.setVisibility(testId, classId, visible);
  }

  public async hasCompletedTest(email: string, testId: number): Promise<boolean> {
    const totalQuestionAmount: number = await this.testRepository.getQuestionAmount(testId);
    const amountOfCorrectAnswers: number = await this.testRepository.getAmountOfCorrectAnswers(email, testId);

    if(totalQuestionAmount === amountOfCorrectAnswers && amountOfCorrectAnswers !== 0) {
      return true;
    }

    return false;
  }
}