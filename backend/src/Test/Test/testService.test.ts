import { expect } from "chai";
import sinon from "sinon";

import { AnswerTestQuestionModel } from "../../Business/Models/AnswerTestQuestionModel";
import { TestService } from "../../Business/Service/TestService";
import { TestRepository } from "../../Data/Repository/TestRepository";
import { UserType } from "../../Enums/UserType";
import { AnswerResultModel } from "../../Business/Models/AnswerResultModel";
import { UnauthorizedError } from "../../Errors/UnauthorizedError";

describe('TestService', function () {
    let testService: any;
    let testRepositoryStub: any;

    beforeEach(() => {
        testRepositoryStub = sinon.createStubInstance(TestRepository);
        testService = new TestService(testRepositoryStub);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('answerTestQuestion', function () {
        it('should allow a user to answer a question successfully', async function () {
            const email = 'test@example.com';
            const answerModel = new AnswerTestQuestionModel(1, 1, 'Answer');

            testRepositoryStub.hasAccessToTestQuestion.resolves(true);
            testRepositoryStub.answerTestQuestion.resolves(new AnswerResultModel(true));

            const result = await testService.answerTestQuestion(email, UserType.Student, answerModel);
            expect(result).to.be.instanceOf(AnswerResultModel);
        });

        it('should throw an unauthorized error if user does not have access to the question', async function () {
            const email = 'test@example.com';
            const answerModel = new AnswerTestQuestionModel(1, 1, 'Answer');

            testRepositoryStub.hasAccessToTestQuestion.resolves(false);

            try {
                await testService.answerTestQuestion(email, UserType.Student, answerModel);
                throw new Error('Test should have failed');
            } catch (error: any) {
                expect(error).to.be.instanceOf(UnauthorizedError);
            }
        });
    });
});
