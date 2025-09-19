import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import QuestionTable from "./QuestionTable";
import QuestionAnswerTable from "./QuestionAnswerTable";

/**
 * @author Roan Slingerland & Luka Piersma
 */
@Table({
  tableName: "answer",
  timestamps: false,
})
export default class AnswerTable extends Model {
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare correct: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare answer: string;

  @BelongsToMany(() => QuestionTable, () => QuestionAnswerTable)
  declare questions: QuestionTable[];
}