import Container from '../container';
import { UserType } from '../Enums/UserType';
import { BaseRoutes } from './BaseRoutes';

export class StudentRoutes extends BaseRoutes {
    constructor() {
        super([UserType.Student]);
    }

    protected registerRoutes() {
        this.router.post('/answer',
            this.container.getQuestionController().submitAnswer.bind(this.container.getQuestionController()));

        // stat routes
        this.router.get('/stat/bestObjective',
            this.container.getStatController().getBestObjective.bind(this.container.getStatController()));

        this.router.get('/stat/streak',
            this.container.getStatController().getStreak.bind(this.container.getStatController()));

        this.router.get('/stat/madeTests',
            this.container.getStatController().getMadeTests.bind(this.container.getStatController()));

        this.router.get('/subjects/tests',
            this.container.getSubjectController().getSubjectsWithTests.bind(this.container.getSubjectController()));

        this.router.get('/grades',
            this.container.getGradeController().getStudentOwnGrades.bind(this.container.getGradeController()));

        this.router.get('/stat/recommendedTests',
            this.container.getStatController().getRecommendedTests.bind(this.container.getStatController()));
    }

    public getRoute(): string {
        return '/student';
    }
}