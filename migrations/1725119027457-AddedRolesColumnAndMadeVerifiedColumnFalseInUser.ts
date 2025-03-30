import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedRolesColumnAndMadeVerifiedColumnFalseInUser1725119027457 implements MigrationInterface {
    name = 'AddedRolesColumnAndMadeVerifiedColumnFalseInUser1725119027457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_roles_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "roles" "public"."users_roles_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "verified" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "verified" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
        await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
    }

}
