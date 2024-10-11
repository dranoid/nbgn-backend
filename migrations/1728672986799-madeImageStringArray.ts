import { MigrationInterface, QueryRunner } from "typeorm";

export class MadeImageStringArray1728672986799 implements MigrationInterface {
    name = 'MadeImageStringArray1728672986799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD "image" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD "image" character varying`);
    }

}
