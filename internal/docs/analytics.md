# Analytics — SidaqHub

## Current State
Belum ada analytics terintegrasi.

## Planned Events

### User Events
| Event | Properties | Purpose |
|-------|------------|---------|
| sign_up | method, role | Track registrations |
| login | method | Track logins |
| profile_complete | step_count | Onboarding funnel |
| profile_edit | fields_changed | Profile engagement |

### Engagement Events
| Event | Properties |
|-------|------------|
| post_create | type (text/ayat/tilawah) |
| post_like | post_id |
| post_comment | post_id |
| halaqah_join | halaqah_id |
| halaqah_create | type (online/offline) |
| follow | target_user_id |

### Screen Views
```ts
// Automatic screen tracking (future)
Analytics.screenView('Home', { tab: 'feed' })
Analytics.screenView('Profile', { userId: '...' })
```

## Tools Considered
1. **Firebase Analytics** — Free, robust mobile analytics
2. **Mixpanel** — User behavior analytics
3. **PostHog** — Open-source product analytics

## Privacy
- No PII (Personally Identifiable Information) in events
- Opt-out mechanism required
- GDPR/CCPA compliance (future)
