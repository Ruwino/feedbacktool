import Container from "../container";
import { UserType } from "../Enums/UserType";
import { BaseRoutes } from "./BaseRoutes";

/**
 * @author Roan Slingerland
 */
export class UserRoutes extends BaseRoutes {
    constructor() {
        super([...Object.values(UserType)]);
    }

    protected registerRoutes() {
        this.router.post('/logout',
            this.container.getLoginController().logout.bind(this.container.getLoginController()));

        this.router.get('/test/:testId/questions',
            this.container.getTestController().getTestQuestions.bind(this.container.getTestController()));

        this.router.post('/test/:testId/question/:questionId',
            this.container.getTestController().answerTestQuestion.bind(this.container.getTestController()));

        this.router.get('/test/:testId/finished',
            this.container.getTestController().hasCompletedTest.bind(this.container.getTestController()));

        this.router.get('/role',
            this.container.getAuthController().userRole.bind(this.container.getAuthController()));

        this.router.get('/test/:testId/getInfo',    
            this.container.getTestController().getTestData.bind(this.container.getTestController()));
    }

    public getRoute(): string {
        return '/user';
    }
}