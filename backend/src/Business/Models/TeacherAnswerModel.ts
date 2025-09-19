/**
 * @author Luka Piersma
 */

export class TeacherAnswerModel {
    private _id!: number | undefined;
    private _answer!: string;
    private _correct!: boolean;

    constructor(id: number | undefined, answer: string, correct: boolean) {
        this.id = id;
        this.answer = answer;
        this.correct = correct;
    }

    public toJSON(): Record<string, any> {
        return {
            name: this.answer,
            correct: this.correct
        }
    }

    public get id(): number | undefined {
        return this._id;
    }

    public get answer(): string {
        return this._answer;
    }

    public get correct(): boolean {
        return this._correct;
    }

    public set id(value: any) {
        if (value !== undefined && (typeof value !== 'number' || value <= 0)) {
            throw new TypeError('Id must be a positive number or undefined.');
        }

        this._id = value;
    }

    public set answer(value: unknown) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new TypeError('Answer must be a non-empty string.');
        }

        this._answer = value;
    }

    public set correct(value: unknown) {
        if (typeof value !== 'boolean') {
            throw new TypeError('Correct must be a boolean.');
        }

        this._correct = value;
    }
}
