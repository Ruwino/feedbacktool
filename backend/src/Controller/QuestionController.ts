import { Request, Response, NextFunction } from "express";
import { QuestionService } from "../Business/Service/QuestionService";
import { NewQuestionModel } from "../Business/Models/NewQuestionModel";

export class QuestionController {
    private questionService: QuestionService;

    constructor(questionService: QuestionService) {
        this.questionService = questionService;
    }

    public async getQuestionAndAnswerById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: number = req.body.id; // Je kunt hier ook req.params gebruiken, afhankelijk van je routing.
            const question: NewQuestionModel = await this.questionService.getQuestionAndAnswerById(id);
            res.status(200).json(question);
        } catch (error) {
            next(error);
        }
    }

    public async getPossibleQuestionAnswersById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const questionId: number = req.body.id;
            const possibleAnswers: string[] = await this.questionService.getPossibleQuestionAnswersById(questionId);
            res.status(200).json(possibleAnswers);
        } catch (error) {
            next(error);
        }
    }


     /**
     * @author Max Sijbrands
     */
    public async submitAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userEmail, questionId, answer } = req.body;

            if (!questionId || !answer) {
                throw new Error("Invalid input data.");
            }
            
            await this.questionService.saveStudentAnswer(userEmail, questionId, answer);
            res.status(200).json({ message: "Answer saved successfully." });
        } catch (error) {
            next(error);
        }
    }
    
}
