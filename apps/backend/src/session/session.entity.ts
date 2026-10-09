import { Column, Entity, Index, PrimaryColumn, DeleteDateColumn } from "typeorm";
@Entity()
export class Session {
  @Index()
  @Column("bigint")
  public expiredAt = Date.now();

  @PrimaryColumn("varchar", { length: 255 })
  public id = "";

  @Column("text")
  public json = "";

  @DeleteDateColumn()
  deletedAt?: Date;
}
