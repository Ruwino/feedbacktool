import { GradeModel } from "./GradeModel";

/**
 * @author Rowin Schoon
 * @description View model voor het tonen van studenten cijfers met aanvullende informatie.
 */
export class StudentGradeViewModel {
    private _grade: GradeModel;
    private _firstName: string;
    private _lastName: string;
    private _subjectName: string;
    private _learningObjectives: string[];
    
    constructor(
        grade: GradeModel,
        firstName: string,
        lastName: string,
        subjectName: string,
        learningObjectives: string[] = []
    ) {
        this._grade = grade;
        this._firstName = firstName;
        this._lastName = lastName;
        this._subjectName = subjectName;
        this._learningObjectives = learningObjectives;
    }
    
    public toJSON = (): Record<string, unknown> => {
        return {
            testId: this._grade.testId,
            testName: this._grade.testName,
            subjectId: this._grade.subjectId,
            subjectName: this._subjectName,
            correctAnswers: this._grade.correctAnswers,
            firstName: this._firstName,
            lastName: this._lastName,
            totalQuestions: this._grade.totalQuestions,
            questionsWithIncorrect: this._grade.questionsWithIncorrect,
            learningObjectives: this._learningObjectives,
            scorePercentage: this._grade.scorePercentage,
        }
    }
    
    public get grade(): GradeModel {
        return this._grade;
    }
    
    public get firstName(): string {
        return this._firstName;
    }
    
    public get lastName(): string {
        return this._lastName;
    }
    
    public get subjectName(): string {
        return this._subjectName;
    }
    
    public get learningObjectives(): string[] {
        return this._learningObjectives;
    }
}