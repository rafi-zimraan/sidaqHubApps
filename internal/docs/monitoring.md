# Monitoring — SidaqHub

## Current State
Belum ada sistem monitoring. Aplikasi berjalan secara lokal.

## Future Monitoring Plan

### Crash Reporting
```bash
# Integration with Sentry
npx expo install sentry-expo
```

### Performance Monitoring
- React Native Performance Monitor
- Hermes engine profiling
- Metro bundler analysis

### User Analytics
```bash
# Integration (future)
npx expo install expo-analytics
```

### Alerts
- Error rate > 1% → notification
- API latency > 2s → notification
- Crash-free rate < 99% → notification

### Dashboard Metrics
| Metric | Target | Check Frequency |
|--------|--------|-----------------|
| Crash-free rate | > 99.5% | Daily |
| API success rate | > 99.9% | Per minute |
| App start time | < 3s | Per session |
| ANR rate | < 0.1% | Daily |
