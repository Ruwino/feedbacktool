/**
 * @author Luka Piersma
 */

export class AnswerTestQuestionModel {
    private _testId!: number;
    private _questionId!: number;
    private _answer!: string;

    constructor(testId: number, questionId: number, answer: string) {
        this.testId = testId;
        this.questionId = questionId;
        this.answer = answer;
    }

    public get testId(): number {
        return this._testId;
    }

    public set testId(value: any) {
        if (this._testId) {
            throw new Error('Test id has already been set.');
        }

        if (!Number.isInteger(value) || value < 0) {
            throw new TypeError('Test id must be a positive integer.');
        }

        this._testId = value;
    }

    public get questionId(): number {
        return this._questionId;
    }

    public set questionId(value: any) {
        if (this._questionId) {
            throw new Error('Question id has already been set.');
        }

        if (!Number.isInteger(value) || value < 0) {
            throw new TypeError('Question id must be a positive integer.');
        }
        
        this._questionId = value;
    }

    public get answer(): string {
        return this._answer;
    }

    public set answer(value: any) {
        if (this._answer) {
            throw new Error('Answer has already been set.');
        }

        if (typeof value !== 'string') {
            throw new TypeError('Answer must be a string.');
        }

        if (value.trim() === '') {
            throw new Error('String must not be empty or only contain whitespaces.');
        }        

        this._answer = value;
    }
}