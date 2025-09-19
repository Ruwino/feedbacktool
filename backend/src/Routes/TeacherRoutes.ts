import Container from '../container';
import {UserType} from '../Enums/UserType';
import {BaseRoutes} from './BaseRoutes';

export class TeacherRoutes extends BaseRoutes {
    constructor() {
        super([UserType.Teacher]);
    }

    protected registerRoutes() {
        this.router.get('/students/all',
            this.container.getStudentController().getStudents.bind(this.container.getStudentController()));

        this.router.get('/subjects/all',
            this.container.getSubjectController().getAllSubjects.bind(this.container.getSubjectController()));

        this.router.get('/subjects',
            this.container.getSubjectController().getSubjectsByTeacherEmail.bind(this.container.getSubjectController()));

        this.router.post('/student/grades',
            this.container.getGradeController().getStudentGradesByTeacher.bind(this.container.getGradeController()));

        this.router.post('/student/latest-grades',
            this.container.getGradeController().getLatestGradesForStudents.bind(this.container.getGradeController()));

        // class routes
        this.router.post('/class/add',
            this.container.getClassController().addClass.bind(this.container.getClassController()));

        this.router.post('/class/addStudents',
            this.container.getClassController().addStudentsToClass.bind(this.container.getClassController()));

        this.router.post('/class/removeStudent',
            this.container.getClassController().removeStudentFromClass.bind(this.container.getClassController()));

        this.router.get('/class/getall',
            this.container.getClassController().getClasses.bind(this.container.getClassController()));

        this.router.get('/class/getall',
            this.container.getClassController().getClasses.bind(this.container.getClassController()));

        this.router.get('/class/:id',
            this.container.getClassController().getClassById.bind(this.container.getClassController()));

        // stat routes
        this.router.get('/stats/class/average/:id',
            this.container.getStatController().getClassAverage.bind(this.container.getStatController()));

        this.router.get('/stats/class/worstObjective/:id',
            this.container.getStatController().getClassWorstObjective.bind(this.container.getStatController()));

        this.router.get('/stats/class/totalTests/:id',
            this.container.getStatController().getClassTotalTests.bind(this.container.getStatController()));

        // test routes
        this.router.get('/tests/class/:id',
            this.container.getTestController().getTestsByClassId.bind(this.container.getTestController()));

        this.router.post('/test/visibility',
            this.container.getTestController().setVisibility.bind(this.container.getTestController()));

        this.router.get('/test/:testId',
            this.container.getTestController().getTest.bind(this.container.getTestController()));

        this.router.post('/test/create',
            this.container.getTestController().createTest.bind(this.container.getTestController()));

        this.router.put('/test/edit',
            this.container.getTestController().updateTest.bind(this.container.getTestController()));
    }

    public getRoute(): string {
        return '/teacher'
    }
}