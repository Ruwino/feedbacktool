import { StudentModel } from "./StudentModel";

/**
 * @author Stijn Prent
 * @description Class model for the class entity.
 */
export class ClassModel {
    private _id?: number;
    private _name: string;
    private _gradeYear: number;
    private _subjectId: number;
    private _students: StudentModel[];

    constructor(name: string, gradeYear: number, subjectId: number, students: StudentModel[], id?: number) {
        this._id = id;
        this._name = name;
        this._gradeYear = gradeYear;
        this._subjectId = subjectId;
        this._students = students;
    }

    public toJSON = (): Record<string, unknown> => {
        return {
            id: this.id,
            name: this.name,
            gradeYear: this.gradeYear,
            subjectId: this.subjectId,
            students: this.students.map(student => student.toJSON())
        };
    }

    public static fromClassId(classId: number): ClassModel {
        return new ClassModel("", 0, 0, [], classId);
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

    public get students(): StudentModel[] {
        return this._students;
    }

    public set students(value: StudentModel[]) {
        this._students = value;
    }
}
