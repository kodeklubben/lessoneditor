import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeFieldNameIdToFileIdInFileStore1630917567820 implements MigrationInterface {
  name = "ChangeFieldNameIdToFileIdInFileStore1630917567820";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."file_store" RENAME COLUMN "id" TO "fileId"`);
    await queryRunner.query(
      `ALTER TABLE "public"."file_store" RENAME CONSTRAINT "PK_ad701e228fa76a6ffb1c7206a44" TO "PK_da3e2cec68f34f05fa286ae6b07"`
    );
    await queryRunner.query(
      `ALTER SEQUENCE "public"."file_store_id_seq" RENAME TO "file_store_fileId_seq"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER SEQUENCE "public"."file_store_fileId_seq" RENAME TO "file_store_id_seq"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."file_store" RENAME CONSTRAINT "PK_da3e2cec68f34f05fa286ae6b07" TO "PK_ad701e228fa76a6ffb1c7206a44"`
    );
    await queryRunner.query(`ALTER TABLE "public"."file_store" RENAME COLUMN "fileId" TO "id"`);
  }
}
