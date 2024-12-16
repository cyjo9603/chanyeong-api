import { Test, TestingModule } from '@nestjs/testing';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppHealthIndicator } from './app.health';

import configuration from '../config/configuration';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TerminusModule,
        ConfigModule.forRoot({
          load: [configuration],

          cache: true,
        }),
      ],
      controllers: [AppController],
      providers: [AppHealthIndicator],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      expect(await appController.check()).toEqual({
        details: {
          app: {
            status: 'up',
          },
        },
        error: {},
        info: {
          app: {
            status: 'up',
          },
        },
        status: 'ok',
      });
    });
  });
});
