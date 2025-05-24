import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Added ApiProperty import

@Entity('access_keys')
export class AccessKey {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'Unique identifier for the access key' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'user-123', description: 'The ID of the user associated with this key' })
  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @ApiProperty({ example: 'sk_live_abcdef1234567890', description: 'The unique API key string' })
  @Column({ type: 'varchar', length: 255, unique: true })
  apiKey: string;

  @ApiProperty({ example: 100, description: 'The rate limit per minute for this key' })
  @Column({ type: 'int' })
  rateLimitPerMinute: number;

  @ApiProperty({ example: '2024-12-31T23:59:59.000Z', description: 'The expiration date of the key' })
  @Column({ type: 'timestamp with time zone' })
  expiresAt: Date;

  @ApiProperty({ example: true, description: 'Whether the key is active or not', default: true })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Timestamp of when the key was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp of when the key was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}