# Coding Standard — SidaqHub

## TypeScript

### Imports
```ts
// ✅ Path alias
import { COLORS } from '@/src/constants/theme';

// ❌ Relative path
import { COLORS } from '../../constants/theme';
```

### Types
- Gunakan interface untuk object types
- Gunakan type untuk union/intersection
- Avoid `any` — gunakan `unknown` jika perlu

### Naming
- **Components**: PascalCase (`LoginScreen`, `Avatar`)
- **Functions**: camelCase (`handleLogin`, `toggleInterest`)
- **Files**: kebab-case (`login.tsx`, `edit-profile.tsx`)
- **Constants**: UPPER_SNAKE_CASE (`LOGIN_MUTATION`)

### React
```tsx
// ✅ Functional components with hooks
export default function LoginScreen() { ... }

// ✅ useCallback for handlers passed as props
const handlePress = useCallback(() => { ... }, [deps]);
```

### StyleSheet
```tsx
// ✅ Define styles at bottom of file
const styles = StyleSheet.create({ ... });

// ❌ Inline styles
<View style={{ marginTop: 10 }} />
```

## Error Handling
```tsx
try {
  await mutation();
} catch (err: any) {
  Alert.alert('Error', err.message);
}
```

## File Structure
```
Component file:
1. Imports (grouped: react → expo → library → internal)
2. Constants & types
3. Component function
4. StyleSheet
```
