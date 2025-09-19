import { BelongsTo, Column, DataType, ForeignKey, Model, Table, Unique } from "sequelize-typescript";
import UserTable from "./UserTable";

/**
 * @author Roan Slingerland & Luka Piersma
 */
@Table({
  tableName: "session",
  timestamps: false,
})
export default class SessionTable extends Model {
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare expiration_date: Date;

  @ForeignKey(() => UserTable)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare user_email: string;

  @BelongsTo(() => UserTable)
  declare user: UserTable;
}
