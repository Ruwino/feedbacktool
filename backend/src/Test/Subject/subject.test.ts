import { expect, assert } from "chai";
import { SubjectService } from "../../Business/Service/SubjectService";
import sinon from "sinon";
import { SubjectRepository } from "../../Data/Repository/SubjectRepository";
import { SubjectTestModel } from "../../Business/Models/SubjectTestModel";
import { TestModel } from "../../Business/Models/TestModel";
import { Agent } from 'supertest';
import { AppBuilder } from '../../Creation/AppBuilder';
import { ClassRepository } from "../../Data/Repository/ClassRepository";


/**
 * Tests
 * 
 * Unit: 
 * 
 * 1. Should return a list of tests when calling /subject/get/tests.
 * 3. It should return a status 500 if the database connection fails.
 * 4. Should return an empty list if no tests are found for a given subject.
 * 
 * Integration: 
 * 
 * 
 */

describe("Subject", () => {
    let subjectService: any;
    let subjectRepository: SubjectRepository;
    let classRepository: ClassRepository;
    let getSubjectsWithTestsStub: sinon.SinonStub;


    beforeEach(() => {

        subjectRepository = new SubjectRepository()
        classRepository = new ClassRepository()
        subjectService = new SubjectService(subjectRepository, classRepository);

        getSubjectsWithTestsStub = sinon.stub(subjectService, "getSubjectsWithTests").resolves();

    });


    afterEach(() => {

        sinon.restore();
    })


    //Unit - Mocks the database
    describe("SubjectService - Unit", () => {


        it("should return a list of subjects with their associated tests", async () => {

            const scienceTests: TestModel[] = [
                new TestModel(3, "Physics Quiz", 45, true, []),
                new TestModel(4, "Chemistry Exam", 60, false, []),
            ];

            const historyTests: TestModel[] = [
                new TestModel(5, "Ancient History Test", 50, true, []),
                new TestModel(6, "Modern History Quiz", 40, false, []),
            ];

            const scienceSubject = new SubjectTestModel(102, "Science", scienceTests);
            const historySubject = new SubjectTestModel(103, "History", historyTests);


            const mockData: SubjectTestModel[] = [scienceSubject, historySubject]


            getSubjectsWithTestsStub.resolves(mockData)

            const result = await subjectService.getSubjectsWithTests();

            expect(result).to.deep.equal(mockData);
        });



        it("should return an empty list if there are no tests available", async () => {


            getSubjectsWithTestsStub.resolves([])

            const result = await subjectService.getSubjectsWithTests();


            expect(result).to.deep.equal([]);

        });


        it("should return a status 500 if the database connection fails", async () => {

            getSubjectsWithTestsStub.rejects(new Error("Database connection failed"));

            try {
                await subjectService.getSubjectsWithTests();
                assert.fail("Expected an error to be thrown");
            } catch (error: any) {
                expect(error.message).to.equal("Database connection failed");
            }
        });


    });

});