/**
 * @author Luka Piersma
 */

import { QuestionType } from '../../Enums/QuestionType';

export class TestQuestionModel {
    private _id!: number | undefined;
    private _type!: QuestionType;
    private _question!: string;
    private _learningObjective!: string;
    private _answers!: string[];

    constructor(id: number | undefined, type: QuestionType, question: string, learningObjective: string, answers: string[]) {
        this.id = id;
        this.type = type;
        this.question = question;
        this.learningObjective = learningObjective;
        this.answers = answers;
    }

    public toJSON(): Record<string, unknown> {
        const answers: string[] | undefined = this.type === QuestionType.MultipleChoice ? this.answers : undefined;

        return {
            id: this.id,
            type: this.type,
            question: this.question,
            learningObjective: this.learningObjective,
            answers: answers
        }
    }

    public get id(): number | undefined {
        return this._id;
    }

    public get type(): QuestionType {
        return this._type;
    }

    public get question(): string {
        return this._question;
    }

    public get learningObjective(): string {
        return this._learningObjective;
    }

    public get answers(): string[] {
        return this._answers;
    }

    public set id(value: any) {
        if (typeof value !== 'undefined' && (typeof value !== 'number' || value <= 0)) {
            throw new TypeError('Id must be a positive number.');
        }

        this._id = value;
    }

    public set type(value: any) {
        if (!Object.values(QuestionType).includes(value)) {
            throw new TypeError('Type must be a QuestionType.');
        }

        this._type = value;
    }

    public set question(value: any) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new TypeError('Question must be a non-empty string.');
        }

        this._question = value;
    }

    public set learningObjective(value: any) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new TypeError('Learning objective must be a non-empty string.');
        }

        this._learningObjective = value;
    }

    public set answers(value: any) {
        if (!Array.isArray(value)) {
            throw new TypeError('Answers must be an array.');
        }

        if (this._type === QuestionType.MultipleChoice) {
            if (value.length < 2) {
                throw new Error('Question with type MultipleChoice must have 2 or more answers.');
            }

            if (value.some(answer => typeof answer !== 'string' || answer.trim() === '')) {
                throw new Error('Answers for MultipleChoice questions cannot be empty.');
            }
        } else if (this._type === QuestionType.Open) {
            if (value.length !== 1 || typeof value[0] !== 'string' || value[0].trim() === '') {
                throw new Error('Question with type Open must have only one non-empty answer.');
            }
        }

        this._answers = value;
    }
}
