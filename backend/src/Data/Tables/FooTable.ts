import { Column, DataType, Model, Table } from "sequelize-typescript";

/**
 * @author Roan Slingerland
 */
@Table({
  tableName: "foo",
  timestamps: false,
})
export default class FooTable extends Model {
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare foo: string;

}