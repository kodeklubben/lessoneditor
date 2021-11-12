import { MigrationInterface, QueryRunner } from "typeorm";

export class SetUserUserIdFromPrimaryGeneratedToPrimary1631882972127 implements MigrationInterface {
  name = "SetUserUserIdFromPrimaryGeneratedToPrimary1631882972127";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."user_lessons_lesson" DROP CONSTRAINT "FK_eb95cc1e9b4adf70384162ffd8d"`
    );
    await queryRunner.query(`ALTER TABLE "public"."user" ALTER COLUMN "userId" DROP DEFAULT`);
    await queryRunner.query(`DROP SEQUENCE "public"."user_userId_seq"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user_lessons_lesson" ADD CONSTRAINT "FK_eb95cc1e9b4adf70384162ffd8d" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."user_lessons_lesson" DROP CONSTRAINT "FK_eb95cc1e9b4adf70384162ffd8d"`
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "public"."user_userId_seq" OWNED BY "public"."user"."userId"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user" ALTER COLUMN "userId" SET DEFAULT nextval('"public"."user_userId_seq"')`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_lessons_lesson" ADD CONSTRAINT "FK_eb95cc1e9b4adf70384162ffd8d" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }
}
