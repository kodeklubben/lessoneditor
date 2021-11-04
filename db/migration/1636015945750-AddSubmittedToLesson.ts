import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSubmittedToLesson1636015945750 implements MigrationInterface {
    name = 'AddSubmittedToLesson1636015945750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_store" ADD "submitted" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_store" DROP COLUMN "submitted"`);
    }

}
