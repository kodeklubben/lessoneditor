import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable } from "typeorm";
import { Lesson } from "../lesson/lesson.entity";

@Entity()
export class User {
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

  @ManyToMany((type) => Lesson, (lesson) => lesson.users)
  @JoinTable()
  lessons: Lesson[];
}
