import { Repository } from 'typeorm';

export class BaseRepository<T> extends Repository<T> {
  // Add common methods here if needed
}