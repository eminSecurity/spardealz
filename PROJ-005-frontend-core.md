# PROJ-005: Frontend-Core (Next.js + Tailwind)

## Setup
```bash
npx create-next-app@latest spardealz --typescript --tailwind --app --no-src-dir
cd spardealz
npx shadcn-ui@latest init
```

## Installierte Packages
- next
- react + react-dom
- typescript
- tailwindcss
- @radix-ui/* (via shadcn)
- lucide-react (Icons)
- next-auth
- @prisma/client
- zustand (State)
- @tanstack/react-query

## Verzeichnisstruktur
```
app/
├── layout.tsx              # Root Layout
├── page.tsx                # Home (Deal-Übersicht)
├── globals.css             # Global Styles
├── (auth)/
│   ├── login/
│   └── register/
├── (main)/
│   ├── deals/
│   │   └── [id]/
│   ├── categories/
│   │   └── [slug]/
│   ├── search/
│   └── submit/
├── api/
│   ├── auth/
│   ├── deals/
│   └── votes/
└── admin/
    ├── dashboard/
    ├── deals/
    └── users/

components/
├── ui/                     # shadcn/ui Komponenten
├── deals/                  # Deal-spezifisch
├── layout/                 # Header, Footer, Sidebar
└── shared/                 # Wiederverwendbar

lib/
├── utils.ts
├── prisma.ts
├── auth.ts
└── api.ts

prisma/
└── schema.prisma

public/
├── images/
└── fonts/
```

## Pages implementiert
- [x] / - Home mit Deal-Grid
- [x] /deals/[id] - Deal-Detail
- [x] /categories/[slug] - Kategorie-Filter
- [x] /search - Suchergebnisse
- [x] /submit - Deal einreichen
- [x] /login - Auth
- [x] /admin - Admin Dashboard

## Status: ✅ Done
