# Design Tokens — SidaqHub

## Color Tokens
| Token | Value | Usage |
|-------|-------|-------|
| COLORS.primary | #1A5C6B | Brand, buttons, links |
| COLORS.gold | #B8860B | Badges, accents |
| COLORS.primaryLight | rgba(26,92,107,0.08) | Active states |
| COLORS.text | #1A1A2E | Body text |
| COLORS.textSecondary | #6B7280 | Secondary text |
| COLORS.background | #F4F5F7 | Screen BG |
| COLORS.card | #FFFFFF | Card BG |
| COLORS.border | #E5E7EB | Borders |
| COLORS.error | #DC2626 | Errors |
| COLORS.success | #10B981 | Success |

## Font Tokens
| Token | Font | Weight |
|-------|------|--------|
| FONTS.regular | Poppins | 400 |
| FONTS.medium | Poppins | 500 |
| FONTS.semiBold | Poppins | 600 |
| FONTS.bold | Poppins | 700 |
| FONTS.arabic | Amiri | 400 |

## Spacing Tokens
| Token | Value |
|-------|-------|
| SPACING.xs | 4 |
| SPACING.sm | 8 |
| SPACING.md | 12 |
| SPACING.lg | 16 |
| SPACING.xl | 24 |

## Radius Tokens
| Token | Value |
|-------|-------|
| RADIUS.sm | 6 |
| RADIUS.md | 10 |
| RADIUS.lg | 16 |
| RADIUS.full | 999 |

## Shadow Tokens (StyleSheet)
```ts
shadowColor: COLORS.primary,
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.18,
shadowRadius: 12,
elevation: 4,
```
