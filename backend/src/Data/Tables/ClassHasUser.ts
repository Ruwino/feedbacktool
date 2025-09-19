import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import UserTable from "./UserTable";
import ClassTable from "./ClassTable";

@Table({
  tableName: "class_has_user",
  timestamps: false,
})
export default class ClassHasUser extends Model {
  @ForeignKey(() => ClassTable)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  declare class_id: number;
  
  @ForeignKey(() => UserTable)
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  declare user_email: string;

  @BelongsTo(() => UserTable, { foreignKey: "user_email", as: "user" })
  declare user: UserTable;

  @BelongsTo(() => ClassTable, { foreignKey: "class_id", as: "class" })
  declare class: ClassTable;
}