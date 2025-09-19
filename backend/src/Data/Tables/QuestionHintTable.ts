import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import QuestionTable from "./QuestionTable";
import HintTable from "./HintTable";

/**
 * @author Roan Slingerland & Luka Piersma
 */
@Table({
  tableName: "question_has_hint",
  timestamps: false,
})
export default class QuestionHintTable extends Model {
  @ForeignKey(() => QuestionTable)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare question_id: number;

  @ForeignKey(() => HintTable)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare hint_id: number;
}