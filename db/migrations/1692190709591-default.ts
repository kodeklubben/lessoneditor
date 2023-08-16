import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1692190709591 implements MigrationInterface {
    name = 'Default1692190709591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "session" ("expiredAt" bigint NOT NULL, "id" character varying(255) NOT NULL, "json" text NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_28c5d1d16da7908c97c9bc2f74" ON "session" ("expiredAt") `);
        await queryRunner.query(`CREATE TABLE "user" ("userId" integer NOT NULL, "username" character varying, "name" character varying, "email" character varying, "photo" character varying, CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TABLE "lesson" ("lessonId" SERIAL NOT NULL, "lessonSlug" character varying NOT NULL, "lessonTitle" character varying NOT NULL, "courseSlug" character varying NOT NULL, "courseTitle" character varying NOT NULL, "submitted" boolean NOT NULL, "submitted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying NOT NULL, "updated_by" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_706f335c9038cb06143f6de6476" PRIMARY KEY ("lessonId"))`);
        await queryRunner.query(`CREATE TABLE "file_store" ("fileId" SERIAL NOT NULL, "filename" character varying NOT NULL, "ext" character varying NOT NULL, "content" bytea NOT NULL, "created_by" character varying NOT NULL, "updated_by" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "lessonLessonId" integer, CONSTRAINT "PK_da3e2cec68f34f05fa286ae6b07" PRIMARY KEY ("fileId"))`);
        await queryRunner.query(`CREATE TABLE "user_lessons_lesson" ("userUserId" integer NOT NULL, "lessonLessonId" integer NOT NULL, CONSTRAINT "PK_b7cdb00459fbde4858b13658a40" PRIMARY KEY ("userUserId", "lessonLessonId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_eb95cc1e9b4adf70384162ffd8" ON "user_lessons_lesson" ("userUserId") `);
        await queryRunner.query(`CREATE INDEX "IDX_27da8972a39d5b935d7f68d0b4" ON "user_lessons_lesson" ("lessonLessonId") `);
        await queryRunner.query(`ALTER TABLE "file_store" ADD CONSTRAINT "FK_0de10c6e694e9428251246adee4" FOREIGN KEY ("lessonLessonId") REFERENCES "lesson"("lessonId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_lessons_lesson" ADD CONSTRAINT "FK_eb95cc1e9b4adf70384162ffd8d" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_lessons_lesson" ADD CONSTRAINT "FK_27da8972a39d5b935d7f68d0b4d" FOREIGN KEY ("lessonLessonId") REFERENCES "lesson"("lessonId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_lessons_lesson" DROP CONSTRAINT "FK_27da8972a39d5b935d7f68d0b4d"`);
        await queryRunner.query(`ALTER TABLE "user_lessons_lesson" DROP CONSTRAINT "FK_eb95cc1e9b4adf70384162ffd8d"`);
        await queryRunner.query(`ALTER TABLE "file_store" DROP CONSTRAINT "FK_0de10c6e694e9428251246adee4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_27da8972a39d5b935d7f68d0b4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eb95cc1e9b4adf70384162ffd8"`);
        await queryRunner.query(`DROP TABLE "user_lessons_lesson"`);
        await queryRunner.query(`DROP TABLE "file_store"`);
        await queryRunner.query(`DROP TABLE "lesson"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_28c5d1d16da7908c97c9bc2f74"`);
        await queryRunner.query(`DROP TABLE "session"`);
    }

}
