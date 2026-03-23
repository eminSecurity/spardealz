# PROJ-007: Preisvergleich-Portal

## Konzept
Nutzer können Produkte vergleichen und die besten Preise finden.

## Features
1. **Produkt-Suche** - Nach Name, EAN, Modell suchen
2. **Preis-Historie** - Graph über Zeit
3. **Händler-Vergleich** - Wer bietet den besten Preis?
4. **Preis-Alarm** - Benachrichtigung bei Preisdrop
5. **Gutschein-Integration** - Gutscheine mit einrechnen

## Datenmodell
```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  ean         String?  @unique
  brand       String?
  category    String?
  imageUrl    String?
  description String?  @db.Text
  specs       Json?    // Technische Daten
  prices      Price[]
  alerts      PriceAlert[]
}

model Price {
  id          String   @id @default(uuid())
  product     Product  @relation(fields: [productId], references: [id])
  productId   String
  merchant    String
  price       Decimal  @db.Decimal(10, 2)
  shipping    Decimal? @db.Decimal(10, 2)
  url         String
  inStock     Boolean  @default(true)
  recordedAt  DateTime @default(now())
}

model PriceAlert {
  id          String   @id @default(uuid()))
  product     Product  @relation(fields: [productId], references: [id])
  productId   String
  user        User     @relation(fields: [userId], references: [id])
  userId      String
  targetPrice Decimal  @db.Decimal(10, 2)
  active      Boolean  @default(true)
}
```

## UI-Komponenten
- ProductCard mit Preis-Vergleich
- PriceHistoryChart (Recharts)
- Alert-Setup Modal
- Merchant-Filter

## Status: ✅ Done
