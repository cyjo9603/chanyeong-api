import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [() => ({ auth: { aes: { secret: 'test' } } })],

          cache: true,
        }),
      ],
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('encrypt & decript test', () => {
    const planText = 'test';
    const encryptedText = service.encryptAES(planText);
    const decryptedText = service.decryptAES(encryptedText);

    expect(decryptedText).toBe(planText);
  });
});
