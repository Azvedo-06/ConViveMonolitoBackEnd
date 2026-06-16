import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { Role } from '../../auth/enums/role.enum';
import { EventParticipant } from '../../events/entity/event-participant.model';
import { Event } from '../../events/entity/event.model';

export interface UserAttributes {
  id: number;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  password: string;
  role: Role;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  cnpj?: string;
  cep?: string;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'id'> {}

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare cpf: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  declare cnpj?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare cep?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM('ADMIN', 'USER', 'ORGANIZER'),
    defaultValue: Role.USER,
  })
  declare role: Role;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare linkedin?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare instagram?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare youtube?: string;

  @BelongsToMany(() => Event, () => EventParticipant)
  declare events?: Event[];
}
