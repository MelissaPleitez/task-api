import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropSpentAmountFromBudgets1776360881440 implements MigrationInterface {
  name = 'DropSpentAmountFromBudgets1776360881440';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "budgets" DROP COLUMN "spentAmount"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "budgets" ADD "spentAmount" numeric(15,2) NOT NULL DEFAULT '0'`);
  }
}
