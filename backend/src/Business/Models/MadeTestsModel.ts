export class MadeTestsModel {
    private _allTests: number;
    private _currentWeek: number;

    constructor(allTests: number, currentWeek: number) {
        this._allTests = allTests;
        this._currentWeek = currentWeek;
    }

    public toJSON = (): Record<string, unknown> => {
        return {
            allTests: this._allTests,
            currentWeek: this._currentWeek
        };
    }

    public get allTests(): number {
        return this._allTests;
    }

    public get currentWeek(): number {
        return this._currentWeek;
    }
}