# Observability — SidaqHub

## Current State
Belum ada observability — tahap pengembangan awal.

## Planned Stack
| Tool | Purpose |
|------|---------|
| Sentry | Crash reporting & error tracking |
| Grafana | Metrics dashboard (future) |
| Prometheus | Metrics collection (future) |

## Logging Strategy
```ts
// Production logging guidelines
// - Gunakan logger wrapper, bukan console.log
// - Log level: error, warn, info, debug
// - Jangan log sensitive data (password, token)

// Example (future):
import * as Sentry from 'sentry-expo';
Sentry.captureException(error);
```

## Metrics to Track
- App startup time
- Screen load time
- API response time
- Crash-free rate
- Error rate per screen
- User engagement (sessions)

## Health Checks
- Backend: `/health` endpoint (future)
- Apollo Server: `/.well-known/apollo/server-health`
- Client: Network connectivity monitoring
