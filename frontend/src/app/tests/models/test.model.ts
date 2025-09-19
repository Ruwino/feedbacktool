import { ObjectiveModel } from "./objective.model";
import { QuestionModel } from "./question.model";

export class TestModel {
    private _id?: number;
    private _name: string;
    private _subject: string;
    private _duration: number;
    private _learningObjectives: ObjectiveModel[];
    private _questions: QuestionModel[];
    private _randomized: boolean;
    private _canEdit: boolean;

    constructor(params: {
        id?: number;
        name: string;
        subject: string;
        duration: number;
        learningObjectives: ObjectiveModel[];
        questions: QuestionModel[];
        randomized: boolean;
        canEdit?: boolean;
    }) {
        this._id = params.id;
        this._name = params.name;
        this._subject = params.subject;
        this._duration = params.duration;
        this._learningObjectives = params.learningObjectives;
        this._questions = params.questions;
        this._randomized = params.randomized;
        this._canEdit = params.canEdit || false;
    }

    public toJSON() {
        return {
            id: this._id,
            name: this._name,
            subject: this._subject,
            duration: this._duration,
            questions: this._questions.map(q => q.toJSON()),
            learningObjectives: this._learningObjectives.map(o => o.toJSON()),
            randomized: this._randomized
        };
    }

    public get id(): number | undefined {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }
    public get subject(): string {
        return this._subject;
    }
    public get duration(): number {
        return this._duration;
    }
    public get learningObjectives(): ObjectiveModel[] {
        return this._learningObjectives;
    }
    public get questions(): QuestionModel[] {
        return this._questions;
    }
    public get randomized(): boolean {
        return this._randomized;
    }
    public get canEdit(): boolean {
        return this._canEdit;
    }

    public set id(value: number) {
        this._id = value;
    }
    
    public set canEdit(value: boolean) {
        this._canEdit = value;
    }
}