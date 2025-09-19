import { Column, DataType, Model, Table } from "sequelize-typescript";

/**
 * @author Max Sijbrands
 */
@Table({
  tableName: "register_codes",
  timestamps: false,
})
export default class RegisterCodeTable extends Model {
  @Column({
    type: DataType.STRING(50),
    primaryKey: true,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  })
  declare code: string;
}
