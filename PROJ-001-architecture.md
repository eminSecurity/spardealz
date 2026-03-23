# PROJ-001: Projekt-Architektur & Setup

## Beschreibung
Initialer Aufbau des SparDealz-Projekts. MyDealz-Clone mit modernem Design, Deal-Anzeige und Vergleichsportal.

## Tech Stack
- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes + Prisma ORM
- **Datenbank:** PostgreSQL (oder SQLite für Dev)
- **Auth:** NextAuth.js
- **State:** Zustand / React Query
- **UI:** shadcn/ui Komponenten

## Features
1. Deal-Übersicht mit Filter/Sortierung
2. Deal-Detailseite mit Kommentaren
3. Preisvergleich-Widget
4. User-System (Registrierung/Login)
5. Deal-Upload (User-generated)
6. Voting-System (Hot/Kalt)
7. Kategorien & Tags
8. Suche & Filter
9. Admin-Dashboard
10. Responsive Design

## Projektstruktur
```
spardealz/
├── app/                    # Next.js App Router
│   ├── (main)/            # Haupt-Layout
│   ├── api/               # API Routes
│   └── admin/             # Admin-Bereich
├── components/            # React Komponenten
├── lib/                   # Utils, Hooks
├── prisma/                # Datenbank-Schema
├── public/                # Static Assets
└── types/                 # TypeScript Types
```

## Status: ✅ Done
