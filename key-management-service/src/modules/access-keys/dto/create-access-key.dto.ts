import { IsString, IsNumber, Min, IsDateString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Added ApiProperty import

export class CreateAccessKeyDto {
  @ApiProperty({ example: 'user-123', description: 'The ID of the user associated with this key' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 100, description: 'The rate limit per minute for this key', minimum: 1 })
  @IsNumber()
  @Min(1)
  rateLimitPerMinute: number;

  @ApiProperty({ example: '2025-12-31T23:59:59.000Z', description: 'The expiration date of the key in ISO 8601 format' })
  @IsDateString()
  expiresAt: string; // Using string for DTO, will be converted to Date in service

  @ApiProperty({ example: true, description: 'Whether the key is active or not', required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}