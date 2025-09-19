import { IFooRepository } from "../../Data/Interfaces/IFooRepository";
import { FooModel } from "../Models/FooModel";

export class FooService {
    private fooRepository: IFooRepository;

    constructor(repository: IFooRepository) {
        this.fooRepository = repository;
    }

    public async getFoo(id: number): Promise<FooModel> {
        return await this.fooRepository.getFoo(id);
    }

    public async createFoo(fooModel: FooModel): Promise<void> {
        await this.fooRepository.createFoo(fooModel);
    }
}