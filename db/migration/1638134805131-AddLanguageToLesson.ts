import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLanguageToLesson1638134805131 implements MigrationInterface {
    name = 'AddLanguageToLesson1638134805131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" RENAME COLUMN "language" TO "languages"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" RENAME COLUMN "languages" TO "language"`);
    }

}
