import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1763530365294 implements MigrationInterface {
  name = 'Migrations1763530365294';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "alert" ADD "type" character varying NOT NULL DEFAULT 'SOS'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "alert" DROP COLUMN "type"`);
  }
}
