import { IsString, IsEnum, IsBoolean, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PageType, ComponentType } from '../page-config.entity';

export class ComponentPropsDto {
  [key: string]: any;
}

export class PageComponentDto {
  @IsString()
  id: string;

  @IsEnum(ComponentType)
  type: ComponentType;

  @IsNumber()
  order: number;

  @IsOptional()
  props?: Record<string, any>;
}

export class CreatePageConfigDto {
  @IsEnum(PageType)
  pageType: PageType;

  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PageComponentDto)
  components: PageComponentDto[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePageConfigDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PageComponentDto)
  components?: PageComponentDto[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class PageConfigResponseDto {
  id: number;
  pageType: PageType;
  title: string;
  components: PageComponentDto[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
