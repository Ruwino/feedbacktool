import { Column, DataType, Model, Table, HasMany, BelongsToMany } from "sequelize-typescript";
import QuestionTable from "./QuestionTable"; 
import { QuestionType } from "../../Enums/QuestionType";

/**
 * @author Roan Slingerland & Luka Piersma
 */
@Table({
  tableName: "question_type",
  timestamps: false,
})
export default class QuestionTypeTable extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.ENUM(...Object.values(QuestionType)), 
    allowNull: false,
  })
  declare question_type: QuestionType;

  @HasMany(() => QuestionTable)
  declare questions: QuestionTable[];
}
