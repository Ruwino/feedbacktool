/**
 * @author Luka Piersma
 */

export class TeacherHintModel {
    private _id!: number | undefined;
    private _hint!: string;

    constructor(id: number | undefined, hint: string) {
        this.id = id;
        this.hint = hint;
    }

    public toJSON(): Record<string, any> {
        return {
            id: this.id,
            name: this.hint,
        }
    }

    public get id(): number | undefined {
        return this._id;
    }

    public get hint(): string {
        return this._hint;
    }

    public set id(value: any) {
        if (value !== undefined && (typeof value !== 'number' || value <= 0)) {
            throw new TypeError('Id must be a positive number or undefined.');
        }

        this._id = value;
    }

    public set hint(value: unknown) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new TypeError('Hint must be a non-empty string.');
        }

        this._hint = value;
    }
}
