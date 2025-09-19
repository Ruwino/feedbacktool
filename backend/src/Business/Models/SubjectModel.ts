/**
 * @author Stijn Prent
 * @description Model for a subject.
 */

export class SubjectModel {
    private _id: number;
    private _name: string;

    constructor(id: number, name: string) {
        this._id = id;
        this._name = name;
    }

    public toJSON = (): Record<string, unknown> => {
        return {
            id: this.id,
            name: this.name
        }
    }

    public get name() {
        return this._name;
    }

    public get id() {
        return this._id;
    }

    public set name(value: any) {
        if (typeof(value) !== 'string') {
            throw new TypeError('Name must be a string.')
        }

        this._name = value;
    }

    public set id(value: any) {
        if (typeof(value) !== 'number' || value < 1) {
            throw new TypeError('Id must be a positive integer.')
        }

        this._id = value;
    }
}