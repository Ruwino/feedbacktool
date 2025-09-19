import { FooModel } from "../../Business/Models/FooModel";
import FooTable from "../Tables/FooTable";

export class FooRepository {

    public async getFoo(id: number): Promise<FooModel> {
        try {
            const results = await FooTable.findOne({
                where: {
                    id: id,
                },
            });
    
            if(!results) {
                throw new Error("Foo not found.");
            }
    
            return new FooModel(
                results.id,
                results.foo
            );
        } catch (error) {
            throw new Error("Something went wrong.");
        }
    }

    public async createFoo(fooModel: FooModel): Promise<void> {
        try {
            await FooTable.create({
                id: fooModel.id,
                foo: fooModel.foo
            })
        } catch (error) {
            throw new Error("Something went wrong.");
        }
    }
}