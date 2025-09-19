export interface IAnswerRepository {
    getStudentAnswersForTest(studentEmail: string, testId: number, questionIds: number[]): Promise<any[]>;
    isAnswerCorrect(questionId: number, answer: string): Promise<boolean>;
    getLatestAnswerTimestamp(studentEmail: string, testId: number): Promise<Date | null>;
  }