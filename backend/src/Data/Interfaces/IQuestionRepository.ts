import { NewQuestionModel } from "../../Business/Models/NewQuestionModel";

export interface IQuestionRepository {
    getQuestionAndAnswerById(id: number): Promise<NewQuestionModel>;
    getPossibleQuestionAnswersById(questionId: number): Promise<string[]>;
    saveStudentAnswer(userEmail: string, questionId: number, answer: string): Promise<void>;
}
