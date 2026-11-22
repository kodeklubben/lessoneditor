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
  lessonId!: number;

  @Column()
  lessonSlug!: string;

  @Column()
  lessonTitle!: string;

  @Column()
  courseSlug!: string;

  @Column()
  courseTitle!: string;

  @Column()
  submitted!: boolean;

  @Column({ type: "timestamptz", nullable: true })
  submitted_at!: Date | null;

  @Column()
  created_by!: string;

  /** GitHub user id of the creator; null only for rows the migration could not match. */
  @Column({ type: "integer", nullable: true })
  created_by_id!: number | null;

  @Column()
  updated_by!: string;

  /** For a copy of a published lesson: its folder in kodeklubben/oppgaver, e.g. src/scratch/asteroids. */
  @Column({ type: "varchar", nullable: true })
  upstream_path!: string | null;

  /** The commit of kodeklubben/oppgaver the copy was made from. */
  @Column({ type: "varchar", nullable: true })
  upstream_commit!: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany((type) => FileStore, (file) => file.lesson, {
    cascade: true,
  })
  files!: FileStore[];

  @ManyToMany((type) => User, (user) => user.lessons)
  users!: User[];
}

@Entity()
export class FileStore {
  @PrimaryGeneratedColumn()
  fileId!: number;

  @Column()
  filename!: string;

  @Column()
  ext!: string;

  @Column("bytea")
  content!: Buffer;

  @Column()
  created_by!: string;

  @Column()
  updated_by!: string;

  /** For an imported file: the blob sha it had in kodeklubben/oppgaver. */
  @Column({ type: "varchar", nullable: true })
  upstream_sha!: string | null;

  /** For an imported file: the git blob sha of the content as stored, to tell whether it changed. */
  @Column({ type: "varchar", nullable: true })
  imported_sha!: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne((type) => Lesson, (lesson) => lesson.files, { onDelete: "CASCADE" })
  lesson!: Lesson;
}

/** Checks the creator by user id. The username is only a fallback for rows without an id. */
export function isLessonOwner(
  lesson: Pick<Lesson, "created_by" | "created_by_id">,
  user: Pick<User, "userId" | "username">,
): boolean {
  if (lesson.created_by_id != null) return lesson.created_by_id === user.userId;
  return !!user.username && lesson.created_by === user.username;
}
