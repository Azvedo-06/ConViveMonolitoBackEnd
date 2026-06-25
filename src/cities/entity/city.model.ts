import { Table, Column, Model, DataType } from 'sequelize-typescript';

export interface CityAttributes {
  id: string;
  label: string;
  theme: string;
  accentClassName?: string;
  imageUrl: string;
  imageFallbackUrl: string;
  colorPrimary?: string;
  colorSecondary?: string;
  description?: string;
  tags?: string[];
  spotlight?: string;
  latitude?: number;
  longitude?: number;
  state?: string;
}

export interface CityCreationAttributes extends CityAttributes {}

@Table({
  tableName: 'cities',
  timestamps: true,
  underscored: true,
})
export class City extends Model<CityAttributes, CityCreationAttributes> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare label: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare theme: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare accentClassName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare imageUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare imageFallbackUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare colorPrimary?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare colorSecondary?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare tags?: string[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare spotlight?: string;

  @Column({
    type: DataType.DECIMAL(10, 8),
    allowNull: true,
    get() {
      const val = this.getDataValue('latitude');
      return val === null || val === undefined ? undefined : Number(val);
    },
  })
  declare latitude?: number;

  @Column({
    type: DataType.DECIMAL(11, 8),
    allowNull: true,
    get() {
      const val = this.getDataValue('longitude');
      return val === null || val === undefined ? undefined : Number(val);
    },
  })
  declare longitude?: number;

  @Column({
    type: DataType.STRING(2),
    allowNull: true,
  })
  declare state?: string;
}
