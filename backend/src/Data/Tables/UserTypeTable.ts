import { Column, DataType, Model, Table } from "sequelize-typescript";
import { UserType } from "../../Enums/UserType";

/**
 * @author Roan Slingerland & Luka Piersma
 */
@Table({
  tableName: "user_type",
  timestamps: false,
})
export default class UserTypeTable extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.ENUM(...Object.values(UserType)),
    allowNull: false
  })
  declare name: string;
}
