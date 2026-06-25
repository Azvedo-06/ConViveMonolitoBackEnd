import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';

import { User } from '../../users/entity/user.model';
import { EventType } from '../enums/event-type.enum';
import { City } from '../../cities/entity/city.model';

import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

import { EventParticipant } from './event-participant.model';

@Table({
  tableName: 'events',
  underscored: true,
  timestamps: true,
})
export class Event extends Model<
  InferAttributes<Event>,
  InferCreationAttributes<Event>
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: CreationOptional<number>;
  @Column({
    allowNull: false,
  })
  declare title: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare description: string;

  @Column({
    allowNull: false,
  })
  declare location: string;

  @Column({
    allowNull: false,
  })
  declare date: Date;

  @Column({
    type: DataType.ENUM('COMMUNITY', 'PRIVATE'),
    defaultValue: 'COMMUNITY',
  })
  declare type: EventType;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  declare price: CreationOptional<number>;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare maxParticipants: CreationOptional<number>;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
  })
  declare createdBy: number;

  @BelongsTo(() => User, 'createdBy')
  creator?: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'eventos',
  })
  declare category: CreationOptional<string>;

  @ForeignKey(() => City)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'campo-mourao',
  })
  declare city: CreationOptional<string>;

  @BelongsTo(() => City, 'city')
  cityDetails?: City;

  @BelongsToMany(() => User, () => EventParticipant)
  declare participants?: User[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare imageUrl: CreationOptional<string>;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'NONE',
  })
  declare exposureLevel: CreationOptional<'NONE' | 'CITY' | 'STATE' | 'COUNTRY'>;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare promotionUntil: CreationOptional<Date | null>;
}
