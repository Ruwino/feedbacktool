import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import TestTable from "./TestTable";
import QuestionTable from "./QuestionTable";

/**
 * @author Roan Slingerland & Luka Piersma
 */
@Table({
  tableName: "test_has_question",
  timestamps: false,
})
export default class TestHasQuestionTable extends Model {
  @ForeignKey(() => TestTable)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  declare test_id: number;

  @ForeignKey(() => QuestionTable)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  declare question_id: number;
}
