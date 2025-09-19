import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import QuestionTable from "./QuestionTable";
import QuestionHintTable from "./QuestionHintTable";

/**
 * @author Roan Slingerland & Luka Piersma
 */
@Table({
  tableName: "hint",
  timestamps: false,
})
export default class HintTable extends Model {
  
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
  declare hint: string;


  @BelongsToMany(() => QuestionTable, () => QuestionHintTable)
  declare questions: QuestionTable[];
}