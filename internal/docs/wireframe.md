# Wireframe — SidaqHub

## Screen Map

```
app/
├── index.tsx                    # Gate (auth check → redirect)
├── _layout.tsx                  # Root layout
│
├── (auth)/
│   ├── auth.tsx                 # Auth callback
│   ├── login.tsx                # Login form
│   ├── register.tsx             # Register (3-step form)
│   └── onboarding.tsx           # Onboarding setelah register
│
├── (tabs)/
│   ├── home.tsx                 # Feed + stories + FAB
│   ├── network.tsx              # Connections & suggestions
│   ├── community.tsx            # Halaqah & komunitas
│   ├── notifications.tsx        # Notifications
│   └── profile.tsx              # Profile + stats
│
├── post/
│   ├── [id].tsx                 # Post detail + comments
│   └── create.tsx               # Create post (modal)
│
├── halaqah/
│   ├── [id].tsx                 # Halaqah detail
│   └── create.tsx               # Create halaqah (modal)
│
├── user/
│   └── [id].tsx                 # User profile (other)
│
└── edit-profile.tsx             # Edit profile (modal)
```

## Auth Flow
```
index.tsx → useAuth()
  ├── no user → login.tsx
  │   ├── login success → (tabs)/home
  │   └── tap register → register.tsx
  │       └── register success → onboarding.tsx → (tabs)/home
  └── has user
      ├── profile_completed=false → onboarding.tsx
      └── profile_completed=true → (tabs)/home
```

## Navigation Structure
- Bottom Tabs: Home | Network | Community | (hidden Notifications) | Profile
- Stack screens: Post detail, Halaqah detail, User profile, Edit profile
