import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AES from 'crypto-js/aes';
import * as UTF8 from 'crypto-js/enc-utf8';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CryptoService {
  private LOCAL_SECRET_KEY: string;

  constructor(private readonly configService: ConfigService) {
    this.LOCAL_SECRET_KEY = configService.get('auth.aes.secret');
  }

  encryptAES(value: string) {
    return AES.encrypt(value, this.LOCAL_SECRET_KEY).toString();
  }

  decryptAES(value: string) {
    return AES.decrypt(value, this.LOCAL_SECRET_KEY).toString(UTF8);
  }

  compareHash(text: string, hashed: string) {
    return bcrypt.compareSync(text, hashed);
  }

  static hash(hashText: string) {
    const BCRYPT_SALT = 10 as const;

    return bcrypt.hashSync(hashText, BCRYPT_SALT);
  }
}
