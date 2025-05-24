import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('mock_tokens')
export class MockToken {
  @PrimaryColumn()
  symbol: string; // e.g., BTC, ETH

  @Column()
  name: string; // e.g., Bitcoin, Ethereum

  @Column('decimal', { precision: 18, scale: 8, nullable: true })
  price_usd: number;

  @Column('decimal', { precision: 24, scale: 2, nullable: true })
  market_cap_usd: number;
}