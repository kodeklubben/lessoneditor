import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Each text's own thumbnail (a PNG of that text), so the language rows on the lesson page show
 * their own content. Nullable: texts get one the next time they are saved. The version with
 * traffic ignores the column.
 */
export class TextThumbnail1795560000000 implements MigrationInterface {
  name = "TextThumbnail1795560000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file_store" ADD "thumbnail" bytea`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file_store" DROP COLUMN "thumbnail"`);
  }
}
