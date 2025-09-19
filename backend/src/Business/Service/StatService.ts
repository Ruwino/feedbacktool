import {StatRepository} from "../../Data/Repository/StatRepository";

export class StatService {
    private statRepository: StatRepository;

    constructor(statRepository: StatRepository) {
        this.statRepository = statRepository;
    }

    public async getBestObjective(email: string) {
        return await this.statRepository.getBestObjective(email);
    }

    public async getStreak(email: string) {
        return await this.statRepository.getStreak(email);
    }

    public async getMadeTests(email: string) {
        return await this.statRepository.getMadeTests(email);
    }

    public async getClassAverage(classId: number) {
        return await this.statRepository.getClassAverage(classId);
    }

    public getClassWorstObjective(classId: number) {
        return this.statRepository.getClassWorstObjective(classId);
    }

    public getClassTotalTests(classId: number) {
        return this.statRepository.getClassTotalTests(classId);
    }

    public async getRecommendedTests(email: string) {
        return await this.statRepository.getRecommendedTests(email);
    }
}