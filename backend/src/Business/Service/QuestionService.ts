import { IQuestionRepository } from "../../Data/Interfaces/IQuestionRepository";
import { NewQuestionModel } from "../Models/NewQuestionModel";

export class QuestionService {
    private questionRepository: IQuestionRepository;

    constructor(repository: IQuestionRepository) {
        this.questionRepository = repository;
    }

    public async getQuestionAndAnswerById(id: number): Promise<NewQuestionModel> {
        return await this.questionRepository.getQuestionAndAnswerById(id);
    }

    /**
     * @author Roan Slingerland
     * @param questionId 
     * @returns an array containg all possible answers for a question.
     */
    public async getPossibleQuestionAnswersById(questionId: number): Promise<string[]> {
        const possibleAnswers: string[] = await this.questionRepository.getPossibleQuestionAnswersById(questionId);
        if(!possibleAnswers) {
            throw new Error("No answers found.");
        }
        return possibleAnswers;
    }


     /**
     * @author Max Sijbrands
     */
    public async saveStudentAnswer(userEmail: string, questionId: number, answer: string): Promise<void> {
        await this.questionRepository.saveStudentAnswer(userEmail, questionId, answer);
    }
    
}
