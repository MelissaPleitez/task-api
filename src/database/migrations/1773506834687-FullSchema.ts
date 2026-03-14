import { MigrationInterface, QueryRunner } from "typeorm";

export class FullSchema1773506834687 implements MigrationInterface {
    name = 'FullSchema1773506834687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_26d8aec71ae9efbe468043cd2b9"`);
        await queryRunner.query(`CREATE TYPE "public"."budgets_period_enum" AS ENUM('weekly', 'monthly', 'yearly')`);
        await queryRunner.query(`CREATE TABLE "budgets" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "limitAmount" numeric(15,2) NOT NULL, "spentAmount" numeric(15,2) NOT NULL DEFAULT '0', "period" "public"."budgets_period_enum" NOT NULL, "startDate" TIMESTAMP WITH TIME ZONE NOT NULL, "endDate" TIMESTAMP WITH TIME ZONE NOT NULL, "alertEnabled" boolean NOT NULL DEFAULT false, "alertThreshPct" integer NOT NULL DEFAULT '80', "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, "category_id" integer, "account_id" integer, CONSTRAINT "PK_9c8a51748f82387644b773da482" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."recurring_transactions_type_enum" AS ENUM('income', 'expense', 'transfer')`);
        await queryRunner.query(`CREATE TYPE "public"."recurring_transactions_frequency_enum" AS ENUM('daily', 'weekly', 'monthly', 'yearly')`);
        await queryRunner.query(`CREATE TABLE "recurring_transactions" ("id" SERIAL NOT NULL, "description" character varying(255) NOT NULL, "type" "public"."recurring_transactions_type_enum" NOT NULL, "amount" numeric(15,2) NOT NULL, "frequency" "public"."recurring_transactions_frequency_enum" NOT NULL, "startDate" TIMESTAMP WITH TIME ZONE NOT NULL, "endDate" TIMESTAMP WITH TIME ZONE, "nextDueDate" TIMESTAMP WITH TIME ZONE, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, "category_id" integer, "account_id" integer, CONSTRAINT "PK_6485db3243762a54992dc0ce3b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."categories_type_enum" AS ENUM('income', 'expense', 'transfer')`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying(80) NOT NULL, "icon" character varying(10) NOT NULL DEFAULT '📦', "color" character varying(7) NOT NULL DEFAULT '#888888', "type" "public"."categories_type_enum" NOT NULL, "isSystem" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reports_type_enum" AS ENUM('weekly', 'monthly', 'yearly', 'custom')`);
        await queryRunner.query(`CREATE TABLE "reports" ("id" SERIAL NOT NULL, "type" "public"."reports_type_enum" NOT NULL, "title" character varying(120) NOT NULL, "startDate" TIMESTAMP WITH TIME ZONE NOT NULL, "endDate" TIMESTAMP WITH TIME ZONE NOT NULL, "data" jsonb NOT NULL DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_d9013193989303580053c0b5ef6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "category"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "accountId"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "isRecurring" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "account_id" integer`);
        await queryRunner.query(`DELETE FROM "transactions" WHERE "account_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "account_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "category_id" integer`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "recurring_transaction_id" integer`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('pending', 'in_progress', 'done')`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "priority"`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_priority_enum" AS ENUM('low', 'medium', 'high')`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "priority" "public"."tasks_priority_enum"`);
        await queryRunner.query(`DELETE FROM "tasks" WHERE "priority" IS NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "priority" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "category"`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_category_enum" AS ENUM('work', 'personal', 'finance', 'study', 'freelancer', 'gym')`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "category" "public"."tasks_category_enum"`);
        await queryRunner.query(`DELETE FROM "tasks" WHERE "category" IS NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "category" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "amount" TYPE numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "budgets" ADD CONSTRAINT "FK_5d25d8bbd6c209261dfe04558f1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budgets" ADD CONSTRAINT "FK_4bb589bf6db49e8c1fd6af05f49" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budgets" ADD CONSTRAINT "FK_08e12ed853dff5bbc38849cf7f4" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recurring_transactions" ADD CONSTRAINT "FK_d78f3002f99b0f15a3797201c92" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recurring_transactions" ADD CONSTRAINT "FK_eb623e5e626cf95fd42710adf25" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recurring_transactions" ADD CONSTRAINT "FK_49ccbdbeef159c1c12b1931a5b7" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_2296b7fe012d95646fa41921c8b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_49c0d6e8ba4bfb5582000d851f0" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_c9e41213ca42d50132ed7ab2b0f" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_50371499043ce644481531ce059" FOREIGN KEY ("recurring_transaction_id") REFERENCES "recurring_transactions"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reports" ADD CONSTRAINT "FK_ca7a21eb95ca4625bd5eaef7e0c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reports" DROP CONSTRAINT "FK_ca7a21eb95ca4625bd5eaef7e0c"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_50371499043ce644481531ce059"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_c9e41213ca42d50132ed7ab2b0f"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_49c0d6e8ba4bfb5582000d851f0"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_2296b7fe012d95646fa41921c8b"`);
        await queryRunner.query(`ALTER TABLE "recurring_transactions" DROP CONSTRAINT "FK_49ccbdbeef159c1c12b1931a5b7"`);
        await queryRunner.query(`ALTER TABLE "recurring_transactions" DROP CONSTRAINT "FK_eb623e5e626cf95fd42710adf25"`);
        await queryRunner.query(`ALTER TABLE "recurring_transactions" DROP CONSTRAINT "FK_d78f3002f99b0f15a3797201c92"`);
        await queryRunner.query(`ALTER TABLE "budgets" DROP CONSTRAINT "FK_08e12ed853dff5bbc38849cf7f4"`);
        await queryRunner.query(`ALTER TABLE "budgets" DROP CONSTRAINT "FK_4bb589bf6db49e8c1fd6af05f49"`);
        await queryRunner.query(`ALTER TABLE "budgets" DROP CONSTRAINT "FK_5d25d8bbd6c209261dfe04558f1"`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "amount" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "category"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_category_enum"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "category" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "priority"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "priority" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "recurring_transaction_id"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "category_id"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "account_id"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "isRecurring"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "accountId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "category" character varying(100) NOT NULL`);
        await queryRunner.query(`DROP TABLE "reports"`);
        await queryRunner.query(`DROP TYPE "public"."reports_type_enum"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TYPE "public"."categories_type_enum"`);
        await queryRunner.query(`DROP TABLE "recurring_transactions"`);
        await queryRunner.query(`DROP TYPE "public"."recurring_transactions_frequency_enum"`);
        await queryRunner.query(`DROP TYPE "public"."recurring_transactions_type_enum"`);
        await queryRunner.query(`DROP TABLE "budgets"`);
        await queryRunner.query(`DROP TYPE "public"."budgets_period_enum"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_26d8aec71ae9efbe468043cd2b9" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
