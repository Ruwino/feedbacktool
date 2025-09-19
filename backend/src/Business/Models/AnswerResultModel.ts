/**
 * @author Luka Piersma
 */

export class AnswerResultModel {
    private _correct: boolean;
    private _hint: string[] | undefined;

    constructor(correct: boolean, hint?: string[]) {
        this._correct = correct;
        this._hint = hint;
    }

    public get hint(): string[] | undefined {
        return this._hint;
    }

    public get correct(): boolean {
        return this._correct;
    }
}