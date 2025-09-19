import { NextFunction, Request, Response } from "express";
import { SubjectService } from "../Business/Service/SubjectService";
import { SubjectTestModel } from "../Business/Models/SubjectTestModel";

export class SubjectController {
    private _subjectService: SubjectService;

    constructor(subjectService: SubjectService) {
        this._subjectService = subjectService;
    }

    /**
     * @author Luka Piersma
     */
    public async getSubjectsByTeacherEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        const teacherEmail: string = req.body.email;

        try {
            const subjects = await this._subjectService.getSubjectsByTeacherEmail(teacherEmail);

            res.status(200).json(subjects);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @author Stijn Prent
     * @description Get all subjects.
     * @param req
     * @param res
     * @param next
     */
    public async getAllSubjects(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const subjects = await this._subjectService.getAllSubjects();

            res.status(200).json(subjects);

        } catch (error) {
            next(error);
        }
    }

    /**
     * @author Latricha Seym
     * @description Gets all the subjects with the corresponding tests.
     * @param req
     * @param res
     * @param next
     */

    public async getSubjectsWithTests(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const email: string = req.body.email;
            const subjectTests: SubjectTestModel[] = await this._subjectService.getSubjectsWithTests(email);


            res.status(200).json(subjectTests.map(subjectTest => subjectTest.toJSON()));
        } catch (error: unknown) {
            next(error);
        }

    }
}