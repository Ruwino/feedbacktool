import { Column, DataType, Model, Table, BelongsToMany } from "sequelize-typescript";
import QuestionLearningObjectiveTable from "./QuestionObjectiveTable";
import QuestionTable from "./QuestionTable"; 

/**
 * @author Roan Slingerland & Luka Piersma
 */
@Table({
  tableName: "learning_objective",
  timestamps: false,
})
export default class LearningObjectiveTable extends Model {
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
  declare description: string;

  @BelongsToMany(() => QuestionTable, () => QuestionLearningObjectiveTable)
  declare questions: QuestionTable[];
}
