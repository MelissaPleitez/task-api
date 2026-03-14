import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCategoryIconLength1773510375706 implements MigrationInterface {
    name = 'UpdateCategoryIconLength1773510375706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "icon"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "icon" character varying(50) NOT NULL DEFAULT 'packageOpen'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "icon"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "icon" character varying(10) NOT NULL DEFAULT '📦'`);
    }

}
