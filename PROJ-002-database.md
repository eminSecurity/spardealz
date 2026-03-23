# PROJ-002: Datenbank-Schema & Prisma Setup

## Schema-Entwurf

### Models
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  username      String    @unique
  name          String?
  avatar        String?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deals         Deal[]
  votes         Vote[]
  comments      Comment[]
}

model Deal {
  id            String    @id @default(uuid())
  title         String
  description   String    @db.Text
  price         Decimal   @db.Decimal(10, 2)
  originalPrice Decimal?  @db.Decimal(10, 2)
  currency      String    @default("EUR")
  imageUrl      String?
  productUrl    String
  merchant      String
  category      Category  @relation(fields: [categoryId], references: [id])
  categoryId    String
  tags          Tag[]
  author        User      @relation(fields: [authorId], references: [id])
  authorId      String
  votes         Vote[]
  voteCount     Int       @default(0)
  temperature   Int       @default(0)  // Hot/Kalt Score
  comments      Comment[]
  status        DealStatus @default(PENDING)
  expiresAt     DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Vote {
  id        String   @id @default(uuid())
  deal      Deal     @relation(fields: [dealId], references: [id], onDelete: Cascade)
  dealId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  value     Int      // +1 oder -1
  createdAt DateTime @default(now())
  @@unique([dealId, userId])
}

model Comment {
  id        String   @id @default(uuid())
  content   String   @db.Text
  deal      Deal     @relation(fields: [dealId], references: [id], onDelete: Cascade)
  dealId    String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId  String
  createdAt DateTime @default(now())
}

model Category {
  id          String   @id @default(uuid())
  name        String   @unique
  slug        String   @unique
  icon        String?
  description String?
  deals       Deal[]
}

model Tag {
  id    String @id @default(uuid())
  name  String @unique
  slug  String @unique
  deals Deal[]
}
```

## Enums
```prisma
enum Role {
  USER
  MODERATOR
  ADMIN
}

enum DealStatus {
  PENDING
  ACTIVE
  EXPIRED
  REJECTED
}
```

## Status: ✅ Done
