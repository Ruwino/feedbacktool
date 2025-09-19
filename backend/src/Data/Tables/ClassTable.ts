import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import SubjectTable from "./SubjectTable";
import TestTable from "./TestTable";
import ClassHasTestTable from "./ClassHasTestTable";
import UserTable from "./UserTable";
import ClassHasUser from "./ClassHasUser";

/**
 * @author Roan Slingerland & Luka Piersma
 */
@Table({
  tableName: "class",
  timestamps: false,
})

export default class ClassTable extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare grade_year: number;

  @ForeignKey(() => SubjectTable)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare subject_id: number;

  @BelongsTo(() => SubjectTable, { foreignKey: "subject_id" })
  declare subject: SubjectTable;

  @BelongsToMany(() => UserTable, () => ClassHasUser)
  declare users: UserTable[];

  @BelongsToMany(() => TestTable, () => ClassHasTestTable)
  declare tests: TestTable[];
}