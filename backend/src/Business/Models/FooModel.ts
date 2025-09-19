export class FooModel {
    private _id!: number;
    private _foo!: string;

    constructor(id: number, foo: string) {
        this.id = id;
        this.foo = foo;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        if(!value || value < 1) {
            throw new Error("Value can't be empty");
        }

        this._id = value;
    }

    get foo(): string {
        return this._foo;
    }

    set foo(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error("Foo value cannot be empty or whitespace");
        }

        this._foo = value;
    }
}