/**
 * @author Luka Piersma
 */

import { QuestionType } from '../../Enums/QuestionType';
import { TeacherAnswerModel } from './TeacherAnswerModel';
import { TeacherHintModel } from './TeacherHintModel';

export class TeacherQuestionModel {
    private _id!: number | undefined;
    private _type!: QuestionType;
    private _question!: string;
    private _learningObjectiveIndex!: number;
    private _answers!: TeacherAnswerModel[];
    private _hints!: TeacherHintModel[];

    constructor(id: number | undefined, type: QuestionType, question: string, learningObjectiveIndex: number, answers: TeacherAnswerModel[], hints: TeacherHintModel[]) {
        this.id = id;
        this.type = type;
        this.question = question;
        this.learningObjectiveIndex = learningObjectiveIndex;
        this.answers = answers;
        this.hints = hints;
    }

    public toJSON(): Record<string, any> {
        return {
            id: this.id,
            type: this.type,
            name: this.question,
            learningObjectiveIndex: this.learningObjectiveIndex,
            answers: this.answers.map(a => a.toJSON()),
            hints: this.hints
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

    public get learningObjectiveIndex(): number {
        return this._learningObjectiveIndex;
    }

    public get answers(): TeacherAnswerModel[] {
        return this._answers;
    }

    public get hints(): TeacherHintModel[] {
        return this._hints;
    }

    public set id(value: any) {
        if (value !== undefined && (typeof value !== 'number' || value <= 0)) {
            throw new TypeError('Id must be a positive number or undefined.');
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

    public set learningObjectiveIndex(value: any) {
        if (typeof value !== 'number' || value < 0) {
            throw new TypeError('learningObjectiveIndex must be a number greater than or equal to 0.');
        }

        this._learningObjectiveIndex = value;
    }

    public set answers(value: any) {
        if (!Array.isArray(value)) {
            throw new TypeError('Answers must be an array.');
        }
    
        const answers = value.map(a => new TeacherAnswerModel(a.id, a.answer, a.correct));
    
        if (this._type === QuestionType.MultipleChoice) {
            if (answers.length < 2) {
                throw new Error('Question with type MultipleChoice must have 2 or more answers.');
            }
        } else if (this._type === QuestionType.Open) {
            if (answers.length !== 1) {
                throw new Error('Question with type Open must have only one answer.');
            }
        }
    
        if (!answers.some(a => a.correct)) {
            throw new Error('There must be at least one correct answer.');
        }
    
        this._answers = value;
    }    

    public set hints(value: any) {
        if (!Array.isArray(value)) {
            throw new TypeError('Hints must be an array.');
        }

        this._hints = value.map(h => new TeacherHintModel(h.id, h.hint));
    }
}
