import { MigrationInterface, QueryRunner } from "typeorm";

export class SetUserFieldsNullable1631882029899 implements MigrationInterface {
  name = "SetUserFieldsNullable1631882029899";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."user" ALTER COLUMN "username" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "public"."user" ALTER COLUMN "name" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "public"."user" ALTER COLUMN "email" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."user" ALTER COLUMN "email" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "public"."user" ALTER COLUMN "name" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "public"."user" ALTER COLUMN "username" SET NOT NULL`);
  }
}
