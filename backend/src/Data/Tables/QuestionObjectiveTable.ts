import { Column, DataType, ForeignKey, Model, Table, BelongsTo } from "sequelize-typescript";
import QuestionTable from "./QuestionTable";
import LearningObjectiveTable from "./LearningObjectiveTable";

/**
 * @author Roan Slingerland & Luka Piersma
 */
@Table({
  tableName: "question_has_learning_objective",
  timestamps: false,
})
export default class QuestionObjectiveTable extends Model {
  @ForeignKey(() => QuestionTable)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare question_id: number;

  @ForeignKey(() => LearningObjectiveTable)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare objective_id: number;

  @BelongsTo(() => QuestionTable)
  declare question: QuestionTable;

  @BelongsTo(() => LearningObjectiveTable)
  declare objective: LearningObjectiveTable;
}
