
export class TestModel {
    private _id: number;
    private _name: string;
    private _startDate: string;
    private _duration: number;
    private _visible: boolean | undefined;


    constructor(id: number, name: string, startDate: string, duration: number, visible?: boolean) {
        this._id = id;
        this._name = name;
        this._startDate = startDate;
        this._duration = duration;
        this._visible = visible;
    }

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get startDate(): string {
        return this._startDate;
    }

    public get duration(): number {
        return this._duration;
    }

    public get visible(): boolean | undefined {
        return this._visible;
    }

    public set visible(visible: boolean | undefined) {
        this._visible = visible;
    }
}
