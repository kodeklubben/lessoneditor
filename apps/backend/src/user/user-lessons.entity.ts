import { Entity, PrimaryColumn } from "typeorm";

@Entity("user_lessons_lesson")
export class UserLessonsEntity {
  @PrimaryColumn()
  userUserId: number;

  @PrimaryColumn()
  lessonLessonsId: number;
}
