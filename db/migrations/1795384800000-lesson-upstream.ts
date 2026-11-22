import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Where an imported lesson came from in kodeklubben/oppgaver (see docs/rediger-oppgave.md). All
 * nullable: lessons made in the editor have no upstream, and the version with traffic ignores the
 * columns.
 */
export class LessonUpstream1795384800000 implements MigrationInterface {
  name = "LessonUpstream1795384800000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson" ADD "upstream_path" character varying`);
    await queryRunner.query(`ALTER TABLE "lesson" ADD "upstream_commit" character varying`);
    await queryRunner.query(`ALTER TABLE "file_store" ADD "upstream_sha" character varying`);
    await queryRunner.query(`ALTER TABLE "file_store" ADD "imported_sha" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file_store" DROP COLUMN "imported_sha"`);
    await queryRunner.query(`ALTER TABLE "file_store" DROP COLUMN "upstream_sha"`);
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "upstream_commit"`);
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "upstream_path"`);
  }
}
