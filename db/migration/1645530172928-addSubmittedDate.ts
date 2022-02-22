import {MigrationInterface, QueryRunner} from "typeorm";

export class addSubmittedDate1645530172928 implements MigrationInterface {
    name = 'addSubmittedDate1645530172928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" ADD "submitted_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "submitted_at"`);
    }

}
