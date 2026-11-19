import { MigrationInterface, QueryRunner } from "typeorm";

/** Ownership by GitHub user id: usernames can be renamed and then registered by someone else. */
export class LessonOwnerId1795096346000 implements MigrationInterface {
  name = "LessonOwnerId1795096346000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson" ADD "created_by_id" integer`);
    await queryRunner.query(
      `UPDATE "lesson" l SET "created_by_id" = u."userId" FROM "user" u WHERE u."username" = l."created_by"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "created_by_id"`);
  }
}
