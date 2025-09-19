import { Request, Response, NextFunction } from "express";
import { FooService } from "../Business/Service/FooService";
import { FooModel } from "../Business/Models/FooModel";


export class FooController {
    private fooService: FooService;

    constructor(fooService: FooService) {
        this.fooService = fooService;
    }


    public async getFoo(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: number = req.body.id;
            const foo: FooModel = await this.fooService.getFoo(id);

            res.status(200).json(foo);
        } catch (error) {
            next(error)
        }
    }

    public async createFoo(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const fooModel: FooModel = new FooModel(req.body.id, req.body.foo);
            await this.fooService.createFoo(fooModel);

            res.status(200).json("succes");
        } catch (error) {
            next(error);
        }
    }
}