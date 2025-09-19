/**
 * @author Luka Piersma
 */

import express, { NextFunction } from "express";
import { TestService } from "../Business/Service/TestService";
import { UserType } from "../Enums/UserType";
import { AnswerTestQuestionModel } from "../Business/Models/AnswerTestQuestionModel";
import { BadRequestError } from "../Errors/BadRequestError";
import { AnswerResultModel } from "../Business/Models/AnswerResultModel";
import { TeacherTestModel } from "../Business/Models/TeacherTestModel";
import { TestModel } from "../Business/Models/TestModel";


export class TestController {
    private testService: TestService;

    constructor(testService: TestService) {
        this.testService = testService;
    }

    /**
    * @author Luka Piersma
    */

    public async updateTest(req: express.Request, res: express.Response, next: express.NextFunction) {
        const testId: any = req.body.id;
        const name: any = req.body.name;
        const subject: any = req.body.subject;
        const duration: any = req.body.duration;
        const randomized: any = req.body.randomized;
        const learningObjectives: any = req.body.learningObjectives;
        const questions: any = req.body.questions;

        const email: string = req.body.email;

        try {
            let testModel: TeacherTestModel

            try {
                testModel = new TeacherTestModel(testId, name, subject, duration, randomized, learningObjectives, questions, email);
            } catch (error: any) {
                throw new BadRequestError('Invalid request body.');
            }

            await this.testService.updateTest(email, testModel);

            res.status(204).json();
        } catch (error: unknown) {
            next(error);
        }
    }

    /**
    * @author Luka Piersma
    */
   
    public async getTest(req: express.Request, res: express.Response, next: express.NextFunction) {
        const testId: number | null = parseInt(req.params.testId);

        try {
            if (!testId) throw new BadRequestError('Invalid testId');

            const test = await this.testService.getTest(testId);

            res.status(200).json(test.toJSON(req.body.email));
        } catch (error: unknown) {
            next(error);
        }
    }

    /**
    * @author Luka Piersma
    */

    public async createTest(req: express.Request, res: express.Response, next: express.NextFunction) {
        const email: string = req.body.email;
        const name: any = req.body.name;
        const subject: any = req.body.subject;
        const duration: any = req.body.duration;
        const randomized: any = req.body.randomized;
        const learningObjectives: any = req.body.learningObjectives;
        const questions: any = req.body.questions;

        try {
            let testModel: TeacherTestModel

            try {
                testModel = new TeacherTestModel(undefined, name, subject, duration, randomized, learningObjectives, questions, email);
            } catch (error: any) {
                throw new BadRequestError('Invalid request body.');
            }

            const createdTestModel = await this.testService.createTest(testModel);

            res.status(201).json(createdTestModel.id);
        } catch (error) {
            next(error)
        }
    }

    public async getTestQuestions(req: express.Request, res: express.Response, next: express.NextFunction) {
        const testId: number | null = parseInt(req.params.testId);
        const email: string = req.body.email;
        const userType: UserType = req.body.userType;

        try {
            if (!testId) {
                throw new Error('Invalid test ID');
            }

            const questions = await this.testService.getTestQuestions(email, userType, testId);

            res.status(200).json(questions.map(q => q.toJSON()));
        } catch (error) {
            next(error);
        }
    }

    public async answerTestQuestion(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        const email: string = req.body.email;
        const userType: UserType = req.body.userType;

        const testId: number | null = parseInt(req.params.testId);
        const questionId: number | null = parseInt(req.params.questionId);
        const answer: any = req.body.answer;

        try {
            let answerModel: AnswerTestQuestionModel;

            try {
                answerModel = new AnswerTestQuestionModel(testId, questionId, answer);
            } catch {
                throw new BadRequestError('Invalid request body');
            }

            const answerResultModel: AnswerResultModel = await this.testService.answerTestQuestion(email, userType, answerModel)

            res.status(200).json(answerResultModel);
        } catch (error: unknown) {
            next(error);
        }
    }

    public async getTestsByClassId(req: express.Request, res: express.Response, next: express.NextFunction) {
        const classId: number | null = parseInt(req.params.id);

        try {
            if (!classId) {
                throw new Error("Invalid class ID");
            }

            const tests = await this.testService.getTestsByClassId(classId);

            res.status(200).json(tests);
        } catch (error) {
            next(error);
        }
    }

    public async setVisibility(req: express.Request, res: express.Response, next: express.NextFunction) {
        const testId: number = req.body.testId;
        const classId: number = req.body.classId;
        const visible: boolean = req.body.visible;

        try {
            await this.testService.setVisibility(testId, classId, visible);
            res.status(200).send();
        } catch (error) {
            next(error);
        }
    }

    public async getTestData(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let testId: number = parseInt(req.params.testId);

        try {
            const testData = await this.testService.getTestDataById(testId);

            res.status(200).json(testData)
        } catch (error) {
            next(error);
        }
    }

    public async hasCompletedTest(req: express.Request, res: express.Response, next: NextFunction): Promise<void> {
        const testId: number = parseInt(req.params.testId);
        const email: string = req.body.email;

        try {
            const finishedTest: boolean = await this.testService.hasCompletedTest(email, testId);

            res.status(200).json({finished: finishedTest});
        } catch (error) {
            next(error);
        }
    }
}