/**
 * @author Rowin Schoon
 * @description Model voor een cijfer van een student voor een specifieke toets.
 */
export class GradeModel {
  private _testId: number;
  private _testName: string;
  private _subjectId: number;
  private _correctAnswers: number;
  private _totalQuestions: number;
  private _questionsWithIncorrect: number;
  private _scorePercentage: number;
  
  constructor(
      testId: number,
      testName: string,
      subjectId: number,
      correctAnswers: number,
      totalQuestions: number,
      questionsWithIncorrect: number,
      scorePercentage: number
  ) {
      this._testId = testId;
      this._testName = testName;
      this._subjectId = subjectId;
      this._correctAnswers = correctAnswers;
      this._totalQuestions = totalQuestions;
      this._questionsWithIncorrect = questionsWithIncorrect;
      this._scorePercentage = scorePercentage;
  }
  
  public toJSON = (): Record<string, unknown> => {
      return {
          testId: this.testId,
          testName: this.testName,
          subjectId: this.subjectId,
          correctAnswers: this.correctAnswers,
          totalQuestions: this.totalQuestions,
          questionsWithIncorrect: this.questionsWithIncorrect,
          scorePercentage: this.scorePercentage
      }
  }
  
  public get testId(): number {
      return this._testId;
  }

  public get testName(): string{
    return this._testName;
  }
  
  public get subjectId(): number {
      return this._subjectId;
  }
  
  public get correctAnswers(): number {
      return this._correctAnswers;
  }
  
  public get totalQuestions(): number {
      return this._totalQuestions;
  }
  
  public get questionsWithIncorrect(): number {
      return this._questionsWithIncorrect;
  }

  public get scorePercentage(): number {
      return this._scorePercentage;
  }
}