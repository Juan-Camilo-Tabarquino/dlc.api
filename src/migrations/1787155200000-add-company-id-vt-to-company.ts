import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCompanyIdVtToCompany1787155200000
  implements MigrationInterface
{
  name = 'AddCompanyIdVtToCompany1787155200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // TODO juan mora: crear y aplicar la migración/persistencia de companyIdVt en Company.
    await queryRunner.query(
      `ALTER TABLE "company" ADD "companyIdVt" integer NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "companyIdVt"`);
  }
}
