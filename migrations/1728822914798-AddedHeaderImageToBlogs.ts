import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedHeaderImageToBlogs1728822914798 implements MigrationInterface {
    name = 'AddedHeaderImageToBlogs1728822914798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" ADD "headerImage" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "conferences" ADD "image" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "conferences" ADD "image" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blogs" DROP COLUMN "headerImage"`);
    }

}
