import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'node:fs';
import { mkdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';

@Injectable()
export class StorageService {
  private readonly root: string;

  constructor(config: ConfigService) {
    this.root = resolve(config.get<string>('STORAGE_DIR') ?? './storage');
  }

  private pathFor(key: string) {
    const full = resolve(this.root, key);
    if (!full.startsWith(this.root + sep)) {
      throw new Error('Invalid storage key');
    }
    return full;
  }

  async put(key: string, data: Buffer) {
    const full = this.pathFor(key);
    await mkdir(dirname(full), { recursive: true });
    await writeFile(full, data, { flag: 'wx' });
  }

  async exists(key: string) {
    try {
      await stat(this.pathFor(key));
      return true;
    } catch {
      return false;
    }
  }

  read(key: string) {
    return createReadStream(this.pathFor(key));
  }

  async delete(key: string) {
    await rm(this.pathFor(key), { force: true });
  }
}
