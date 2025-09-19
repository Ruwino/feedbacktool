import { QuestionType } from "../enums/QuestionType";

export class QuestionModel {
    private _id!: number;
    private _question!: string;
    private _questionType!: QuestionType;
    private _answers!: string[];
    private _learningObjective: string;


    constructor(id: number, question: string, questionType: QuestionType, answers: string[], learningObjective: string) {
        this.id = id;
        this.question = question;
        this.questionType = questionType;
        this.answers = answers;
        this._learningObjective = learningObjective;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        if(!value || value <= 0) {
            throw new Error("ID is empty.");
        }
        
        this._id = value;
    }

    public get question(): string {
        return this._question;
    }

    public set question(value: string) {
        if(!value || value.trim().length === 0) {
            throw new Error("Question is empty.");
        }
        
        this._question = value;
    }

    public get questionType(): string {
        return this._questionType;
    }

    public set questionType(value: QuestionType) {
        if(!value || value.trim().length === 0) {
            throw new Error("Question type is empty.");
        }

        this._questionType = value;
    }
    public get answers(): string[] {
        return this._answers;
    }

    public set answers(value: string[]) {
        if(this.questionType === QuestionType.Open && value !== undefined) {   
            throw new Error("Answers must be empty when question type is open.")
        } else if(this.questionType === QuestionType.MultipleChoice && (!value)) {
            throw new Error("Answer(s) are empty.");
        }

        this._answers = value;
    }

    public get learningObjective(): string {
        return this._learningObjective;
    }

    public set learningObjective(value: string) {
        if(!value || value == null) {
            throw new Error("learningObjective is empty.");
        }

        this._learningObjective = value;
    }
}