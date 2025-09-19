import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import ClassTable from "./ClassTable";
import TestTable from "./TestTable";

/**
 * @author Roan Slingerland & Luka Piersma
 */
@Table({
  tableName: "class_has_test",
  timestamps: false,
})
export default class ClassHasTestTable extends Model {
  @ForeignKey(() => ClassTable)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  declare class_id: number;

  @ForeignKey(() => TestTable)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  declare test_id: number;

  @Column({
    type: DataType.BOOLEAN,
    primaryKey: false,
    allowNull: false
  })
  declare visible: boolean;

  @Column({
    type: DataType.DATE,
    primaryKey: false,
    allowNull: true
  })
  declare visible_date: Date;

  @BelongsTo(() => ClassTable, { foreignKey: "class_id", as: "class" })
  declare class: ClassTable;
}
