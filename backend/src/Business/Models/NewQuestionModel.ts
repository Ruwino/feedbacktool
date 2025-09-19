/**
 * @author Roan Slingerland
 * @description A question only has 1 good answer, that's why both open questions and multiple choice questions can use the same business model.
 */
export class NewQuestionModel {
    private _id!: number;
    private _question!: string;
    private _correctAnswer!: string;
    
    constructor(id: number, question: string, correctAnswer: string) {
        this._id = id;
        this._question = question;
        this._correctAnswer = correctAnswer;
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        if(!value) {
            throw new Error("ID is empty.");
        }
        this._id = value;
    }
    
    public get question(): string {
        return this._question;
    }
    public set question(value: string) {
        if(!value) {
            throw new Error("Question is empty.");
        }
        this._question = value;
    }
    
    public get correctAnswer(): string {
        return this._correctAnswer;
    }
    public set correctAnswer(value: string) {
        if(!value) {
            throw new Error("Correct answer is empty.");
        }
        this._correctAnswer = value;
    }
}