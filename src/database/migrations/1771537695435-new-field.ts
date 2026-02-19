import { MigrationInterface, QueryRunner } from "typeorm";

export class NewField1771537695435 implements MigrationInterface {
    name = 'NewField1771537695435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" ADD "background_pic" character varying(500)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "background_pic"`);
    }

}
