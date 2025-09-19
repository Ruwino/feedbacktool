import {StreakModel} from "../../Business/Models/StreakModel";
import {MadeTestsModel} from "../../Business/Models/MadeTestsModel";
import {TestModel} from "../../Business/Models/TestModel";

export interface IStatRepository {
    getMadeTests(userEmail: string): Promise<MadeTestsModel>;
    getStreak(userEmail: string): Promise<StreakModel>;
    getBestObjective(userEmail: string): Promise<string>;
    getClassAverage(classId: number): Promise<number>;
    getClassWorstObjective(classId: number): Promise<string>;
    getClassTotalTests(classId: number): Promise<number>;
    getRecommendedTests(userEmail: string): Promise<TestModel[]>;
}