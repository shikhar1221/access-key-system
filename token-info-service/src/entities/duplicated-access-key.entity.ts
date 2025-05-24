import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('duplicated_access_keys')
export class DuplicatedAccessKey {
  @PrimaryColumn()
  apiKey: string;

  @Column()
  rateLimitPerMinute: number; // requests per minute or a similar interval

  @Column({ type: 'timestamp with time zone' })
  expiresAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}