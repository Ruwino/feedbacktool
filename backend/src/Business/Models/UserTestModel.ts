/**
 * @author Roan Slingerland
 */

export class UserTestModel {
    private _testName: string;
    private _learningObjectives: string[] = [];

    constructor(testName: string, learningObjectives: string[]) {
        this._testName = testName;
        this._learningObjectives = learningObjectives;
    }

    public get testName(): string {
        return this._testName;
    }

    public set testName(value: string) {
        if(!value || value.trim().length === 0) {
            throw new Error("Test name is empty.");
        }

        this._testName = value;
    }

    public get learningObjectives(): string[] {
        return this._learningObjectives;
    }

    public set learningObjectives(value: string[]) {
        if(!value || value.length === 0) {
            throw new Error("No learning objectives provided.");
        }

        this._learningObjectives = value;
    }

    public toJSON(): Record<string, any> {
        return {
            name: this.testName,
            objectives: this.learningObjectives
        }
    }
}