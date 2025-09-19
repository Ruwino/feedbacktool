import { TestModel } from "./TestModel";

/**
 * @author Latricha Seym
 * 
 */
export class SubjectTestModel {
    private _id: number;
    private _name: string;
    private _tests: TestModel[];

    constructor(id: number, name: string, tests: TestModel[]) {
        this._id = id;
        this._name = name;
        this._tests = tests;
    }

    public toJSON = (): Record<string, unknown> => {
        return {
            id: this.id,
            name: this.name,
            tests: this.tests.map(test => test.toJSON())
        }
    }

    public get name() {
        return this._name;
    }

    public get id() {
        return this._id;
    }

    public get tests() {
        return this._tests;
    }
}