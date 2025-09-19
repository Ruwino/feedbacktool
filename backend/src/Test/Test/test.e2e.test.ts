import { expect } from 'chai';
import supertest, { Agent } from 'supertest';
import TestTable from '../../Data/Tables/TestTable';
import QuestionTable from '../../Data/Tables/QuestionTable';
import AnswerTable from '../../Data/Tables/AnswerTable';
import ClassHasUser from '../../Data/Tables/ClassHasUser';
import ClassTable from '../../Data/Tables/ClassTable';
import UserTable from '../../Data/Tables/UserTable';
import ClassHasTestTable from '../../Data/Tables/ClassHasTestTable';
import SessionTable from '../../Data/Tables/SessionTable';
import SubjectTable from '../../Data/Tables/SubjectTable';
import Container from '../../container';
import TestHasQuestionTable from '../../Data/Tables/TestHasQuestionTable';

import { AppBuilder } from '../../Creation/AppBuilder';
import { UserRoutes } from '../../Routes/UserRoutes';
import LearningObjectiveTable from '../../Data/Tables/LearningObjectiveTable';
import { SubjectType } from '../../Enums/SubjectType';
import { TeacherRoutes } from '../../Routes/TeacherRoutes';

describe('Test endpoints', function () {
    let agent: Agent;
    let unauthorizedAgent: Agent;
    let appBuilder: AppBuilder;

    let testId: number
    let questionId: number

    after(async () => {
        await appBuilder.closeServer();
    })

    before(async () => {
        appBuilder = new AppBuilder();
        appBuilder.setRoutes([
            new UserRoutes()
        ]);

        await appBuilder.startServer(1);

        const student = await UserTable.create({
            email: 'student1@example.com',
            password_hash: 'hashedpassword1',
            first_name: 'John',
            last_name: 'Doe',
            user_type_id: 1
        });

        const unauthorizedStudent = await UserTable.create({
            email: 'student2@example.com',
            password_hash: 'hashedpassword1',
            first_name: 'John',
            last_name: 'Doe',
            user_type_id: 1
        });

        const teacher = await UserTable.create({
            email: 'teacher@example.com',
            password_hash: 'hashedpassword1',
            first_name: 'John',
            last_name: 'Doe',
            user_type_id: 2
        });

        const session = await SessionTable.create({
            id: '1',
            expiration_date: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days in the future,
            user_email: student.email
        });

        const unauthorizedSession = await SessionTable.create({
            id: '2',
            expiration_date: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days in the future,
            user_email: unauthorizedStudent.email
        });

        const mathSubject = await SubjectTable.create({
            name: 'Math'
        });

        const mathClass = await ClassTable.create({
            name: 'Math 1',
            grade_year: 1,
            subject_id: mathSubject.id
        });

        await ClassHasUser.create({
            class_id: mathClass.id,
            user_email: student.email
        });

        const mathTest = await TestTable.create({
            name: 'Math Test',
            duration: 60,
            randomized: true,
            subject_id: mathSubject.id,
            creator_email: teacher.email
        });

        const learningObjective = await LearningObjectiveTable.create({
            description: 'Learn the basics of addition.'
        })

        const question = await QuestionTable.create({
            question: 'What is 2 + 2?',
            question_type_id: 1
        });

        const answer1 = await AnswerTable.create({
            answer: '4',
            correct: true
        });

        const answer2 = await AnswerTable.create({
            answer: '5',
            correct: true
        });

        await question.$add('answers', answer1);
        await question.$add('answers', answer2);
        await question.$add('objectives', learningObjective);
        await mathTest.$add('questions', question);

        await ClassHasTestTable.create({
            class_id: mathClass.id,
            test_id: mathTest.id,
            visible: true
        });

        TestHasQuestionTable.create({
            test_id: testId,
            question_id: questionId
        });

        agent = supertest.agent(appBuilder.getApp());
        unauthorizedAgent = supertest.agent(appBuilder.getApp());

        agent.jar.setCookie(`sessionId=${session.id}`);
        unauthorizedAgent.jar.setCookie(`sessionId=${unauthorizedSession.id}`);

        testId = mathTest.id;
        questionId = question.id;
    });

    describe('GET /test/:testId/questions', function () {
        it('response should be 200 when user gets questions of valid test', async function () {
            await agent.get(`/user/test/${testId}/questions`).expect(200);
        });

        it('response should be 401 when user gets questions of test that they dont have access to', async function () {
            await unauthorizedAgent.get(`/user/test/${testId}/questions`).expect(401);
        });
    });

    describe('POST /test/:testId/question/:questionId', function () {
        it('response should be true when user submits a correct answer', async function () {
            const res = await agent
                .post(`/user/test/${testId}/question/${questionId}`)
                .send({
                    answer: '4'
                })
                .expect(200);

            expect(res.body._correct).to.be.true;
        });

        it('response should be false when user submits an incorrect answer', async function () {
            const res = await agent
                .post(`/user/test/${testId}/question/${questionId}`)
                .send({
                    answer: 'incorrect'
                })
                .expect(200);

            expect(res.body._correct).to.be.false;
        });

        it('response should be bad request when user submits an invalid request body', async function () {
            await agent
                .post(`/user/test/${testId}/question/${questionId}`)
                .send({
                    answer: ''
                })
                .expect(400);

            await agent
                .post(`/user/test/${testId}/question/${questionId}`)
                .send({
                    answer: 1
                })
                .expect(400);

            await agent
                .post(`/user/test/${testId}/question/${questionId}`)
                .expect(400);
        });

        it('response should be unauthorized when user is not authorized', async function () {
            await unauthorizedAgent
                .post(`/user/test/${testId}/question/${questionId}`)
                .send({
                    answer: '4'
                })
                .expect(401);
        });
    });
});
