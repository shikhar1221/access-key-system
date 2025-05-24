import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateMockTokenDto {
  @IsString()
  symbol: string;

  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  price_usd?: number;

  @IsNumber()
  @IsOptional()
  market_cap_usd?: number;
}

export class UpdateMockTokenDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  price_usd?: number;

  @IsNumber()
  @IsOptional()
  market_cap_usd?: number;
}

export class MockTokenDto {
  @IsString()
  symbol: string;

  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  price_usd?: number;

  @IsNumber()
  @IsOptional()
  market_cap_usd?: number;
}