import { TestModel } from './testModel';

export class SubjectModel {
    private _id: number;
    private _name: string;
    private _tests: TestModel[];

    constructor(id: number, name: string, tests: TestModel[]) {
        this._id = id;
        this._name = name;
        this._tests = tests;
    }

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
      this._name = name;
    }

    public get tests(): TestModel[] {
        return this._tests;
    }

    public set tests(tests: TestModel[]) {
        this._tests = tests;
    }

}
