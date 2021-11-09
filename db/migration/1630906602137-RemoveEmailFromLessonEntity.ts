import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveEmailFromLessonEntity1630906602137 implements MigrationInterface {
  name = "RemoveEmailFromLessonEntity1630906602137";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."lesson" DROP COLUMN "email"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."lesson" ADD "email" character varying NOT NULL`);
  }
}
