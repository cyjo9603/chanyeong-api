import * as Sentry from '@sentry/nestjs';

export function initSentry(dsn: string) {
  Sentry.init({
    dsn,
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
  });
}
