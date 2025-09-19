import { expect } from 'chai';
import { TeacherTestModel } from '../../Business/Models/TeacherTestModel';
import { TeacherQuestionModel } from '../../Business/Models/TeacherQuestionModel';
import { SubjectType } from '../../Enums/SubjectType';
import { QuestionType } from '../../Enums/QuestionType';
import { TeacherAnswerModel } from '../../Business/Models/TeacherAnswerModel';
import { TeacherHintModel } from '../../Business/Models/TeacherHintModel';
import { TeacherObjectiveModel } from '../../Business/Models/TeacherObjectiveModel';

describe('TeacherTestModel', function () {
    let testModel: TeacherTestModel;
    let validQuestions: TeacherQuestionModel[];

    beforeEach(() => {
        validQuestions = [
            new TeacherQuestionModel(1, QuestionType.MultipleChoice, 'What is 2+2?', 0, [
                new TeacherAnswerModel(1, '4', true),
                new TeacherAnswerModel(2, '5', false),
                new TeacherAnswerModel(3, '7', false)
            ], [new TeacherHintModel(1, 'Think of addition')]),
        ];

        testModel = new TeacherTestModel(
            1,
            'Math Test',
            SubjectType.Math,
            30,
            true,
            [new TeacherObjectiveModel(1, 'Math basics')],
            validQuestions
        );
    });

    describe('Constructor', function () {
        it('should create a valid TeacherTestModel instance', function () {
            expect(testModel).to.be.instanceOf(TeacherTestModel);
            expect(testModel.id).to.equal(1);
            expect(testModel.name).to.equal('Math Test');
            expect(testModel.subject).to.equal(SubjectType.Math);
            expect(testModel.duration).to.equal(30);
            expect(testModel.randomized).to.be.true;
            expect(testModel.learningObjectives).to.deep.equal([new TeacherObjectiveModel(1, 'Math basics')]);
            expect(testModel.questions).to.deep.equal(validQuestions);
        });

        it('should throw an error if duration is less than 10', function () {
            expect(() => new TeacherTestModel(1, 'Short Test', SubjectType.Math, 5, false, [new TeacherObjectiveModel(1, 'Math basics')], validQuestions))
                .to.throw('Duration must be 10 or greater');
        });

        it('should throw an error if name is empty', function () {
            expect(() => new TeacherTestModel(1, '', SubjectType.Math, 30, false, [new TeacherObjectiveModel(1, 'Math basics')], validQuestions))
                .to.throw('Name must be a non-empty string.');
        });

        it('should throw an error if learning objectives are empty', function () {
            expect(() => new TeacherTestModel(1, 'Test', SubjectType.Math, 30, false, [], validQuestions))
                .to.throw('Learning objectives cannot be empty.');
        });

        it('should throw an error if a question does not match a learning objective', function () {
            const invalidQuestions = [
                new TeacherQuestionModel(2, QuestionType.MultipleChoice, 'What is gravity?', 2, [
                    new TeacherAnswerModel(1, 'Force', true),
                    new TeacherAnswerModel(2, 'Speed', false)
                ], [new TeacherHintModel(1, 'Think about falling')])
            ];

            expect(() => new TeacherTestModel(1, 'Test', SubjectType.Math, 30, false, [new TeacherObjectiveModel(1, 'Math basics')], invalidQuestions))
                .to.throw('Question must have a valid learningObjectiveIndex');
        });
    });

    describe('Getters & Setters', function () {
        it('should update name correctly', function () {
            testModel.name = 'New Name';
            expect(testModel.name).to.equal('New Name');
        });

        it('should throw an error if setting an invalid duration', function () {
            expect(() => (testModel.duration = 5)).to.throw('Duration must be 10 or greater');
        });

        it('should throw an error if setting an empty name', function () {
            expect(() => (testModel.name = '')).to.throw('Name must be a non-empty string.');
        });

        it('should correctly update questions', function () {
            const newQuestions = [
                new TeacherQuestionModel(2, QuestionType.MultipleChoice, 'What is 5+5?', 0, [
                    new TeacherAnswerModel(1, '10', true),
                    new TeacherAnswerModel(2, '5', false)
                ], [new TeacherHintModel(1, 'Think of addition')]),
            ];
            testModel.questions = newQuestions;
            expect(testModel.questions).to.deep.equal(newQuestions);
        });

        it('should throw an error if setting questions with an invalid learning objective', function () {
            const invalidQuestions = [
                new TeacherQuestionModel(3, QuestionType.MultipleChoice, 'What is DNA?', 5, [
                    new TeacherAnswerModel(1, 'Genetic Code', true),
                    new TeacherAnswerModel(2, 'Protein', false)
                ], [new TeacherHintModel(1, 'Think about life')]),
            ];

            expect(() => (testModel.questions = invalidQuestions))
                .to.throw('Question must have a valid learningObjectiveIndex');
        });
    });

    describe('toJSON()', function () {
        it('should return a valid JSON object', function () {
            const json = testModel.toJSON();
            expect(json).to.deep.equal({
                id: 1,
                name: 'Math Test',
                subject: SubjectType.Math,
                duration: 30,
                randomized: true,
                learningObjectives: [new TeacherObjectiveModel(1, 'Math basics')],
                questions: validQuestions.map(q => q.toJSON()),
                canEdit: false
            });
        });
    });
});
