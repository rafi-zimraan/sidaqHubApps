# Security — SidaqHub

## Authentication
- Password hashing: bcrypt (future backend)
- Token storage: SecureStore (native) / AsyncStorage (fallback)
- Auto-logout on token expiry

## Data Protection
- No plain-text secrets in codebase
- Environment variables via `react-native-dotenv`
- API keys never exposed client-side

## Input Validation
- Email format validation (must contain @)
- Password minimum 8 characters
- SQL injection prevention via GraphQL (parameterized queries)

## Network Security
- HTTPS-only for API calls
- Certificate pinning (future)
- Rate limiting on auth endpoints (future)

## Storage Security
- AsyncStorage for non-sensitive data
- SecureStore for tokens (future)
- No credit card or sensitive PII stored

## Best Practices
- No `console.log` in production
- Dependency audits via `yarn audit`
- Regular security updates
- Content Security Policy for Web export
