import { MigrationInterface, QueryRunner } from "typeorm";

export class MadeHeaderColumnNullable1728826025406 implements MigrationInterface {
    name = 'MadeHeaderColumnNullable1728826025406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" ALTER COLUMN "headerImage" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" ALTER COLUMN "headerImage" SET NOT NULL`);
    }

}
