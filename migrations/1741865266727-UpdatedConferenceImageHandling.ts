import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedConferenceImageHandling1741865266727 implements MigrationInterface {
    name = 'UpdatedConferenceImageHandling1741865266727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "eventImageDesc"`);
        await queryRunner.query(`ALTER TABLE "conferences" ADD "eventImageDescriptions" text`);
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "conferences" ADD "image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "conferences" ADD "image" text`);
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "eventImageDescriptions"`);
        await queryRunner.query(`ALTER TABLE "conferences" ADD "eventImageDesc" character varying`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD "date" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
