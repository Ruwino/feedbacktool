export class ClassStat {
  private _className: string;
  private _studentsTested: number;
  private _averageScore: number;
  private _worstObjective: string;

  constructor(className: string, studentsTested: number, averageScore: number, worstObjective: string) {
    this._className = className;
    this._studentsTested = studentsTested;
    this._averageScore = averageScore;
    this._worstObjective = worstObjective;
  }

  public get className(): string {
    return this._className;
  }

  public get studentsTested(): number {
    return this._studentsTested;
  }

  public get averageScore(): number {
    return this._averageScore;
  }

  public get worstObjective(): string {
    return this._worstObjective;
  }
}
