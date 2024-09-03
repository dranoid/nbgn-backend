import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPhoneNumberAndVerifiedColumnsToUser1725115128980 implements MigrationInterface {
    name = 'AddedPhoneNumberAndVerifiedColumnsToUser1725115128980'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phoneNumber" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "verified" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verified"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phoneNumber"`);
    }

}
