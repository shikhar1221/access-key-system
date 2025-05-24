import { IsString, IsNumber, Min, IsDateString, IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger'; // Used ApiPropertyOptional for optional fields

export class UpdateAccessKeyDto {
  @ApiPropertyOptional({ example: 'user-123', description: 'The ID of the user associated with this key' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ example: 100, description: 'The rate limit per minute for this key', minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  rateLimitPerMinute?: number;

  @ApiPropertyOptional({ example: '2024-12-31T23:59:59.000Z', description: 'The expiration date of the key in ISO 8601 format' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string; // Using string for DTO, will be converted to Date in service

  @ApiPropertyOptional({ example: true, description: 'Whether the key is active or not' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}