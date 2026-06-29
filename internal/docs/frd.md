# Functional Requirements Document — SidaqHub

## FR-01: User Registration
**ID**: FR-01
**Priority**: P0
**Description**: Pengguna mendaftar dengan form multi-step

### Fields
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Nama | Text | Yes | Min 2 chars |
| Email | Text | Yes | Must contain @ |
| Password | Text | Yes | Min 8 chars |
| Username | Text | No | Unique |
| Phone | Text | No | Numeric |
| Role | Select | Yes | santri/ustadz/huffadz |
| Gender | Select | Yes | L/P |
| Birthday | Text | No | YYYY-MM-DD format |
| JuzProgress | Number | No | 0-30 |

### Flow
1. Step 1: Informasi akun (nama, email, password)
2. Step 2: Data diri (foto, telepon, gender, role, lokasi)
3. Step 3: Profil huffadz (juz, bio, minat, hobi, keahlian)

## FR-02: User Login
**ID**: FR-02
**Priority**: P0
**Description**: Login dengan email + password

## FR-03: Profile Management
**ID**: FR-03
**Priority**: P0
**Description**: Lihat & edit profil lengkap

## FR-04: Feed
**ID**: FR-04
**Priority**: P1
**Description**: Timeline postingan + interaksi

## FR-05: Halaqah
**ID**: FR-05
**Priority**: P1
**Description**: Buat & kelola kelompok belajar

## FR-06: Notifications
**ID**: FR-06
**Priority**: P2
**Description**: Notifikasi aktivitas
