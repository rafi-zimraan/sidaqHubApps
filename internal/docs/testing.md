# Testing — SidaqHub

## Testing Strategy
| Type | Tool | Coverage Target |
|------|------|-----------------|
| Unit | Jest | 80%+ |
| Component | @testing-library/react-native | 70%+ |
| Integration | React Native Testing Library | 60%+ |
| E2E | Detox (future) | Critical paths |

## Running Tests
```bash
yarn test              # Run all tests
yarn test:watch        # Watch mode
yarn test:coverage     # With coverage report
```

## Test Structure
```
__tests__/
├── utils/
│   └── theme.test.ts       # Theme constants tests
├── components/
│   └── Profile.test.tsx     # Component tests (future)
└── screens/
    └── Login.test.tsx       # Screen tests (future)
```

## What to Test
1. **Utils & Helpers** — formatTime, getJuzBadge, formatSchedule
2. **Auth Context** — login, logout, updateUser flow
3. **Screens** — rendering, navigation, form validation
4. **Components** — Avatar, JuzGrid, CircleProgress

## Mocking
- `src/utils/mock.ts` — API responses
- `@apollo/client` — mutations/queries
- `expo-router` — navigation

## Coverage Setup
- Jest config in `package.json`
- Istanbul for coverage reporting
- Minimum 80% line coverage target
