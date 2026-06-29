# Performance — SidaqHub

## Current Optimizations

### Rendering
- Hermes engine enabled (newArchEnabled: true)
- `useNativeDriver` for animations
- `Animated.View` with opacity/transform (avoid layout props)
- `ScrollView` with `bounces` = false on Android

### Images
- Expo Image component (caching)
- Base64 for uploaded profile photos (temporary)
- Image picker quality: 0.5

### Bundle Size
- Metro cache stored on disk
- Tree shaking via ES modules
- Lazy imports via Expo Router file-based routing

### State Management
- React Context for auth (minimal re-renders)
- `useCallback` for handlers
- `useFocusEffect` for screen focus

## Performance Targets
| Metric | Target |
|--------|--------|
| App startup | < 2s |
| Screen transition | < 300ms |
| Feed scroll | 60fps |
| Bundle size (APK) | < 30MB |
| Memory usage | < 200MB |

## Monitoring
- Hermes sampling profiler
- React DevTools (development)
- Flipper (development)

## Bottlenecks (Future)
- Layout thrashing in complex screens
- Image loading in feed (need caching)
- Re-renders in notification list
