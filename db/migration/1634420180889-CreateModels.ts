import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateModels1634420180889 implements MigrationInterface {
  name = "CreateModels1634420180889";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "photo" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "photo"`);
  }
}
