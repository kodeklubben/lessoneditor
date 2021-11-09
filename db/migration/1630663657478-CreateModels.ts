import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateModels1630663657478 implements MigrationInterface {
  name = "CreateModels1630663657478";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "lesson" ("lessonId" SERIAL NOT NULL, "lessonSlug" character varying NOT NULL, "lessonTitle" character varying NOT NULL, "courseSlug" character varying NOT NULL, "courseTitle" character varying NOT NULL, "email" character varying NOT NULL, "created_by" character varying NOT NULL, "updated_by" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_706f335c9038cb06143f6de6476" PRIMARY KEY ("lessonId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "file_store" ("id" SERIAL NOT NULL, "filename" character varying NOT NULL, "ext" character varying NOT NULL, "content" bytea NOT NULL, "created_by" character varying NOT NULL, "updated_by" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "lessonLessonId" integer, CONSTRAINT "PK_ad701e228fa76a6ffb1c7206a44" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_lessons_lesson" ("userId" integer NOT NULL, "lessonLessonId" integer NOT NULL, CONSTRAINT "PK_4da942542f8ed6b13d3d6c6ad4c" PRIMARY KEY ("userId", "lessonLessonId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7ddb44e58d9fc49bbf9ab6823f" ON "user_lessons_lesson" ("userId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_27da8972a39d5b935d7f68d0b4" ON "user_lessons_lesson" ("lessonLessonId") `
    );
    await queryRunner.query(
      `ALTER TABLE "file_store" ADD CONSTRAINT "FK_0de10c6e694e9428251246adee4" FOREIGN KEY ("lessonLessonId") REFERENCES "lesson"("lessonId") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_lessons_lesson" ADD CONSTRAINT "FK_7ddb44e58d9fc49bbf9ab6823f3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_lessons_lesson" ADD CONSTRAINT "FK_27da8972a39d5b935d7f68d0b4d" FOREIGN KEY ("lessonLessonId") REFERENCES "lesson"("lessonId") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_lessons_lesson" DROP CONSTRAINT "FK_27da8972a39d5b935d7f68d0b4d"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_lessons_lesson" DROP CONSTRAINT "FK_7ddb44e58d9fc49bbf9ab6823f3"`
    );
    await queryRunner.query(
      `ALTER TABLE "file_store" DROP CONSTRAINT "FK_0de10c6e694e9428251246adee4"`
    );
    await queryRunner.query(`DROP INDEX "IDX_27da8972a39d5b935d7f68d0b4"`);
    await queryRunner.query(`DROP INDEX "IDX_7ddb44e58d9fc49bbf9ab6823f"`);
    await queryRunner.query(`DROP TABLE "user_lessons_lesson"`);
    await queryRunner.query(`DROP TABLE "file_store"`);
    await queryRunner.query(`DROP TABLE "lesson"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
