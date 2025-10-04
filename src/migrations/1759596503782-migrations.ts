import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1759596503782 implements MigrationInterface {
  name = 'Migrations1759596503782';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company" ADD "monitoringTime" text array NOT NULL DEFAULT '{"06:00:00", "18:00:00"}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company" DROP COLUMN "monitoringTime"`,
    );
  }
}
