export class MadeTestsModel {
    private _allTests: number;
    private _currentWeek: number;

    constructor(allTests: number, currentWeek: number) {
        this._allTests = allTests;
        this._currentWeek = currentWeek;
    }

    public get allTests(): number {
        return this._allTests;
    }

    public get currentWeek(): number {
        return this._currentWeek;
    }
}
