# Backup & Recovery — SidaqHub

## Current State
Belum ada data production (masih mock data). Backup relevan saat backend aktif.

## Database Backup (Future)

### PostgreSQL (Supabase)
```bash
# Automated daily backup (Supabase built-in)
# Point-in-time recovery support

# Manual backup
pg_dump -h <host> -U <user> -d sidaqhub > backup_$(date +%Y%m%d).sql
```

### Backup Schedule
| Data | Frequency | Retention |
|------|-----------|-----------|
| User data | Daily | 30 days |
| Posts | Daily | 30 days |
| Media files | Weekly | 90 days |
| Analytics | Monthly | 12 months |

## Recovery Plan

### Level 1: Minor Issue
- App crash → restart app
- Network error → retry

### Level 2: Data Issue
- User data corrupted → restore from last backup
- Re-run migration scripts

### Level 3: Major Issue
- Database corrupted → point-in-time recovery
- Full restore from backup

## Disaster Recovery
- Multi-region deployment (future)
- Database replication (future)
- Incident response plan (future)
