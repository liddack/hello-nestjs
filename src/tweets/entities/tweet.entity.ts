import { Table, Column, Model } from 'sequelize-typescript';

@Table({
  tableName: 'tweets',
})
export class Tweet extends Model {
  @Column
  content: string;
}
