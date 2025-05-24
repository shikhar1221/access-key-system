import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('request_logs')
export class RequestLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  apiKey: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column()
  requestPath: string;

  @Column({ default: false })
  isRateLimited: boolean;

  @Column({ default: true })
  isSuccessful: boolean; // True if the request was processed, false if an error occurred before processing (e.g., invalid key, rate limit)

  @Column({ nullable: true })
  errorMessage?: string; // Optional: To store error messages for failed requests
}