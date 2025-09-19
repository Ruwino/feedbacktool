import { Column, DataType, ForeignKey, Model, Table, BelongsTo, PrimaryKey } from "sequelize-typescript";
import UserTable from "./UserTable";
import QuestionTable from "./QuestionTable";
import TestTable from "./TestTable";
import HintTable from "./HintTable";
import AnswerTable from "./AnswerTable";

/**
 * @author Roan Slingerland & Luka Piersma
 */
@Table({
  tableName: "user_answered_question",
  timestamps: false,
})
export default class UserAnsweredQuestionTable extends Model {

  @ForeignKey(() => UserTable)
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  declare user_email: string;

  @BelongsTo(() => UserTable)
  declare user: UserTable;

  @ForeignKey(() => QuestionTable)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  declare question_id: number;

  @BelongsTo(() => QuestionTable)
  declare question: QuestionTable;

  @ForeignKey(() => TestTable)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  declare test_id: number;

  @BelongsTo(() => TestTable)
  declare test: TestTable;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare answer: string;

  @Column({
    type: DataType.DATE,
    primaryKey: true,
    allowNull: false,
  })
  declare timestamp: Date;

  public async getCurrentHint(): Promise<string[]> {
    const hints = await HintTable.findAll({
      include: [{
        model: QuestionTable,
        where: { id: this.question_id },
        through: { attributes: [] }
      }],
      order: [['id', 'ASC']]
    });

    const hintsArray = hints.map(hint => hint.hint);
    return hintsArray;
  }

  public async isCorrect(): Promise<boolean> {
    const correctAnswer = await AnswerTable.findOne({
      where: {
        correct: true,
      },
      include: {
        model: QuestionTable,
        where: { id: this.question_id }
      }
    });

    if (!correctAnswer) {
      throw new Error('No correct answer found for this question');
    }

    return this.answer.trim().toLocaleLowerCase() === correctAnswer.answer.trim().toLocaleLowerCase();
  }
}