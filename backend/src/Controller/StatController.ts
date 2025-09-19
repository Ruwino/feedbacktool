import {StatService} from "../Business/Service/StatService";
import {NextFunction, Request, Response} from "express";

export class StatController {
    private statService: StatService;

    constructor(statService: StatService) {
        this.statService = statService;
    }

    public async getBestObjective(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const email: string = req.body.email;
            const bestObjective = await this.statService.getBestObjective(email);
            res.status(200).json(bestObjective);
        } catch (error) {
            next(error);
        }
    }

    public async getStreak(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const email: string = req.body.email;
            const streak = await this.statService.getStreak(email);
            res.status(200).json(streak?.toJSON());
        } catch (error) {
            next(error);
        }
    }

    public async getMadeTests(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const email: string = req.body.email;
            const madeTests = await this.statService.getMadeTests(email);
            res.status(200).json(madeTests?.toJSON());
        } catch (error) {
            next(error);
        }
    }

    public async getClassAverage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const classId = Number(req.params.id);
            const averageScore = await this.statService.getClassAverage(classId);
            res.status(200).json(averageScore);
        } catch (error) {
            next(error);
        }
    }

    public async getClassWorstObjective(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const classId = Number(req.params.id);
            const worstObjective = await this.statService.getClassWorstObjective(classId);
            res.status(200).json(worstObjective);
        } catch (error) {
            next(error);
        }
    }

    public async getClassTotalTests(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const classId = Number(req.params.id);
            const totalTests = await this.statService.getClassTotalTests(classId);
            res.status(200).json(totalTests);
        } catch (error) {
            next(error);
        }
    }

    public async getRecommendedTests(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const email: string = req.body.email;
            const recommendedTests = await this.statService.getRecommendedTests(email);
            res.status(200).json(recommendedTests);
        } catch (error) {
            next(error);
        }
    }
}