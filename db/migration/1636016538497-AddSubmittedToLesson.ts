import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubmittedToLesson1636016538497 implements MigrationInterface {
  name = "AddSubmittedToLesson1636016538497";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson" ADD "submitted" boolean NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "submitted"`);
  }
}
