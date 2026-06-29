# Design System — SidaqHub

## Overview
Design system SidaqHub dibangun dengan prinsip konsistensi, skalabilitas, dan kemudahan maintenance.

## Foundation
- **Theme**: `src/constants/theme.ts`
- **Colors**: COLORS object dengan palette lengkap
- **Fonts**: FONTS object (Poppins + Amiri)
- **Spacing**: SPACING object (xs=4, sm=8, md=12, lg=16, xl=24)
- **Radius**: RADIUS object (sm=6, md=10, lg=16, full=999)

## Component Hierarchy
```
Design System
├── Tokens (colors, fonts, spacing, radius)
├── Atoms (Avatar, Text, Icon)
├── Molecules (Input, Button, Card)
└── Organisms (ProfileCard, PostCard, HalaqahCard)
```

## Usage Guidelines
1. **Never hardcode values** — selalu gunakan theme constants
2. **Path alias** — import dari `@/src/constants/theme`
3. **Consistency** — gunakan SPACING.md untuk margin standar
4. **Overrides** — minimal, gunakan theme default

## Dark Mode (Planned)
- Theme switching via context
- Dark color palette terdefinisi
- `userInterfaceStyle: 'automatic'` di app.json
