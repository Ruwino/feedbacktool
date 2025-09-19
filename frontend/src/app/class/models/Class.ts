import { Student } from "./Student";

/**
 * @author Stijn Prent
 * @description Class model for the class entity.
 */
export class Class {
    private _id?: number;
    private _name: string;
    private _gradeYear: number;
    private _subjectId: number;
    private _students: Student[];

    constructor(name: string, gradeYear: number, subjectId: number, students: Student[], id?: number) {
        this._id = id;
        this._name = name;
        this._gradeYear = gradeYear;
        this._subjectId = subjectId;
        this._students = students;
    }

  /**
   * @author Stijn Prent
   * @description Converts the class instance into a plain object with correct property names.
   */
  public toJSON() {
    return {
      id: this._id,
      name: this._name,
      gradeYear: this._gradeYear,
      subjectId: this._subjectId,
      students: this._students.map(student => ({
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName
      }))
    };
  }

    public get id(): number | undefined {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get gradeYear(): number {
        return this._gradeYear;
    }

    public get subjectId(): number {
        return this._subjectId;
    }

    public get students(): Student[] {
        return this._students;
    }
}
