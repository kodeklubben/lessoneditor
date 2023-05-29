import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("file_store")
export class LessonFileEntity {
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

  @Column()
  lessonLessonId: number;
}
