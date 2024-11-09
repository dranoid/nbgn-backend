import { MigrationInterface, QueryRunner } from "typeorm";

export class RenamedImageToImagesOnBlogTable1729852802443 implements MigrationInterface {
    name = 'RenamedImageToImagesOnBlogTable1729852802443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" RENAME COLUMN "image" TO "images"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" RENAME COLUMN "images" TO "image"`);
    }

}
