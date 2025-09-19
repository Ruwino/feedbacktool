import { error } from "console";
import { ClassService } from "../Business/Service/ClassService";
import express, { NextFunction } from "express";

export class ClassController {
    private classService: ClassService;

    constructor(classService: ClassService) {
        this.classService = classService;
    }

    public async addClass(req: express.Request, res: express.Response) {
        try {
            const result = await this.classService.addClass(req.body, req.body.email);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    public async getClasses(req: express.Request, res: express.Response, next: NextFunction): Promise<void> {
        try {
            const email: string = req.body.email;
            const classes = await this.classService.getClasses(email);

            res.status(200).json(classes.map((classModel) => classModel.toJSON()));
        } catch (error) {
            console.error("Error fetching classes:", error);
            next(error);
        }
    }

    public async getClassById(req: express.Request, res: express.Response) {
        try {
            const result = await this.classService.getClassById(parseInt(req.params.id));
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    public async addStudentsToClass(req: express.Request, res: express.Response) {
        try {
            const classId = req.body.classId;
            const students = req.body.students;
            await this.classService.addStudentsToClass(classId, students);
            res.status(200).send();
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    public async removeStudentFromClass(req: express.Request, res: express.Response) {
        try {
            const classId = req.body.classId;
            const studentEmail = req.body.studentEmail;
            await this.classService.removeStudentFromClass(classId, studentEmail);
            res.status(200).send();
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
}