import { Transaction } from "sequelize";
import { TeacherObjectiveModel } from "../../Business/Models/TeacherObjectiveModel";
import { ILearningObjectiveRepository } from "../Interfaces/ILearningObjective";
import LearningObjectiveTable from "../Tables/LearningObjectiveTable";
import QuestionTable from "../Tables/QuestionTable";
import TestHasQuestionTable from "../Tables/TestHasQuestionTable";

export class LearningObjectiveRepository implements ILearningObjectiveRepository {
  /**
   * Haalt leerdoelen op voor een specifieke toets
   */
  public async getLearningObjectivesForTest(testId: number): Promise<string[]> {
    const testQuestions = await TestHasQuestionTable.findAll({
      where: { test_id: testId },
    });

    const questionIds = testQuestions.map((tq) => tq.question_id);
    const learningObjectives: string[] = [];

    for (const questionId of questionIds) {
      const questionObjectives = await LearningObjectiveTable.findAll({
        include: [
          {
            model: QuestionTable,
            as: "questions",
            where: { id: questionId },
            through: { attributes: [] },
          },
        ],
      });

      questionObjectives.forEach((objective) => {
        if (!learningObjectives.includes(objective.description)) {
          learningObjectives.push(objective.description);
        }
      });
    }

    return learningObjectives;
  }

  /**
  * @author Luka Piersma
  */
  public async upsertLearningObjectiveTable(objectiveModel: TeacherObjectiveModel, transaction: Transaction): Promise<LearningObjectiveTable> {
    const [learningObjective] = await LearningObjectiveTable.upsert(
      {
        id: objectiveModel.id,
        description: objectiveModel.objective,
      },
      {
        transaction,
      }
    );

    return learningObjective;
  }

  /**
* @author Luka Piersma
*/
  public async updateLearningObjectiveTable(objectiveModel: TeacherObjectiveModel, transaction: Transaction): Promise<LearningObjectiveTable> {
    const learningObjective = await LearningObjectiveTable.findByPk(objectiveModel.id);

    if (!learningObjective) throw new Error('LearningObjectiveTable was not found');

    learningObjective.update({
      description: objectiveModel.objective
    }, { transaction });

    return learningObjective
  }
}