import { QuestionType } from "../enums/questionType.enum";
import { AnswerModel } from "./answer.model";
import { HintModel } from "./hint.model";

export class QuestionModel {
  private _id?: number;
  private _type: QuestionType;
  private _name: string;
  private _learningObjectiveIndex: number;
  private _answers: AnswerModel[];
  private _hints: HintModel[];

  constructor(params: {
    id?: number;
    type: QuestionType;
    name: string;
    learningObjectiveIndex: number;
    answers: AnswerModel[];
    hints: HintModel[];
  }) {
    this._id = params.id;
    this._type = params.type;
    this._name = params.name;
    this._learningObjectiveIndex = params.learningObjectiveIndex;
    this._answers = params.answers;
    this._hints = params.hints;
  }

  public toJSON() {
    return {
      id: this.id,
      type: this.type,
      question: this.name,
      learningObjectiveIndex: this.learningObjectiveIndex,
      answers: this.answers.map(a => a.toJSON()),
      hints: this.hints.map(h => h.toJSON())
    };
  }

  public get id(): number | undefined {
    return this._id;
  }
  public get type(): QuestionType {
    return this._type;
  }
  public get name(): string {
    return this._name;
  }
  public get learningObjectiveIndex(): number {
    return this._learningObjectiveIndex;
  }
  public get answers(): AnswerModel[] {
    return this._answers;
  }
  public get hints(): HintModel[] {
    return this._hints;
  }
}