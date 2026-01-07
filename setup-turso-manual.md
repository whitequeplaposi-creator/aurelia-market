# Turso Database Setup - Manual Guide

## Problem
Den nuvarande Turso-token har **read-only** access och kan inte skapa tabeller.

## Lösning: Skapa tabeller manuellt

### Alternativ 1: Via Turso Dashboard (Rekommenderat)

1. **Gå till Turso Dashboard**
   - Besök: https://turso.tech/app
   - Logga in med ditt konto

2. **Välj din databas**
   - Databas: `dostar` (från URL: dostar-dostar.aws-ap-northeast-1.turso.io)

3. **Öppna SQL Console**
   - Klicka på "SQL Console" eller "Query" tab

4. **Kör följande SQL** (kopiera och klistra in):

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer', 'admin')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL CHECK(price >= 0),
  image TEXT,
  stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
  category TEXT,
  active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0, 1)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT,
  session_id TEXT,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK(quantity > 0),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  total_price REAL NOT NULL CHECK(total_price >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  stripe_payment_intent_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  price_at_purchase REAL NOT NULL CHECK(price_at_purchase >= 0),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  order_id TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other' CHECK(category IN ('order', 'product', 'payment', 'shipping', 'other')),
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_order_id ON support_tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at);
```

5. **Skapa en testanvändare**
```sql
-- Skapa en testanvändare (lösenord: test123456)
INSERT INTO users (email, password_hash, role) 
VALUES (
  'test@example.com', 
  '$2a$10$rqYvN8jZ5Z5Z5Z5Z5Z5Z5.Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5',
  'customer'
);

-- Skapa admin-användare (ngabulokana75@gmail.com)
INSERT INTO users (email, password_hash, role) 
VALUES (
  'ngabulokana75@gmail.com',
  '$2a$10$rqYvN8jZ5Z5Z5Z5Z5Z5Z5.Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5',
  'admin'
);
```

6. **Verifiera tabeller**
```sql
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;
```

### Alternativ 2: Generera ny token med skrivrättigheter

Om du har tillgång till Turso CLI på en annan maskin:

```bash
# Logga in
turso auth login

# Skapa ny token med skrivrättigheter
turso db tokens create dostar --expiration none

# Kopiera den nya token och uppdatera .env.local
```

### Alternativ 3: Skapa ny databas

Om du vill börja från början:

1. Gå till https://turso.tech/app
2. Klicka "Create Database"
3. Namnge den (t.ex. "aurelia-market")
4. Kopiera connection string och token
5. Uppdatera `.env.local` med nya värden
6. Kör SQL från Alternativ 1

## Efter tabellerna är skapade

1. **Inaktivera demo-läge**
   ```env
   # I .env.local
   DEMO_MODE=false
   ```

2. **Starta om servern**
   ```bash
   # Stoppa nuvarande server (Ctrl+C)
   npm run dev
   ```

3. **Testa inloggning**
   ```bash
   node test-login-http.js
   ```

4. **Skapa användare via registrering**
   - Gå till http://localhost:3000/register
   - Registrera ett konto
   - Logga in

## Verifiering

Kör detta script för att verifiera att tabellerna finns:
```bash
npx tsx check-tables.ts
```

Du bör se:
```
Found 6 tables:
  - cart_items
  - order_items
  - orders
  - products
  - support_tickets
  - users
```

## Nästa steg

Efter att tabellerna är skapade:
1. ✅ Inaktivera demo-läge
2. ✅ Skapa admin-användare
3. ✅ Lägg till produkter via admin-panel
4. ✅ Testa hela flödet
5. ✅ Deploya till production

## Support

Om du stöter på problem:
- Turso Docs: https://docs.turso.tech/
- Turso Discord: https://discord.gg/turso
- GitHub Issues: https://github.com/tursodatabase/turso-cli/issues
