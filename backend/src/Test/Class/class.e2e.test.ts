import { expect } from 'chai';
import { Agent } from 'supertest';
import { AppBuilder } from '../../Creation/AppBuilder';
import { TeacherRoutes } from '../../Routes/TeacherRoutes';

import UserTable from '../../Data/Tables/UserTable';
import SessionTable from '../../Data/Tables/SessionTable';
import supertest from 'supertest';

describe('Class E2E Tests', () => {
    let appBuilder: AppBuilder;
    let agent: Agent
    

    after(async () => {
        appBuilder.closeServer();
    })

    before(async () => {
        appBuilder = new AppBuilder();
        appBuilder.setRoutes([
            new TeacherRoutes()
        ]);

        await appBuilder.startServer(1);

        const teacher = await UserTable.create({
            email: 'teacher@example.com',
            password_hash: 'hashedpassword1',
            first_name: 'John',
            last_name: 'Doe',
            user_type_id: 2
        });

        const teacherSession = await SessionTable.create({
            id: '1',
            expiration_date: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days in the future,
            user_email: teacher.email
        });

        agent = supertest.agent(appBuilder.getApp());
        agent.jar.setCookie(`sessionId=${teacherSession.id}`);
    });

    it('should retrieve all available classes', async () => {
        const response = await agent.get('/teacher/class/getall');

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });
});