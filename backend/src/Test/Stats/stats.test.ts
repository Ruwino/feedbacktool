import { expect } from 'chai';
import sinon from 'sinon';
import { IStatRepository } from '../../Data/Interfaces/IStatRepository';
import { StatService } from '../../Business/Service/StatService';
import { StatRepository } from '../../Data/Repository/StatRepository';
import { MadeTestsModel } from '../../Business/Models/MadeTestsModel';
import { StreakModel } from '../../Business/Models/StreakModel';

describe('StatService', () => {
    let statService: StatService;
    let statRepository: IStatRepository;
    let getBestObjectiveStub: sinon.SinonStub;
    let getStreakStub: sinon.SinonStub;
    let getMadeTestsStub: sinon.SinonStub;
    let getClassAverageStub: sinon.SinonStub;
    let getClassWorstObjectiveStub: sinon.SinonStub;
    let getClassTotalTestsStub: sinon.SinonStub;

    beforeEach(() => {
        statRepository = new StatRepository();
        getBestObjectiveStub = sinon.stub(statRepository, 'getBestObjective').resolves();
        getStreakStub = sinon.stub(statRepository, 'getStreak').resolves();
        getMadeTestsStub = sinon.stub(statRepository, 'getMadeTests').resolves();
        getClassAverageStub = sinon.stub(statRepository, 'getClassAverage').resolves();
        getClassWorstObjectiveStub = sinon.stub(statRepository, 'getClassWorstObjective').resolves();
        getClassTotalTestsStub = sinon.stub(statRepository, 'getClassTotalTests').resolves();
        statService = new StatService(statRepository);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getBestObjective', () => {
        it('returns the best objective for a given email', async () => {
            const email = 'test@example.com';
            const expectedObjective = 'Best Objective';
            getBestObjectiveStub.resolves(expectedObjective);

            const result = await statService.getBestObjective(email);

            expect(result).to.equal(expectedObjective);
        });
    });

    describe('getStreak', () => {
        it('returns the streak for a given email', async () => {
            const email = 'test@example.com';
            const expectedStreak = new StreakModel(5, 10);
            getStreakStub.resolves(expectedStreak);

            const result = await statService.getStreak(email);

            expect(result).to.deep.equal(expectedStreak);
        });
    });

    describe('getMadeTests', () => {
        it('returns the made tests for a given email', async () => {
            const email = 'test@example.com';
            const expectedMadeTests = new MadeTestsModel(10, 2);
            getMadeTestsStub.resolves(expectedMadeTests);

            const result = await statService.getMadeTests(email);

            expect(result).to.deep.equal(expectedMadeTests);
        });
    });

    describe('getClassAverage', () => {
        it('returns the class average for a given class ID', async () => {
            const classId = 1;
            const expectedAverage = 85;
            getClassAverageStub.resolves(expectedAverage);

            const result = await statService.getClassAverage(classId);

            expect(result).to.equal(expectedAverage);
        });
    });

    describe('getClassWorstObjective', () => {
        it('returns the worst objective for a given class ID', async () => {
            const classId = 1;
            const expectedWorstObjective = 'Worst Objective';
            getClassWorstObjectiveStub.resolves(expectedWorstObjective);

            const result = await statService.getClassWorstObjective(classId);

            expect(result).to.equal(expectedWorstObjective);
        });
    });

    describe('getClassTotalTests', () => {
        it('returns the total tests for a given class ID', async () => {
            const classId = 1;
            const expectedTotalTests = 20;
            getClassTotalTestsStub.resolves(expectedTotalTests);

            const result = await statService.getClassTotalTests(classId);

            expect(result).to.equal(expectedTotalTests);
        });
    });
});