# Accessibility — SidaqHub

## Standards
Mengacu pada **WCAG 2.1 Level AA** untuk web export.

## Current Implementation

### Touch Targets
- Minimum touch target: 44x44pt
- Buttons, links, icons meet this requirement
- `activeOpacity` props on TouchableOpacity

### Color Contrast
- Primary text (#1A1A2E) on white (#FFFFFF): ratio 16.5:1 ✅
- Secondary text (#6B7280) on white (#FFFFFF): ratio 4.6:1 ✅
- Error text (#DC2626) on white (#FFFFFF): ratio 5.3:1 ✅

### Labels & Test IDs
- `testID` props on key interactive elements
- Used for testing and potential automation

### Screen Reader Support
- Placeholder text on inputs
- `autoCapitalize` and `autoCorrect` configured appropriately
- Keyboard types set (`email-address`, `phone-pad`, etc.)

## Improvements Planned
- [ ] Add `accessibilityLabel` to all icon buttons
- [ ] Add `accessibilityHint` where needed
- [ ] Implement proper heading hierarchy
- [ ] Add focus management for modals
- [ ] Support reduced motion (Accessibility → Reduce Motion)
- [ ] Font scaling (Dynamic Type / Accessibility Font Size)
