import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeVarchar1771538601929 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profiles" ALTER COLUMN "background_pic" TYPE character varying(600)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
