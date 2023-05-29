import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("user")
export class UserEntity {
  @PrimaryColumn()
  userId: number;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  photo: string;
}
