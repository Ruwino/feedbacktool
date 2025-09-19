export class Subject {
    private _id: number;
    private _name: string;

    constructor(id: number, name: string) {
        this._id = id;
        this._name = name;
    }

    public get name() {
        return this._name;
    }

    public get id() {
        return this._id;
    }
}
