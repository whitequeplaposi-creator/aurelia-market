# Kategorisystem - Aurelia Market

## Översikt
Ett komplett kategorisystem för mode e-handel med 8 huvudkategorier och 24 produkter.

## Kategorier

### 1. 👗 Kläder Dam
**Produkter:** 3 st
- Elegant Sommarklänning - 899 kr
- Klassisk Blazer - 1499 kr
- Stickad Tröja - 799 kr

### 2. 👔 Kläder Herr
**Produkter:** 3 st
- Premium Skjorta - 699 kr
- Kostymbyxor - 999 kr
- Casual Polo - 549 kr

### 3. 👠 Skor Dam
**Produkter:** 2 st
- Eleganta Pumps - 1299 kr
- Sneakers Premium - 899 kr

### 4. 👞 Skor Herr
**Produkter:** 2 st
- Oxford Skor - 1599 kr
- Casual Loafers - 1199 kr

### 5. 🌸 Parfym
**Produkter:** 2 st
- Eau de Parfum - Floral - 899 kr
- Eau de Toilette - Fresh - 699 kr

### 6. 💄 Skönhet
**Produkter:** 3 st
- Ansiktsserum - Anti-Age - 599 kr
- Läppstift - Matte - 249 kr
- Ansiktsmask - Hydrating - 199 kr

### 7. 🏠 Hemredskap
**Produkter:** 3 st
- Doftljus - Vanilj - 299 kr
- Kuddfodral Set - 399 kr
- Vas - Keramik - 499 kr

### 8. 👜 Accessoarer
**Produkter:** 4 st
- Läderväska - 1899 kr
- Solglasögon - 1299 kr
- Plånbok - Läder - 599 kr
- Klocka - Minimalist - 2499 kr

## Funktioner

### Navigation
- **Desktop:** Horisontell kategori-meny under huvudmenyn
- **Mobil:** Kategori-lista i hamburger-menyn
- **Ikoner:** Varje kategori har en emoji-ikon för visuell identifiering

### Filtrering
- Klicka på en kategori för att visa endast produkter i den kategorin
- URL-parameter: `/products?category=kläder-dam`
- Kombinera med sökning: `/products?category=parfym&search=floral`

### Produktvisning
- Visar antal produkter som matchar filtret
- Dynamisk rubrik baserat på vald kategori
- Tydlig feedback när inga produkter hittas

## Teknisk Implementation

### Types (src/types/index.ts)
```typescript
export type ProductCategory = 
  | 'kläder-dam'
  | 'kläder-herr'
  | 'skor-dam'
  | 'skor-herr'
  | 'parfym'
  | 'skönhet'
  | 'hemredskap'
  | 'accessoarer';
```

### Mock Data (src/lib/mockData.ts)
- 24 produkter med realistiska bilder från Unsplash
- Varje produkt har en `category` property
- Helper-funktioner:
  - `getMockProductsByCategory(category)` - Hämta produkter per kategori
  - `getAllCategories()` - Hämta alla kategorier med namn och ikoner

### Header Component (src/components/Header.tsx)
- Desktop: Horisontell kategori-meny
- Mobil: Kategori-sektion i hamburger-menyn
- Responsiv design med smooth transitions

### Products Page (src/app/products/page.tsx)
- Läser `category` query parameter
- Filtrerar produkter baserat på kategori
- Kombinerar kategori-filter med sökfunktion
- Visar kategorinamn i rubriken

## Användning

### Navigera till kategori
```typescript
// Länk till kategori
<Link href="/products?category=kläder-dam">Kläder Dam</Link>

// Programmatiskt
router.push('/products?category=parfym');
```

### Hämta produkter per kategori (API)
```typescript
// I API route
import { getMockProductsByCategory } from '@/lib/mockData';

const products = getMockProductsByCategory('skönhet');
```

### Visa alla kategorier
```typescript
import { getAllCategories } from '@/lib/mockData';

const categories = getAllCategories();
// [
//   { id: 'kläder-dam', name: 'Kläder Dam', icon: '👗' },
//   ...
// ]
```

## Design

### Färger
- Kategori-länkar: `text-gray-600` hover `text-gold-600`
- Aktiv kategori: Kan läggas till med `text-gold-600 font-semibold`

### Layout
- Desktop: Flexbox med `space-x-6`
- Mobil: Vertikal lista med `space-y-2`
- Ikoner: Emoji för enkel implementation och universell support

### Responsivitet
- Desktop (> 1024px): Horisontell meny synlig
- Tablet/Mobil (< 1024px): Kategorier i hamburger-menyn
- Touch-vänliga knappar (minst 44x44px)

## Produktbilder
Alla produktbilder kommer från Unsplash med högkvalitativa foton:
- Optimerade för 800x800px
- Crop-mode för konsekvent visning
- Lazy loading för bättre performance

## Framtida förbättringar

### Kort sikt
- [ ] Visa antal produkter per kategori i menyn
- [ ] Breadcrumbs för bättre navigation
- [ ] Aktiv kategori-markering i menyn

### Lång sikt
- [ ] Underkategorier (t.ex. Kläder Dam → Klänningar, Toppar, Byxor)
- [ ] Kategori-landningssidor med banners
- [ ] Filtrera på flera kategorier samtidigt
- [ ] Sortering inom kategorier (pris, popularitet, nyhet)

## Testning

### Manuell testning
1. Gå till startsidan
2. Klicka på en kategori i menyn
3. Verifiera att endast produkter från den kategorin visas
4. Testa på både desktop och mobil
5. Kombinera kategori-filter med sökning

### Förväntade resultat
- ✅ Kategori-meny visas i headern (desktop)
- ✅ Kategorier visas i hamburger-menyn (mobil)
- ✅ Klick på kategori filtrerar produkter korrekt
- ✅ URL uppdateras med `?category=...`
- ✅ Rubrik visar kategorinamn
- ✅ Antal produkter visas korrekt

## Sammanfattning
Ett komplett och användarvänligt kategorisystem som:
- ✅ Täcker alla mode-kategorier
- ✅ 24 professionella produkter
- ✅ Responsiv design för alla enheter
- ✅ Enkel navigation med ikoner
- ✅ Kombineras med sökfunktion
- ✅ Professionell presentation

E-handeln har nu ett fullt fungerande kategorisystem! 🎉
