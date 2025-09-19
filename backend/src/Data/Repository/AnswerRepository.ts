import { IAnswerRepository } from "../Interfaces/IAnswerRepository";
import UserAnsweredQuestionTable from "../Tables/UserAnsweredQuestionTable";
import QuestionAnswerTable from "../Tables/QuestionAnswerTable";
import AnswerTable from "../Tables/AnswerTable";
import { Op, Transaction } from "sequelize";
import { TeacherAnswerModel } from "../../Business/Models/TeacherAnswerModel";

export class AnswerRepository implements IAnswerRepository {
  /**
   * Gather all answers from a student for a specific test
   * @param studentEmail Email of the student
   */
  public async getStudentAnswersForTest(
    studentEmail: string,
    testId: number,
    questionIds: number[]
  ): Promise<any[]> {
    return await UserAnsweredQuestionTable.findAll({
      where: {
        user_email: studentEmail,
        question_id: {
          [Op.in]: questionIds,
        },
        test_id: testId,
      },
      order: [["timestamp", "ASC"]],
    });
  }

  public async isAnswerCorrect(questionId: number, answer: string): Promise<boolean> {
    const questionHasAnswers = await QuestionAnswerTable.findAll({
      where: {
        question_id: questionId,
      },
    });

    if (questionHasAnswers.length === 0) {
      return false;
    }

    for (const qha of questionHasAnswers) {
      const correctAnswer = await AnswerTable.findOne({
        attributes: ["id", "answer", "correct"],
        where: {
          id: qha.answer_id,
          correct: true,
        },
      });

      if (correctAnswer && answer === correctAnswer.getDataValue("answer")) {
        return true;
      }
    }

    return false;
  }

  public async getLatestAnswerTimestamp(studentEmail: string, testId: number): Promise<Date | null> {
    const latestAnswer = await UserAnsweredQuestionTable.findOne({
      where: {
        user_email: studentEmail,
        test_id: testId
      },
      order: [['timestamp', 'DESC']]
    });

    return latestAnswer ? latestAnswer.timestamp : null;
  }

  /**
  * @author Luka Piersma
  */
  public async upsertAnswerTable(answerModel: TeacherAnswerModel, transaction: Transaction): Promise<AnswerTable> {
    const [answer] = await AnswerTable.upsert(
      {
        id: answerModel.id,
        answer: answerModel.answer, 
        correct: answerModel.correct
      },
      { transaction }
    );

    return answer;
  }

    /**
  * @author Luka Piersma
  */
  public async updateAnswerTable(answerModel: TeacherAnswerModel, transaction: Transaction): Promise<AnswerTable> {
    const answer = await AnswerTable.findByPk(answerModel.id);

    if (!answer) throw new Error('AnswerTable was not found');

    answer.update(
      {
        answer: answerModel.answer, 
        correct: answerModel.correct
      },
      { transaction }
    );

    return answer;
  }
}