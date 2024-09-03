import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigrations1725113404562 implements MigrationInterface {
    name = 'InitialMigrations1725113404562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "membershipId" character varying NOT NULL, "title" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "gender" character varying NOT NULL, "affiliation" character varying NOT NULL, "dateOfBirth" character varying NOT NULL, "jobTitle" character varying NOT NULL, "highestDegree" character varying NOT NULL, "careerStatus" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_5c3de66efa2ca583780ffedb90e" UNIQUE ("membershipId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blogs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "image" character varying, "tags" text NOT NULL, "description" character varying NOT NULL, "body" text NOT NULL, "author" character varying NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "conferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "eventName" character varying NOT NULL, "speakers" text NOT NULL, "location" character varying NOT NULL, "startDate" character varying NOT NULL, "endDate" character varying NOT NULL, "time" character varying NOT NULL, "image" character varying NOT NULL, "body" text NOT NULL, "eventImages" text, "eventImageDesc" character varying, "date" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d28afb89755d548215ce4e7667b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "conferences"`);
        await queryRunner.query(`DROP TABLE "blogs"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
