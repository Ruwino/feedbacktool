export class StreakModel {
    private _currentStreak: number;
    private _longestStreak: number;

    constructor(currentStreak: number, longestStreak: number) {
        this._currentStreak = currentStreak;
        this._longestStreak = longestStreak;
    }

    public toJSON = (): Record<string, unknown> => {
        return {
            currentStreak: this._currentStreak,
            longestStreak: this._longestStreak
        };
    }

    public get currentStreak(): number {
        return this._currentStreak;
    }

    public get longestStreak(): number {
        return this._longestStreak;
    }
}