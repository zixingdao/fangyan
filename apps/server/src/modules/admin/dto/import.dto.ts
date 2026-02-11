import { IsString, IsBoolean, IsNumber, IsOptional, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { RecordType } from '@changsha/shared';

export class TrialResultItem {
  @IsString()
  studentId: string;

  @IsBoolean()
  passed: boolean;
}

export class ImportTrialDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrialResultItem)
  items: TrialResultItem[];
}

export class RecordingImportItem {
  @IsString()
  studentId: string;

  @IsNumber()
  duration: number; // in seconds

  @IsString()
  @IsOptional()
  filename?: string;
  
  @IsEnum(RecordType)
  @IsOptional()
  recordType?: RecordType; // 'solo' | 'dialogue'
}

export class ImportRecordingDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecordingImportItem)
  items: RecordingImportItem[];
}
