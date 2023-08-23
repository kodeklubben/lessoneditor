import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  lessonId: number;

  @Column()
  lessonSlug: string;

  @Column()
  lessonTitle: string;

  @Column()
  courseSlug: string;

  @Column()
  courseTitle: string;

  @Column()
  submitted: boolean;

  @Column({ type: "timestamptz", nullable: true })
  submitted_at: Date;

  @Column()
  created_by: string;

  @Column()
  updated_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany((type) => FileStore, (file) => file.lesson, {
    cascade: true,
  })
  files: FileStore[];

  @ManyToMany((type) => User, (user) => user.lessons)
  users: User[];
}

@Entity()
export class FileStore {
  @PrimaryGeneratedColumn()
  fileId: number;

  @Column()
  filename: string;

  @Column()
  ext: string;

  @Column("bytea")
  content: Buffer;

  @Column()
  created_by: string;

  @Column()
  updated_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne((type) => Lesson, (lesson) => lesson.files, { onDelete: "CASCADE" })
  lesson: Lesson;
}
