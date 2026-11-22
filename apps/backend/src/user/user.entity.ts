import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable } from "typeorm";
import { Lesson } from "../lesson/lesson.entity";

@Entity()
export class User {
  @PrimaryColumn()
  userId!: number;

  @Column({ type: "varchar", nullable: true })
  username!: string | null;

  @Column({ type: "varchar", nullable: true })
  name!: string | null;

  @Column({ type: "varchar", nullable: true })
  email!: string | null;

  @Column({ type: "varchar", nullable: true })
  photo!: string | null;

  @ManyToMany((type) => Lesson, (lesson) => lesson.users)
  @JoinTable()
  lessons!: Lesson[];
}
