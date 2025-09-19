import { Column, DataType, ForeignKey, Model, Table, BelongsTo } from "sequelize-typescript";
import UserTable from "./UserTable";
import SubjectTable from "./SubjectTable";

/**
 * @author Max Sijbrands
 */
@Table({
  tableName: "subject_has_teacher",
  timestamps: false,
})
export default class SubjectHasTeacherTable extends Model {
  
  @ForeignKey(() => UserTable)
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  declare user_email: string;

  @ForeignKey(() => SubjectTable)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  declare subject_id: number;

  @BelongsTo(() => SubjectTable)
  declare subject: SubjectTable;
}