import {expect} from 'chai';
import {Agent} from 'supertest';
import {AppBuilder} from '../../Creation/AppBuilder';
import {TeacherRoutes} from '../../Routes/TeacherRoutes';
import {StudentRoutes} from "../../Routes/StudentRoutes";

import UserTable from '../../Data/Tables/UserTable';
import SessionTable from '../../Data/Tables/SessionTable';
import supertest from 'supertest';

describe('Stat E2E tests', () => {
    describe('Stat E2E student tests', () => {
        let appBuilder: AppBuilder;
        let agent: Agent;

        after(async () => {
            await appBuilder.closeServer();
        });

        before(async () => {
            appBuilder = new AppBuilder(true);
            appBuilder.setRoutes([new TeacherRoutes(), new StudentRoutes()]);
            await appBuilder.startServer(1);

            const student = await UserTable.create({
                email: 'user2@example.com',
                password_hash: 'hashedpassword1',
                first_name: 'Jane',
                last_name: 'Doe',
                user_type_id: 1
            });

            const studentSession = await SessionTable.create({
                id: '2',
                expiration_date: new Date(new Date().setDate(new Date().getDate() + 30)),
                user_email: student.email
            });

            agent = supertest.agent(appBuilder.getApp());
            agent.jar.setCookie(`sessionId=${studentSession.id}`);
        });

        it('should retrieve the best objective for a student', async () => {
            const response = await agent.get('/student/stat/bestObjective');
            expect(response.status).to.equal(200);
            expect(response.body).to.be.a('string');
        });

        it('should retrieve the streak for a student', async () => {
            const response = await agent.get('/student/stat/streak');
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('currentStreak');
            expect(response.body).to.have.property('longestStreak');
            expect(response.body.currentStreak).to.be.a('number');
            expect(response.body.longestStreak).to.be.a('number');
        });

        it('should retrieve the made tests for a student', async () => {
            const response = await agent.get('/student/stat/madeTests');
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('allTests');
            expect(response.body).to.have.property('currentWeek');
            expect(response.body.allTests).to.be.a('number');
            expect(response.body.currentWeek).to.be.a('number');
        });
    });

    describe('Stat E2E teacher tests', () => {
        let appBuilder: AppBuilder;
        let agent: Agent;

        after(async () => {
            await appBuilder.closeServer();
        });

        before(async () => {
            appBuilder = new AppBuilder();
            appBuilder.setRoutes([new TeacherRoutes(), new StudentRoutes()]);
            await appBuilder.startServer(1);
            const teacher = await UserTable.create({
                email: 'user@example.com',
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

            agent = supertest.agent(appBuilder.getApp());
            agent.jar.setCookie(`sessionId=${teacherSession.id}`);
        });

        it('should retrieve the class average for a given class ID', async () => {
            const response = await agent.get('/teacher/stats/class/average/1');
            expect(response.status).to.equal(200);
            expect(response.body).to.be.a('number');
        });

        it('should retrieve the worst objective for a given class ID', async () => {
            const response = await agent.get('/teacher/stats/class/worstObjective/1');
            expect(response.status).to.equal(200);
            expect(response.body).to.be.a('string');
        });

        it('should retrieve the total tests for a given class ID', async () => {
            const response = await agent.get('/teacher/stats/class/totalTests/1');
            expect(response.status).to.equal(200);
            expect(response.body).to.be.a('number');
        });
    });
});