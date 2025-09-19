import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import QuestionTable from "./QuestionTable";
import AnswerTable from "./AnswerTable";

/**
 * @author Roan Slingerland & Luka Piersma
 */
@Table({
  tableName: "question_has_answer",
  timestamps: false,
})
export default class QuestionAnswerTable extends Model {
  @ForeignKey(() => QuestionTable)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare question_id: number;

  @ForeignKey(() => AnswerTable)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare answer_id: number;

}