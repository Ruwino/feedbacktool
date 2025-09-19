import { expect } from 'chai';
import sinon from 'sinon';
import { IClassRepository } from '../../Data/Interfaces/IClassRepository';
import { ClassService } from '../../Business/Service/ClassService';
import { ClassModel } from '../../Business/Models/ClassModel';
import { ClassRepository } from '../../Data/Repository/ClassRepository';
import { StudentModel } from "../../Business/Models/StudentModel";

describe('ClassService', () => {
    let classService: ClassService;
    let classRepository: IClassRepository;
    let addClassStub: sinon.SinonStub;
    let getClassesStub: sinon.SinonStub;

    beforeEach(() => {
        classRepository = new ClassRepository();
        addClassStub = sinon.stub(classRepository, 'addClass').resolves();
        getClassesStub = sinon.stub(classRepository, 'getClassesByEmail').resolves();
        classService = new ClassService(classRepository);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('addClass', () => {
        it('should successfully add a class', async () => {
            const newClass: ClassModel = new ClassModel(
                'Math 101',
                1,
                2,
                [
                    new StudentModel('student1@example.com', 'Alice', 'Doe'),
                    new StudentModel('student2@example.com', 'Bob', 'Smith')
                ]
            );

            await classService.addClass(newClass, 'teacher@email.com');

            expect(addClassStub.calledOnce).to.be.true;
            expect(addClassStub.calledWith(newClass)).to.be.true;
        });

        it('should throw an error if the repository fails', async () => {
            addClassStub.rejects(new Error('Database error'));

            const newClass = new ClassModel('Math 101', 1, 2, [
                new StudentModel('student1@example.com', 'Alice', 'Doe')
            ]);

            try {
                await classService.addClass(newClass, 'teacher@email.com');
            } catch (error: any) {
                expect(error.message).to.equal('Database error');
            }
        });
    });

    describe('getClasses', () => {
        it('should retrieve all available classes', async () => {
            const sessionId = 'valid-session-id';
            const expectedClasses = [
                new ClassModel('Math 101', 1, 2, []),
                new ClassModel('Science 101', 1, 2, [])
            ];

            getClassesStub.resolves(expectedClasses);

            const result = await classService.getClasses(sessionId);

            expect(result).to.deep.equal(expectedClasses);
            expect(getClassesStub.calledOnceWith(sessionId)).to.be.true;
        });

        it('should throw an error if sessionId is not provided', async () => {
            try {
                await classService.getClasses('');
            } catch (error: any) {
                expect(error.message).to.equal('Session ID is required');
            }
        });

        it('should throw an error if the repository fails', async () => {
            const sessionId = 'valid-session-id';
            getClassesStub.rejects(new Error('Database error'));

            try {
                await classService.getClasses(sessionId);
            } catch (error: any) {
                expect(error.message).to.equal('Database error');
            }
        });
    });
});