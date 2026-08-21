import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional, Matches, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function parseSurveyIds(value: unknown): number[] | undefined {
  if (value === undefined || value === '') return undefined;
  const values = String(value).split(',').map(Number);
  if (values.some((id) => !Number.isInteger(id) || id <= 0)) return values;
  return [...new Set(values)];
}

export class ActivityQueryDto {
  @ApiProperty({ example: '2026-01-01' })
  @Matches(DATE)
  from: string;

  @ApiProperty({ example: '2026-01-31' })
  @Matches(DATE)
  to: string;

  @ApiProperty({ required: false, example: '1,2' })
  @IsOptional()
  @Transform(({ value }) => parseSurveyIds(value))
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  surveyIds?: number[];
}

export class CountersQueryDto extends ActivityQueryDto {}

export class AnswersQueryDto extends ActivityQueryDto {
  @IsOptional()
  cursor?: string;
}
