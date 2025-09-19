export interface ILearningObjectiveRepository {
    getLearningObjectivesForTest(testId: number): Promise<string[]>;
  }