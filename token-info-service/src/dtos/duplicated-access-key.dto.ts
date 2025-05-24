import { IsString, IsInt, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateDuplicatedAccessKeyDto {
  @IsString()
  apiKey: string;

  @IsInt()
  rateLimitPerMinute: number;

  @IsDateString()
  expiresAt: string; // ISO Date string

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateDuplicatedAccessKeyDto {
  @IsInt()
  @IsOptional()
  rateLimitPerMinute?: number;

  @IsDateString()
  @IsOptional()
  expiresAt?: string; // ISO Date string

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}