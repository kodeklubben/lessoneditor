import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("lesson")
export class LessonEntity {
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
}
