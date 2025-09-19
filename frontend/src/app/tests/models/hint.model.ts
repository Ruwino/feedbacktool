export class HintModel {
    private _id?: number;
    private _name: string;

    constructor(params: {
        id?: number,
        name: string,
    }) {
        this._id = params.id;
        this._name = params.name;
    }

    public toJSON() {
        return {
            id: this._id,
            hint: this._name
        };
    }

    public get id(): number | undefined {
        return this._id;
    }
    public get name(): string {
        return this._name;
    }
}