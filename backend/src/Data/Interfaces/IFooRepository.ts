import { FooModel } from "../../Business/Models/FooModel";

export interface IFooRepository {
    getFoo(id: number): Promise<FooModel>;
    createFoo(fooModel: FooModel): Promise<void>;
}