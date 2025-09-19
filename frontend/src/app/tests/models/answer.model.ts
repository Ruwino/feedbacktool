export class AnswerModel {
    private _id?: number;
    private _name: string;
    private _correct: boolean;

    constructor(params: {
        id?: number,
        name: string,
        correct: boolean
    }) {
        this._id = params.id;
        this._name = params.name;
        this._correct = params.correct;
    }

    public toJSON() {
        return {
            id: this._id,
            answer: this._name,
            correct: this._correct
        };
    }

    public get id(): number | undefined {
        return this._id;
    }
    public get name(): string {
        return this._name;
    }
    public get correct(): boolean {
        return this._correct;
    }
}