/**
 * @author Latricha Seym
 * 
 */

import { ClassModel } from "./ClassModel";

export class TestModel {
    private _id;
    private _name;
    private _duration;
    private _visible;
    private _classes: ClassModel[] = [];


    constructor(id: number, name: string, duration: number, visible: boolean, classes: ClassModel[]) {
        this._id = id;
        this._name = name;
        this._duration = duration;
        this._visible = visible;
        this._classes = classes;
    }


    public toJSON = (): Record<string, unknown> => {
        return {
            id: this.id,
            name: this.name,
            duration: this.duration,
            visible: this.visible,
            classes: this.classes.map(c => c.toJSON())
        }
    }


    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get duration(): number {
        return this._duration;
    }

    public get visible(): boolean {
        return this._visible;
    }

    public get classes(): ClassModel[] {
        return this._classes;
    }
}
