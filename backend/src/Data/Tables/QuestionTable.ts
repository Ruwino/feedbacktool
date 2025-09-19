import { Column, DataType, ForeignKey, Model, Table, BelongsTo, BelongsToMany, HasMany } from "sequelize-typescript";
import QuestionTypeTable from "./QuestionTypeTable";
import QuestionLearningObjectiveTable from "./QuestionObjectiveTable";
import LearningObjectiveTable from "./LearningObjectiveTable";
import TestTable from "./TestTable";
import TestHasQuestionTable from "./TestHasQuestionTable";
import UserAnsweredQuestionTable from "./UserAnsweredQuestionTable";
import AnswerTable from "./AnswerTable";
import QuestionAnswerTable from "./QuestionAnswerTable";
import HintTable from "./HintTable";
import QuestionHintTable from "./QuestionHintTable";
import { TestQuestionModel } from "../../Business/Models/TestQuestionModel";

/**
 * @author Roan Slingerland & Luka Piersma
 */
@Table({
  tableName: "question",
  timestamps: false,
})
export default class QuestionTable extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare question: string;

  @ForeignKey(() => QuestionTypeTable)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare question_type_id: number;

  @BelongsTo(() => QuestionTypeTable)
  declare question_type: QuestionTypeTable;

  @BelongsToMany(() => AnswerTable, () => QuestionAnswerTable)
  declare answers: AnswerTable[];

  @BelongsToMany(() => LearningObjectiveTable, () => QuestionLearningObjectiveTable)
  declare objectives: LearningObjectiveTable[];

  @BelongsToMany(() => HintTable, () => QuestionHintTable)
  declare hints: HintTable[];

  @BelongsToMany(() => TestTable, () => TestHasQuestionTable)
  declare tests: TestTable[];

  @HasMany(() => UserAnsweredQuestionTable)
  declare user_answered_questions: UserAnsweredQuestionTable[];

  public toTestQuestionModel(): TestQuestionModel {
    const testQuestionModel = new TestQuestionModel(
      this.id,
      this.question_type.question_type,
      this.question,
      this.objectives[0]?.description,
      this.answers.map(a => a.answer)
    );

    return testQuestionModel;
  }
}