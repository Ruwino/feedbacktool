import supertest, { Agent } from 'supertest';

import UserTable from '../../Data/Tables/UserTable';
import SessionTable from '../../Data/Tables/SessionTable';

import { AppBuilder } from '../../Creation/AppBuilder';
import { SubjectType } from '../../Enums/SubjectType';
import { TeacherRoutes } from '../../Routes/TeacherRoutes';
import { QuestionType } from '../../Enums/QuestionType';
import TestTable from '../../Data/Tables/TestTable';
import { expect } from 'chai';

/**
 * @author Luka Piersma
 */

describe('Teacher Test endpoints', function () {
    let agent: Agent;
    let agent2: Agent;
    let appBuilder: AppBuilder;

    after(async () => {
        await appBuilder.closeServer();
    })

    before(async () => {
        appBuilder = new AppBuilder();
        appBuilder.setRoutes([
            new TeacherRoutes()
        ]);

        await appBuilder.startServer(1);

        const teacher = await UserTable.create({
            email: 'teacher1@example.com',
            password_hash: 'hashedpassword1',
            first_name: 'John',
            last_name: 'Doe',
            user_type_id: 2
        });

        const teacherSession = await SessionTable.create({
            id: '1',
            expiration_date: new Date(new Date().setDate(new Date().getDate() + 30)),
            user_email: teacher.email
        });

        const teacher2 = await UserTable.create({
            email: 'teacher2@example.com',
            password_hash: 'hashedpassword1',
            first_name: 'John',
            last_name: 'Doe',
            user_type_id: 2
        });

        const teacherSession2 = await SessionTable.create({
            id: '2',
            expiration_date: new Date(new Date().setDate(new Date().getDate() + 30)),
            user_email: teacher2.email
        });

        agent = supertest.agent(appBuilder.getApp());
        agent.jar.setCookie(`sessionId=${teacherSession.id}`);

        agent2 = supertest.agent(appBuilder.getApp());
        agent2.jar.setCookie(`sessionId=${teacherSession2.id}`);
    });

    describe('POST teacher/test/create', function () {
        it('response should be 201 when trying to create a valid test', async function () {
            await agent
                .post('/teacher/test/create')
                .send({
                    name: 'New Test',
                    duration: 45,
                    subject: SubjectType.Math,
                    randomized: false,
                    learningObjectives: [{objective: 'Learn fractions'}, {objective: 'Learn more fractions 2'}],
                    questions: [
                        {
                            question: 'What is 1/2 + 1/2?',
                            type: QuestionType.MultipleChoice,
                            answers: [
                                { answer: '1', correct: true },
                                { answer: '0.5', correct: false }
                            ],
                            learningObjectiveIndex: 0,
                            hints: []
                        },
                        {
                            question: 'What is 1/2 + 1/2?',
                            type: QuestionType.MultipleChoice,
                            answers: [
                                { answer: '1', correct: true },
                                { answer: '0.5', correct: false }
                            ],
                            learningObjectiveIndex: 0,
                            hints: []
                        },
                        {
                            question: 'What is 1/2 + 1/2?',
                            type: QuestionType.MultipleChoice,
                            answers: [
                                { answer: '1', correct: true },
                                { answer: '0.5', correct: false }
                            ],
                            learningObjectiveIndex: 1,
                            hints: []
                        }
                    ]
                })
                .expect(201);
        });
    
        it('response should be 400 when trying to create an invalid test', async function () {
            await agent
            .post('/teacher/test/create')
            .send({
                name: 'New Test',
                learningObjectives: [{objective: 'Learn fractions'}],
            })
            .expect(400);
        });
    });

    describe('GET /test/:testId', function () {   
        it('response should be Not Found when trying to get a test with testId that does not exist.', async function () {
            await agent
                .get(`/teacher/test/${999}`)
                .send({
                    answer: '4'
                })
                .expect(404);
        });

        it('response should be OK when trying to get a test with testId that does exist.', async function () {
            await agent
                .get(`/teacher/test/${999}`)
                .send({
                    answer: '4'
                })
                .expect(404);
        });

        it('response should be BadRequest when trying to get a test with testId that is invalid.', async function () {
            await agent
                .get(`/teacher/test/invalid`)
                .send({
                    answer: '4'
                })
                .expect(400);
        });
    });

    describe('PUT /test/edit', function () {
        it('response should be 204 when trying to update a test that exists with a valid request body.', async function () {
            const response = await agent
                .post('/teacher/test/create')
                .send({
                    name: 'New Test',
                    duration: 45,
                    subject: SubjectType.Math,
                    randomized: false,
                    learningObjectives: [{objective: 'Learn fractions'}, {objective: 'Learn more fractions'}],
                    questions: [
                        {
                            question: 'What is 1/2 + 1/2?',
                            type: QuestionType.MultipleChoice,
                            answers: [
                                { answer: '1', correct: true },
                                { answer: '0.5', correct: false }
                            ],
                            learningObjectiveIndex: 0,
                            hints: []
                        },
                        {
                            question: 'What is 1/2 + 1/2?',
                            type: QuestionType.MultipleChoice,
                            answers: [
                                { answer: '1', correct: true },
                                { answer: '0.5', correct: false }
                            ],
                            learningObjectiveIndex: 0,
                            hints: []
                        },
                        {
                            question: 'What is 1/2 + 1/2?',
                            type: QuestionType.MultipleChoice,
                            answers: [
                                { answer: '1', correct: true },
                                { answer: '0.5', correct: false }
                            ],
                            learningObjectiveIndex: 1,
                            hints: []
                        }
                    ]
                })
                .expect(201);

            const testId = response.body;

            const response2 = await agent
                .put(`/teacher/test/edit`)
                .send({
                    id: testId,
                    name: 'Updated test name',
                    duration: 45,
                    subject: SubjectType.Math,
                    randomized: false,
                    learningObjectives: [{objective: 'Learn fractions 2'}, {objective: 'Learn more fractions 3'}],
                    questions: [
                        {
                            question: 'What is 1/2 + 1/2?',
                            type: QuestionType.MultipleChoice,
                            answers: [
                                { answer: '1', correct: true },
                                { answer: '0.5', correct: false }
                            ],
                            learningObjectiveIndex: 0,
                            hints: []
                        },
                        {
                            question: 'What is 1/2 + 1/2?',
                            type: QuestionType.MultipleChoice,
                            answers: [
                                { answer: '1', correct: true },
                                { answer: '0.5', correct: false }
                            ],
                            learningObjectiveIndex: 1,
                            hints: []
                        },
                        {
                            question: 'What is 1/2 + 1/2?',
                            type: QuestionType.MultipleChoice,
                            answers: [
                                { answer: '1', correct: true },
                                { answer: '0.5', correct: false }
                            ],
                            learningObjectiveIndex: 1,
                            hints: []
                        }
                    ]
                })
                
                expect(response2.status).to.equal(204);


                const test = await TestTable.findByPk(testId);

                expect(test?.name).to.equal('Updated test name');
        });

        it('response should be 400 when trying to update a test that exists with an invalid request body.', async function () {
            const response = await agent
                .post('/teacher/test/create')
                .send({
                    name: 'New Test',
                    duration: 45,
                    subject: SubjectType.Math,
                    randomized: false,
                    learningObjectives: [{objective: 'Learn fractions'}, {objective: 'Learn more fractions'}],
                    questions: [
                        {
                            question: 'What is 1/2 + 1/2?',
                            type: QuestionType.MultipleChoice,
                            answers: [
                                { answer: '1', correct: true },
                                { answer: '0.5', correct: false }
                            ],
                            learningObjectiveIndex: 0,
                            hints: []
                        },
                        {
                            question: 'What is 1/2 + 1/2?',
                            type: QuestionType.MultipleChoice,
                            answers: [
                                { answer: '1', correct: true },
                                { answer: '0.5', correct: false }
                            ],
                            learningObjectiveIndex: 0,
                            hints: []
                        },
                        {
                            question: 'What is 1/2 + 1/2?',
                            type: QuestionType.MultipleChoice,
                            answers: [
                                { answer: '1', correct: true },
                                { answer: '0.5', correct: false }
                            ],
                            learningObjectiveIndex: 0,
                            hints: []
                        }
                    ]
                })
                .expect(201);

            const testId = response.body;

            await agent
                .put(`/teacher/test/edit`)
                .send({
                    id: testId,
                    name: 'Updated test name',
                    duration: 45,
                    subject: SubjectType.Math,
                    randomized: false,
                    learningObjectives: [{objective: 'Learn fractions'}, {objective: 'Learn more fractions'}],
                    questions: [
                    ]
                })
                .expect(400);

            const test = await TestTable.findByPk(testId);

            expect(test?.name).to.equal('New Test');
        });

        it('response should be 401 when trying to update a test that the teacher does not own.', async function () {
            const response = await agent
                .post('/teacher/test/create')
                .send({
                    name: 'New Test',
                    duration: 45,
                    subject: SubjectType.Math,
                    randomized: false,
                    learningObjectives: [{objective: 'Learn fractions'}, {objective: 'Learn more fractions'}],
                    questions: [
                        {
                            question: 'What is 1/2 + 1/2?',
                            type: QuestionType.MultipleChoice,
                            answers: [
                                { answer: '1', correct: true },
                                { answer: '0.5', correct: false }
                            ],
                            learningObjectiveIndex: 0,
                            hints: []
                        },
                        {
                            question: 'What is 1/2 + 1/2?',
                            type: QuestionType.MultipleChoice,
                            answers: [
                                { answer: '1', correct: true },
                                { answer: '0.5', correct: false }
                            ],
                            learningObjectiveIndex: 0,
                            hints: []
                        },
                        {
                            question: 'What is 1/2 + 1/2?',
                            type: QuestionType.MultipleChoice,
                            answers: [
                                { answer: '1', correct: true },
                                { answer: '0.5', correct: false }
                            ],
                            learningObjectiveIndex: 1,
                            hints: []
                        }
                    ]
                })
                .expect(201);

            const testId = response.body;

            await agent2
                .put(`/teacher/test/edit`)
                .send({
                    id: testId,
                    name: 'Updated test name',
                    duration: 45,
                    subject: SubjectType.Math,
                    randomized: false,
                    learningObjectives: [{objective: 'Learn fractions'}, {objective: 'Learn more fractions'}],
                    questions: [
                        {
                            question: 'What is 1/2 + 1/2?',
                            type: QuestionType.MultipleChoice,
                            answers: [
                                { answer: '1', correct: true },
                                { answer: '0.5', correct: false }
                            ],
                            learningObjectiveIndex: 0,
                            hints: []
                        },
                    ]
                })
                .expect(401);

            const test = await TestTable.findByPk(testId);

            expect(test?.name).to.equal('New Test');
        });

        it('updating a test should update the test inside the database correctly.', async function () {
            const response = await agent
              .post('/teacher/test/create')
              .send({
                name: 'New Test',
                duration: 45,
                subject: SubjectType.Math,
                randomized: false,
                learningObjectives: [{objective: 'Learn fractions'}],
                questions: [
                  {
                    question: 'What is 1/2 + 1/2?',
                    type: QuestionType.MultipleChoice,
                    answers: [
                      { answer: '1', correct: true },
                      { answer: '0.5', correct: false }
                    ],
                    learningObjectiveIndex: 0,
                    hints: []
                  }
                ]
              })
              .expect(201);
          
            const testId = response.body;
          
            await agent
              .put(`/teacher/test/edit`)
              .send({
                id: testId,
                name: 'Updated test name',
                duration: 47,
                subject: SubjectType.Biology,
                randomized: true,
                learningObjectives: [{objective: 'Learn fractions 2'}, {objective: 'Estimate values'}],
                questions: [
                  {
                    question: 'What is 1/4 + 1/2?',
                    type: QuestionType.MultipleChoice,
                    answers: [
                      { answer: '2', correct: false },
                      { answer: '0.75', correct: true }
                    ],
                    learningObjectiveIndex: 0,
                    hints: [{hint: 'Hint 1'}]
                  },
                  {
                    question: 'What is roughly 2/3 of 100?',
                    type: QuestionType.MultipleChoice,
                    answers: [
                      { answer: '66', correct: true },
                      { answer: '70', correct: false }
                    ],
                    learningObjectiveIndex: 1,
                    hints: [{hint: 'Hint 2'}]
                  }
                ]
              })
              .expect(204);
          
            const test = await TestTable.findByPk(testId);

            if (!test) throw new Error('Test not found');

            expect(test.name).to.equal('Updated test name');
          
            const questions = await test.$get('questions');

            expect(questions.length).to.equal(2);
          
            const firstQuestion = questions.find(q => q.question.includes('1/4'));
            const secondQuestion = questions.find(q => q.question.includes('2/3'));

            if (!firstQuestion || !secondQuestion) throw new Error('Questions not found');
          
            const firstObjective = await firstQuestion.$get('objectives');
            const secondObjective = await secondQuestion.$get('objectives');
          
            expect(firstObjective[0].description).to.equal('Learn fractions 2');
            expect(secondObjective[0].description).to.equal('Estimate values');
          
            const firstAnswers = await firstQuestion.$get('answers');
            const secondAnswers = await secondQuestion.$get('answers');
          
            expect(firstAnswers.find(a => a.answer === '0.75')?.correct).to.be.true;
            expect(secondAnswers.find(a => a.answer === '66')?.correct).to.be.true;
          
            const firstHints = await firstQuestion.$get('hints');
            const secondHints = await secondQuestion.$get('hints');
          
            expect(firstHints[0].hint).to.equal('Hint 1');
            expect(secondHints[0].hint).to.equal('Hint 2');
          });
    });
});
