import { IsString, IsBoolean, IsOptional, IsUUID, IsDateString } from 'class-validator';

export class CreateRequestLogDto {
  @IsString()
  apiKey: string;

  @IsString()
  requestPath: string;

  @IsBoolean()
  @IsOptional()
  isRateLimited?: boolean;

  @IsBoolean()
  @IsOptional()
  isSuccessful?: boolean;

  @IsString()
  @IsOptional()
  errorMessage?: string;
}

// We might not need an UpdateRequestLogDto as logs are typically immutable once created.
// If specific fields need to be updatable, an UpdateDto can be defined similarly.

export class RequestLogDto {
  @IsUUID()
  id: string;

  @IsString()
  apiKey: string;

  @IsDateString()
  timestamp: string;

  @IsString()
  requestPath: string;

  @IsBoolean()
  isRateLimited: boolean;

  @IsBoolean()
  isSuccessful: boolean;

  @IsString()
  @IsOptional()
  errorMessage?: string;
}