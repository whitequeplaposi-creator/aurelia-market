// Mock data för demo-läge
import { Product, User, CartItem, Order, OrderStatus } from '@/types';

export const mockProducts: Product[] = [
  // KLÄDER - DAM
  {
    id: 'klader-dam-1',
    name: 'Elegant Sommarklänning',
    description: 'Luftig sommarklänning i premium bomull. Perfekt för varma dagar. Finns i flera färger.',
    price: 899,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop',
    stock: 25,
    category: 'kläder-dam',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'klader-dam-2',
    name: 'Klassisk Blazer',
    description: 'Tidlös blazer i ull-mix. Perfekt för kontoret eller festliga tillfällen. Skräddarsydd passform.',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&h=800&fit=crop',
    stock: 18,
    category: 'kläder-dam',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'klader-dam-3',
    name: 'Stickad Tröja',
    description: 'Mysig stickad tröja i mjuk merinoull. Varm och bekväm för kalla dagar.',
    price: 799,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=800&fit=crop',
    stock: 30,
    category: 'kläder-dam',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // KLÄDER - HERR
  {
    id: 'klader-herr-1',
    name: 'Premium Skjorta',
    description: 'Elegant skjorta i egyptisk bomull. Non-iron behandling för enkel skötsel. Slim fit.',
    price: 699,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=800&fit=crop',
    stock: 35,
    category: 'kläder-herr',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'klader-herr-2',
    name: 'Kostymbyxor',
    description: 'Klassiska kostymbyxor i ull. Perfekt passform och hög komfort. Finns i flera färger.',
    price: 999,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=800&fit=crop',
    stock: 22,
    category: 'kläder-herr',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'klader-herr-3',
    name: 'Casual Polo',
    description: 'Bekväm polo i pikétrikå. Perfekt för vardagen eller golfrunden. Andningsbar och slitstark.',
    price: 549,
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&h=800&fit=crop',
    stock: 40,
    category: 'kläder-herr',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // SKOR - DAM
  {
    id: 'skor-dam-1',
    name: 'Eleganta Pumps',
    description: 'Klassiska pumps i äkta läder. 7 cm klack för perfekt balans mellan stil och komfort.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop',
    stock: 20,
    category: 'skor-dam',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'skor-dam-2',
    name: 'Sneakers Premium',
    description: 'Bekväma sneakers i läder och textil. Perfekt för vardagen. Mjuk innersula.',
    price: 899,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
    stock: 28,
    category: 'skor-dam',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // SKOR - HERR
  {
    id: 'skor-herr-1',
    name: 'Oxford Skor',
    description: 'Klassiska oxford-skor i premium läder. Perfekt till kostymen. Handgjorda detaljer.',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&h=800&fit=crop',
    stock: 15,
    category: 'skor-herr',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'skor-herr-2',
    name: 'Casual Loafers',
    description: 'Bekväma loafers i mocka. Perfekt för smart casual. Mjuk gummsula.',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&h=800&fit=crop',
    stock: 18,
    category: 'skor-herr',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // PARFYM
  {
    id: 'parfym-1',
    name: 'Eau de Parfum - Floral',
    description: 'Elegant doftkomposition med toner av jasmin och ros. Långvarig doft. 50ml.',
    price: 899,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=800&fit=crop',
    stock: 45,
    category: 'parfym',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'parfym-2',
    name: 'Eau de Toilette - Fresh',
    description: 'Fräsch doft med citrus och havstoner. Perfekt för vardagen. 100ml.',
    price: 699,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&h=800&fit=crop',
    stock: 38,
    category: 'parfym',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // SKÖNHET
  {
    id: 'skonhet-1',
    name: 'Ansiktsserum - Anti-Age',
    description: 'Lyxigt ansiktsserum med hyaluronsyra och vitamin C. Minskar fina linjer. 30ml.',
    price: 599,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop',
    stock: 50,
    category: 'skönhet',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'skonhet-2',
    name: 'Läppstift - Matte',
    description: 'Långvarig läppstift med matt finish. Återfuktande formula. Finns i 12 nyanser.',
    price: 249,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=800&fit=crop',
    stock: 60,
    category: 'skönhet',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'skonhet-3',
    name: 'Ansiktsmask - Hydrating',
    description: 'Återfuktande ansiktsmask med aloe vera. Ger omedelbar lyster. 5-pack.',
    price: 199,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=800&fit=crop',
    stock: 42,
    category: 'skönhet',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // HEMREDSKAP
  {
    id: 'hemredskap-1',
    name: 'Doftljus - Vanilj',
    description: 'Lyxigt doftljus i glas. Naturligt sojav ax. Brinntid 40 timmar.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1602874801006-e24aa9f9e4c7?w=800&h=800&fit=crop',
    stock: 55,
    category: 'hemredskap',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'hemredskap-2',
    name: 'Kuddfodral Set',
    description: 'Eleganta kuddfodral i linne. 2-pack. Dold blixtlås. 50x50 cm.',
    price: 399,
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&h=800&fit=crop',
    stock: 32,
    category: 'hemredskap',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'hemredskap-3',
    name: 'Vas - Keramik',
    description: 'Handgjord keramikvas. Unik design. Perfekt för blombuketter. Höjd 25 cm.',
    price: 499,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&h=800&fit=crop',
    stock: 24,
    category: 'hemredskap',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // ACCESSOARER
  {
    id: 'accessoarer-1',
    name: 'Läderväska',
    description: 'Elegant läderväska i italienskt läder. Flera fack. Justerbar axelrem.',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop',
    stock: 16,
    category: 'accessoarer',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'accessoarer-2',
    name: 'Solglasögon',
    description: 'Designer solglasögon med UV-skydd. Polariserade linser. Inkluderar etui.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop',
    stock: 22,
    category: 'accessoarer',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'accessoarer-3',
    name: 'Plånbok - Läder',
    description: 'Minimalistisk plånbok i äkta läder. RFID-skydd. Plats för 8 kort.',
    price: 599,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop',
    stock: 35,
    category: 'accessoarer',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'accessoarer-4',
    name: 'Klocka - Minimalist',
    description: 'Elegant armbandsur med minimalistisk design. Safirg las. Vattentät 50m.',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
    stock: 12,
    category: 'accessoarer',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// In-memory storage för demo
export const mockStorage = {
  users: [] as User[],
  cartItems: [] as CartItem[],
  orders: [] as Order[],
  sessionId: 'demo-session-' + Date.now(),
};

// Mock user för demo (automatisk inloggning)
export const mockDemoUser: User = {
  id: 'demo-user-1',
  email: 'demo@aurelia-market.se',
  role: 'customer',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Auth functions för demo
export function createMockUser(email: string, password: string): User {
  const user: User = {
    id: 'user-' + Date.now(),
    email,
    role: 'customer',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockStorage.users.push(user);
  return user;
}

export function findMockUser(email: string): User | undefined {
  return mockStorage.users.find(u => u.email === email);
}

export function authenticateMockUser(email: string, password: string): User | null {
  // I demo mode, acceptera alla inloggningar
  const existingUser = findMockUser(email);
  if (existingUser) return existingUser;
  
  // Skapa ny användare automatiskt
  return createMockUser(email, password);
}

// Cart functions för demo
export function addToMockCart(productId: string, quantity: number, userId?: string): CartItem {
  const product = getMockProduct(productId);
  if (!product) throw new Error('Product not found');
  
  const existingItem = mockStorage.cartItems.find(
    item => item.productId === productId && (item.userId === userId || item.sessionId === mockStorage.sessionId)
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.updatedAt = new Date();
    return existingItem;
  }
  
  const cartItem: CartItem = {
    id: 'cart-' + Date.now(),
    userId,
    sessionId: mockStorage.sessionId,
    productId,
    product,
    quantity,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  mockStorage.cartItems.push(cartItem);
  return cartItem;
}

export function getMockCart(userId?: string): CartItem[] {
  return mockStorage.cartItems.filter(
    item => item.userId === userId || item.sessionId === mockStorage.sessionId
  );
}

export function updateMockCartItem(itemId: string, quantity: number): CartItem | undefined {
  const item = mockStorage.cartItems.find(i => i.id === itemId);
  if (item) {
    item.quantity = quantity;
    item.updatedAt = new Date();
  }
  return item;
}

export function removeMockCartItem(itemId: string): void {
  const index = mockStorage.cartItems.findIndex(item => item.id === itemId);
  if (index > -1) {
    mockStorage.cartItems.splice(index, 1);
  }
}

export function clearMockCart(userId?: string): void {
  mockStorage.cartItems = mockStorage.cartItems.filter(
    item => item.userId !== userId && item.sessionId !== mockStorage.sessionId
  );
}

// Order functions för demo
export function createMockOrder(userId: string, cartItems: CartItem[]): Order {
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  const orderId = 'order-' + Date.now();
  const order: Order = {
    id: orderId,
    userId,
    totalPrice,
    status: 'paid',
    stripePaymentIntentId: 'demo_pi_' + Date.now(),
    items: cartItems.map((item, index) => ({
      id: 'orderitem-' + Date.now() + '-' + index,
      orderId,
      productId: item.productId,
      product: item.product,
      quantity: item.quantity,
      priceAtPurchase: item.product.price,
      createdAt: new Date(),
    })),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  mockStorage.orders.push(order);
  clearMockCart(userId);
  return order;
}

export function getMockOrders(userId: string): Order[] {
  return mockStorage.orders.filter(order => order.userId === userId);
}

export function getMockOrder(orderId: string): Order | undefined {
  return mockStorage.orders.find(order => order.id === orderId);
}

export function updateMockOrderStatus(orderId: string, status: OrderStatus): Order | undefined {
  const order = getMockOrder(orderId);
  if (order) {
    order.status = status;
    order.updatedAt = new Date();
  }
  return order;
}

// Helper functions
export function getMockProducts(): Product[] {
  return mockProducts.filter(p => p.active);
}

export function getMockProduct(id: string): Product | undefined {
  return mockProducts.find(p => p.id === id && p.active);
}

export function getMockProductsByCategory(category: string): Product[] {
  return mockProducts.filter(p => p.active && p.category === category);
}

export function getAllCategories() {
  return [
    { id: 'kläder-dam', name: 'Kläder Dam', icon: '👗' },
    { id: 'kläder-herr', name: 'Kläder Herr', icon: '👔' },
    { id: 'skor-dam', name: 'Skor Dam', icon: '👠' },
    { id: 'skor-herr', name: 'Skor Herr', icon: '👞' },
    { id: 'parfym', name: 'Parfym', icon: '🌸' },
    { id: 'skönhet', name: 'Skönhet', icon: '💄' },
    { id: 'hemredskap', name: 'Hemredskap', icon: '🏠' },
    { id: 'accessoarer', name: 'Accessoarer', icon: '👜' },
  ];
}

export function isDemoMode(): boolean {
  // Kontrollera om vi är på server-sidan
  if (typeof window === 'undefined') {
    return process.env.DEMO_MODE === 'true';
  }
  // På klient-sidan, returnera false (API:et hanterar demo mode)
  return false;
}
