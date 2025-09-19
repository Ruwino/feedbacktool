import { SubjectType } from '../../Enums/SubjectType';
import { TeacherObjectiveModel } from './TeacherObjectiveModel';
import { TeacherQuestionModel } from './TeacherQuestionModel';

export class TeacherTestModel {
    private _id!: number | undefined;
    private _name!: string;
    private _subject!: SubjectType;
    private _duration!: number;
    private _randomized!: boolean;
    private _learningObjectives!: TeacherObjectiveModel[];
    private _questions!: TeacherQuestionModel[];

    public creatorEmail?: string;

    constructor(
        id: number | undefined,
        name: string,
        subject: SubjectType,
        duration: number,
        randomized: boolean,
        learningObjectives: TeacherObjectiveModel[],
        questions: TeacherQuestionModel[],
        creatorEmail?: string
    ) {
        this.id = id;
        this.name = name;
        this.subject = subject;
        this.duration = duration;
        this.randomized = randomized;
        this.learningObjectives = learningObjectives;
        this.questions = questions;
        this.creatorEmail = creatorEmail;
    }

    public toJSON(teacherEmail?: string): Record<string, any> {
        return {
            id: this._id,
            name: this._name,
            subject: this._subject,
            duration: this._duration,
            randomized: this._randomized,
            learningObjectives: this._learningObjectives,
            questions: this._questions.map(q => q.toJSON()),
            canEdit: teacherEmail ? this.creatorEmail == teacherEmail : false
        }
    }

    get id(): number | undefined {
        return this._id;
    }

    get name(): string {
        return this._name;
    }
    
    get subject(): SubjectType {
        return this._subject;
    }

    get duration(): number {
        return this._duration;
    }

    get randomized(): boolean {
        return this._randomized;
    }

    get learningObjectives(): TeacherObjectiveModel[] {
        return this._learningObjectives;
    }

    get questions(): TeacherQuestionModel[] {
        return this._questions;
    }

    set id(value: any) {
        if (typeof value !== 'undefined' && (typeof value !== 'number' || value < 1)) {
            throw new TypeError('Id must be a positive integer.');
        }

        this._id = value;
    }

    set name(value: any) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new TypeError('Name must be a non-empty string.');
        }

        this._name = value;
    }

    set subject(value: any) {
         if (!Object.values(SubjectType).includes(value)) {
             throw new TypeError('Type must be a SubjectType.');
         }

        this._subject = value;
    }

    set duration(value: any) {
        if (typeof value !== 'number' || value < 10) {
            throw new TypeError('Duration must be 10 or greater');
        }

        this._duration = value;
    }

    set randomized(value: any) {
        if (typeof value !== 'boolean') {
            throw new TypeError('Randomized must be a boolean.');
        }

        this._randomized = value;
    }

    set learningObjectives(value: any) {
        if (!Array.isArray(value)) {
            throw new TypeError('Learning objectives must be an array.');
        }

        if (value.length === 0) {
            throw new Error('Learning objectives cannot be empty.');
        }

        console.log('objectives:', value);

        this._learningObjectives = value.map(o => new TeacherObjectiveModel(o.id, o.objective));
    }

    set questions(value: any) {
        if (!Array.isArray(value)) {
            throw new TypeError('Questions must be an array.');
        }

        const questions = value.map(question => new TeacherQuestionModel(question.id, question.type, question.question, question.learningObjectiveIndex, question.answers, question.hints));
        
        if (questions.length === 0) {
            throw new Error('Questions must have atleast one question.');
        }

        for (const q of questions) {
            if (!this.learningObjectives.at(q.learningObjectiveIndex)) {
                throw new Error('Question must have a valid learningObjectiveIndex')
            }
        }
    
        this._questions = questions;
    }
}