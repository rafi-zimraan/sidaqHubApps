# Database — SidaqHub

## Schema (Mock → Future PostgreSQL)

### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(50) UNIQUE,
  phone VARCHAR(20),
  birthday DATE,
  role VARCHAR(20) CHECK (role IN ('santri','ustadz','huffadz')),
  photo_url TEXT,
  cover_photo_url TEXT,
  province_id INT,
  city_id INT,
  verification_level VARCHAR(20) DEFAULT 'basic',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Huffadz Profiles
```sql
CREATE TABLE huffadz_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  city VARCHAR(100),
  province VARCHAR(100),
  bio TEXT,
  verified_juz INT DEFAULT 0,
  badge_tier VARCHAR(20),
  gender CHAR(1) CHECK (gender IN ('L','P')),
  interests TEXT[],
  hobbies TEXT[],
  juz_progress INT DEFAULT 0,
  experiences JSONB,
  certifications JSONB,
  skills TEXT[],
  show_skills BOOLEAN DEFAULT true,
  show_experiences BOOLEAN DEFAULT true
);
```

### Posts
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content TEXT,
  type VARCHAR(20) CHECK (type IN ('text','ayat','tilawah')),
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Halaqahs
```sql
CREATE TABLE halaqahs (
  id UUID PRIMARY KEY,
  name VARCHAR(200),
  description TEXT,
  type VARCHAR(20) CHECK (type IN ('online','offline')),
  schedule JSONB,
  max_members INT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```
