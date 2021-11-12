import { MigrationInterface, QueryRunner } from "typeorm";

export class setFileStoreCascadeTrue1633075305132 implements MigrationInterface {
  name = "setFileStoreCascadeTrue1633075305132";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."file_store" DROP CONSTRAINT "FK_0de10c6e694e9428251246adee4"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."file_store" ADD CONSTRAINT "FK_0de10c6e694e9428251246adee4" FOREIGN KEY ("lessonLessonId") REFERENCES "lesson"("lessonId") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."file_store" DROP CONSTRAINT "FK_0de10c6e694e9428251246adee4"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."file_store" ADD CONSTRAINT "FK_0de10c6e694e9428251246adee4" FOREIGN KEY ("lessonLessonId") REFERENCES "lesson"("lessonId") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
