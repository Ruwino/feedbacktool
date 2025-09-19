import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import QuestionTable from './QuestionTable';
import TestHasQuestionTable from './TestHasQuestionTable';
import SubjectTable from './SubjectTable';
import ClassTable from './ClassTable';
import ClassHasTestTable from './ClassHasTestTable';
import UserTable from './UserTable';

/**
 * @author Roan Slingerland & Luka Piersma
 */
@Table({
  tableName: 'test',
  timestamps: false,
})

export default class TestTable extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
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
  declare duration: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare randomized: boolean;

  @ForeignKey(() => SubjectTable)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare subject_id: number;

  @BelongsTo(() => SubjectTable, { foreignKey: 'subject_id' })
  declare subject: SubjectTable;

  @ForeignKey(() => UserTable)
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare creator_email: string

  @BelongsTo(() => UserTable, { foreignKey: 'creator_email'})
  declare creator: UserTable

  @BelongsToMany(() => QuestionTable, () => TestHasQuestionTable)
  declare questions: QuestionTable[];

  @BelongsToMany(() => ClassTable, () => ClassHasTestTable)
  declare classes: ClassTable[];
}