import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult, HealthIndicator, HealthCheckError } from '@nestjs/terminus';

@Injectable()
export class AppHealthIndicator extends HealthIndicator {
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = true;
    const result = this.getStatus(key, isHealthy);
    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('App check failed', result);
  }
}
