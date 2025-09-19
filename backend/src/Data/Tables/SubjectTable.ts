import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import ClassTable from "./ClassTable";

/**
 * @author Roan Slingerland & Luka Piersma
 */
@Table({
  tableName: "subject",
  timestamps: false,
})

export default class SubjectTable extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @HasMany(() => ClassTable, { foreignKey: "subject_id" })
  declare classes: ClassTable[];
}