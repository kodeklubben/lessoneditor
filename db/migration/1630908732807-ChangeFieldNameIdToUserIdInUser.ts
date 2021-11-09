import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeFieldNameIdToUserIdInUser1630908732807 implements MigrationInterface {
  name = "ChangeFieldNameIdToUserIdInUser1630908732807";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."user_lessons_lesson" DROP CONSTRAINT "FK_7ddb44e58d9fc49bbf9ab6823f3"`
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_7ddb44e58d9fc49bbf9ab6823f"`);
    await queryRunner.query(`ALTER TABLE "public"."user" RENAME COLUMN "id" TO "userId"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user" RENAME CONSTRAINT "PK_cace4a159ff9f2512dd42373760" TO "PK_d72ea127f30e21753c9e229891e"`
    );
    await queryRunner.query(`ALTER SEQUENCE "public"."user_id_seq" RENAME TO "user_userId_seq"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user_lessons_lesson" RENAME COLUMN "userId" TO "userUserId"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_lessons_lesson" RENAME CONSTRAINT "PK_4da942542f8ed6b13d3d6c6ad4c" TO "PK_b7cdb00459fbde4858b13658a40"`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eb95cc1e9b4adf70384162ffd8" ON "public"."user_lessons_lesson" ("userUserId") `
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_lessons_lesson" ADD CONSTRAINT "FK_eb95cc1e9b4adf70384162ffd8d" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."user_lessons_lesson" DROP CONSTRAINT "FK_eb95cc1e9b4adf70384162ffd8d"`
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_eb95cc1e9b4adf70384162ffd8"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user_lessons_lesson" RENAME CONSTRAINT "PK_b7cdb00459fbde4858b13658a40" TO "PK_4da942542f8ed6b13d3d6c6ad4c"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_lessons_lesson" RENAME COLUMN "userUserId" TO "userId"`
    );
    await queryRunner.query(`ALTER SEQUENCE "public"."user_userId_seq" RENAME TO "user_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user" RENAME CONSTRAINT "PK_d72ea127f30e21753c9e229891e" TO "PK_cace4a159ff9f2512dd42373760"`
    );
    await queryRunner.query(`ALTER TABLE "public"."user" RENAME COLUMN "userId" TO "id"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_7ddb44e58d9fc49bbf9ab6823f" ON "public"."user_lessons_lesson" ("userId") `
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_lessons_lesson" ADD CONSTRAINT "FK_7ddb44e58d9fc49bbf9ab6823f3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }
}
