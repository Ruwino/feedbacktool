/**
 * @author Luka Piersma
 */

import { AnswerResultModel } from "../../Business/Models/AnswerResultModel";
import { AnswerTestQuestionModel } from "../../Business/Models/AnswerTestQuestionModel";
import { TeacherTestModel } from "../../Business/Models/TeacherTestModel";
import { TestModel } from "../../Business/Models/TestModel";
import { TestQuestionModel } from "../../Business/Models/TestQuestionModel";
import { UserTestModel } from "../../Business/Models/UserTestModel";

export interface ITestRepository {
    getTestQuestions(email: string, testId: number): Promise<TestQuestionModel[]>;
    answerTestQuestion(email: string, answerModel: AnswerTestQuestionModel): Promise<AnswerResultModel>;
    createTest(testModel: TeacherTestModel): Promise<TeacherTestModel>;
    updateTest(testModel: TeacherTestModel): Promise<void>;

    hasAccessToTest(email: string, testId: number): Promise<boolean>;
    hasAccessToTestQuestion(email: string, answerModel: AnswerTestQuestionModel): Promise<boolean>;
    answerTestQuestion(email: string, answerModel: AnswerTestQuestionModel): Promise<AnswerResultModel>;
    getTestQuestions(email: string, testId: number): Promise<TestQuestionModel[]>;
    getQuestionAmount(testId: number): Promise<number>;
    getTestDataById(testId: number): Promise<UserTestModel>;
    getAmountOfAnswers(email: string, testId: number): Promise<number>;
    getAmountOfCorrectAnswers(email: string, testId: number): Promise<number>
    deleteUserAnswers(email: string, testId: number): Promise<void>;
    getTestsBySubjects(subjectIds: number[]): Promise<TestModel[]>; 
    getTestById(testId: number): Promise<TestModel | null>;  
    getQuestionsForTest(testId: number): Promise<any[]>;
    getTestsByClassId(classId: number): Promise<TestModel[]>;
    setVisibility(testId: number, classId: number, visible: boolean): Promise<void>;
    getTest(testId: number): Promise<TeacherTestModel | null>;
}