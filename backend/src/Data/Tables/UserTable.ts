import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import UserTypeTable from "./UserTypeTable";
import ClassTable from "./ClassTable";
import ClassHasUser from "./ClassHasUser";
import SessionTable from "./SessionTable";
import UserAnsweredQuestionTable from "./UserAnsweredQuestionTable";

@Table({
  tableName: "user",
  timestamps: false,
})
export default class UserTable extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password_hash: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare last_name: string;

  @ForeignKey(() => UserTypeTable)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare user_type_id: number;

  @HasOne(() => SessionTable)
  declare session: SessionTable;

  @BelongsTo(() => UserTypeTable)
  declare user_type: UserTypeTable;

  @HasMany(() => ClassHasUser, { as: "user_classes" })
  declare user_classes: ClassHasUser[];

  @BelongsToMany(() => ClassTable, () => ClassHasUser)
  declare classes: ClassTable[];

  @HasMany(() => UserAnsweredQuestionTable)
  declare user_answered_questions: UserAnsweredQuestionTable[];
}
