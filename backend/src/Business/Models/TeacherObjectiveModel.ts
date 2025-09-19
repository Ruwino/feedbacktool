/**
 * @author Luka Piersma
 */

export class TeacherObjectiveModel {
    private _id!: number | undefined;
    private _objective!: string;

    constructor(id: number | undefined, objective: string) {
        this.id = id;
        this.objective = objective;
    }

    public toJSON(): Record<string, any> {
        return {
            id: this.id,
            name: this.objective,
        }
    }

    public get id(): number | undefined {
        return this._id;
    }

    public get objective(): string {
        return this._objective;
    }

    public set id(value: any) {
        if (value !== undefined && (typeof value !== 'number' || value <= 0)) {
            throw new TypeError('Id must be a positive number or undefined.');
        }

        this._id = value;
    }

    public set objective(value: unknown) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new TypeError('Objective must be a non-empty string.');
        }

        this._objective = value;
    }
}
