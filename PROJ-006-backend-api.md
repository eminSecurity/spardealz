# PROJ-006: Backend API Routes

## API Endpoints

### Deals
```
GET    /api/deals              # Alle Deals (mit Filter/Pagination)
POST   /api/deals              # Neuen Deal erstellen
GET    /api/deals/:id          # Einzelnen Deal abrufen
PUT    /api/deals/:id          # Deal aktualisieren
DELETE /api/deals/:id          # Deal löschen
GET    /api/deals/hot          # Heiße Deals
GET    /api/deals/new          # Neue Deals
GET    /api/deals/expiring     # Bald ablaufende Deals
```

### Votes
```
POST   /api/votes              # Vote erstellen/ändern
DELETE /api/votes/:id          # Vote entfernen
GET    /api/deals/:id/votes    # Votes für Deal
```

### Comments
```
GET    /api/deals/:id/comments # Kommentare für Deal
POST   /api/deals/:id/comments # Kommentar erstellen
DELETE /api/comments/:id       # Kommentar löschen
```

### Categories
```
GET    /api/categories         # Alle Kategorien
GET    /api/categories/:slug   # Kategorie mit Deals
```

### Search
```
GET    /api/search?q=...       # Suche
```

### Auth (NextAuth)
```
POST   /api/auth/signin        # Login
POST   /api/auth/signout       # Logout
POST   /api/auth/session       # Session abrufen
```

### Admin
```
GET    /api/admin/stats        # Dashboard-Stats
GET    /api/admin/pending      # Ausstehende Deals
PUT    /api/admin/deals/:id    # Deal moderieren
```

## Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  }
}
```

## Status: ✅ Done
