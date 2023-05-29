import { MigrationInterface, QueryRunner } from "typeorm";

export class UpgradingDependencies1685198741168 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'alter table public.session rename column "deletedAt" to "destroyedAt"'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'alter table public.session rename column "destroyedAt" to "deletedAt"'
    );
  }
}
