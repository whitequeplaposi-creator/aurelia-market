-- Turso Database Complete Setup
-- Run this in Turso Dashboard SQL Console

-- ============================================
-- 1. CREATE TABLES
-- ============================================

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

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

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

-- ============================================
-- 3. INSERT TEST DATA
-- ============================================

-- Test customer (email: test@example.com, password: test123456)
INSERT INTO users (email, password_hash, role) 
VALUES ('test@example.com', '$2a$10$0VMVPlR9oemZdRpcyZNL/u8uz7fCv2AsVhJDzrzERdCJb1SklBU1e', 'customer');

-- Admin user (email: ngabulokana75@gmail.com, password: admin123456)
INSERT INTO users (email, password_hash, role) 
VALUES ('ngabulokana75@gmail.com', '$2a$10$08tohpIS1XyWV1b0nqOSR.RtAKaDYGweNjq6p5HNziKi2cqxvI1qS', 'admin');

-- Sample products
INSERT INTO products (name, description, price, image, stock, category, active) VALUES
('Premium Headphones', 'High-quality wireless headphones with noise cancellation', 299.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 50, 'Electronics', 1),
('Smart Watch', 'Fitness tracker with heart rate monitor', 199.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 30, 'Electronics', 1),
('Leather Wallet', 'Genuine leather bifold wallet', 49.99, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', 100, 'Accessories', 1),
('Running Shoes', 'Comfortable athletic shoes for running', 89.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 75, 'Fashion', 1),
('Coffee Maker', 'Programmable drip coffee maker', 79.99, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', 40, 'Home', 1);

-- ============================================
-- 4. VERIFY SETUP
-- ============================================

-- Check tables
SELECT 'Tables created:' as status;
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;

-- Check users
SELECT 'Users created:' as status;
SELECT email, role FROM users;

-- Check products
SELECT 'Products created:' as status;
SELECT name, price, category FROM products;
