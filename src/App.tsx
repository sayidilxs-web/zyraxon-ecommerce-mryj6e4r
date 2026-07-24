import { useState, useEffect, useCallback, useRef } from 'react';
import headphonesImg from './assets/images/headphones.jpg';
import smartwatchImg from './assets/images/smartwatch.jpg';
import sneakersImg from './assets/images/sneakers.jpg';
import sunglassesImg from './assets/images/sunglasses.jpg';
import cameraImg from './assets/images/camera.jpg';
import perfumeImg from './assets/images/perfume.jpg';
import backpackImg from './assets/images/backpack.jpg';
import walletImg from './assets/images/wallet.jpg';
import keyboardImg from './assets/images/keyboard.jpg';

/* ========== TYPES ========== */
interface Product {
  id: number;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  image: string;
  tag?: 'new' | 'sale' | 'bestseller';
  rating: number;
  reviews: number;
  description: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

/* ========== DATA ========== */
const products: Product[] = [
  { id: 1, name: 'ProMax Wireless Headphones', category: 'Audio', categorySlug: 'audio', price: 299.99, originalPrice: 399.99, image: headphonesImg, tag: 'sale', rating: 4.8, reviews: 2341, description: 'Premium noise-cancelling wireless headphones with 40-hour battery life, spatial audio, and ultra-comfortable memory foam cushions. Perfect for immersive listening.' },
  { id: 2, name: 'Ultra Smart Watch Pro', category: 'Wearables', categorySlug: 'wearables', price: 449.99, image: smartwatchImg, tag: 'new', rating: 4.9, reviews: 1856, description: 'Advanced health monitoring smartwatch with AMOLED display, GPS tracking, heart rate sensor, and 14-day battery. Your ultimate fitness companion.' },
  { id: 3, name: 'AirRunner Elite Sneakers', category: 'Footwear', categorySlug: 'footwear', price: 189.99, originalPrice: 249.99, image: sneakersImg, tag: 'bestseller', rating: 4.7, reviews: 3102, description: 'Lightweight performance sneakers with responsive cushioning, breathable mesh upper, and durable rubber outsole. Designed for speed and comfort.' },
  { id: 4, name: 'Aviator Polarized Sunglasses', category: 'Accessories', categorySlug: 'accessories', price: 159.99, image: sunglassesImg, rating: 4.6, reviews: 987, description: 'Premium polarized sunglasses with UV400 protection, lightweight titanium frame, and anti-scratch coating. Timeless style meets modern protection.' },
  { id: 5, name: 'SnapShot Pro Camera', category: 'Electronics', categorySlug: 'electronics', price: 899.99, originalPrice: 1099.99, image: cameraImg, tag: 'sale', rating: 4.9, reviews: 1234, description: 'Professional mirrorless camera with 45MP sensor, 8K video recording, in-body stabilization, and AI-powered autofocus. Capture every moment in stunning detail.' },
  { id: 6, name: 'Noir Essence Perfume', category: 'Lifestyle', categorySlug: 'lifestyle', price: 129.99, image: perfumeImg, tag: 'new', rating: 4.8, reviews: 876, description: 'Luxury unisex fragrance with notes of oud, vanilla, and bergamot. Long-lasting 24-hour scent with elegant glass bottle design.' },
  { id: 7, name: 'Urban Explorer Backpack', category: 'Accessories', categorySlug: 'accessories', price: 179.99, image: backpackImg, tag: 'bestseller', rating: 4.7, reviews: 2543, description: 'Water-resistant travel backpack with laptop compartment, USB charging port, and ergonomic padded straps. Built for the modern adventurer.' },
  { id: 8, name: 'Heritage Leather Wallet', category: 'Accessories', categorySlug: 'accessories', price: 89.99, originalPrice: 119.99, image: walletImg, tag: 'sale', rating: 4.5, reviews: 1654, description: 'Handcrafted genuine leather wallet with RFID blocking, 12 card slots, and coin pocket. Slim profile with maximum functionality.' },
  { id: 9, name: 'MechForce RGB Keyboard', category: 'Electronics', categorySlug: 'electronics', price: 199.99, image: keyboardImg, tag: 'new', rating: 4.8, reviews: 1432, description: 'Premium mechanical keyboard with hot-swappable switches, per-key RGB lighting, aircraft-grade aluminum frame, and wireless connectivity.' },
];

const categories = [
  { name: 'All', slug: 'all', icon: 'grid', count: products.length },
  { name: 'Audio', slug: 'audio', icon: 'headphones', count: products.filter(p => p.categorySlug === 'audio').length },
  { name: 'Electronics', slug: 'electronics', icon: 'cpu', count: products.filter(p => p.categorySlug === 'electronics').length },
  { name: 'Wearables', slug: 'wearables', icon: 'watch', count: products.filter(p => p.categorySlug === 'wearables').length },
  { name: 'Footwear', slug: 'footwear', icon: 'footprints', count: products.filter(p => p.categorySlug === 'footwear').length },
  { name: 'Accessories', slug: 'accessories', icon: 'gem', count: products.filter(p => p.categorySlug === 'accessories').length },
  { name: 'Lifestyle', slug: 'lifestyle', icon: 'sparkles', count: products.filter(p => p.categorySlug === 'lifestyle').length },
];

/* ========== SVG ICONS ========== */
const Icons = {
  logo: () => (
    <svg viewBox="0 0 36 36" fill="none">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36">
          <stop offset="0%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#ec4899"/>
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="10" fill="url(#logoGrad)"/>
      <path d="M10 26V10l8 8 8-8v16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  cart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  heart: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  ),
  heartFilled: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  ),
  star: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  starEmpty: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  close: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  minus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  trash: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
    </svg>
  ),
  shoppingBag: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  arrowRight: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  truck: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  shield: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  refresh: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
    </svg>
  ),
  headset: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>
    </svg>
  ),
  home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  grid: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  tag: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  user: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  check: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  headphones: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>
    </svg>
  ),
  cpu: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>
    </svg>
  ),
  watch: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 01-2 1.82H9.83a2 2 0 01-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 019.83 1h4.35a2 2 0 012 1.82l.35 3.83"/>
    </svg>
  ),
  footprints: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5 10 7.89 8 10 8 12h1"/>
      <path d="M18 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C12.63 6 12 7.8 12 9.5 12 11.89 14 14 14 16"/>
    </svg>
  ),
  gem: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6 3 18 3 22 9 12 22 2 9"/><line x1="2" y1="9" x2="22" y2="9"/><path d="M12 22l4-13H8l4 13z"/>
    </svg>
  ),
  sparkles: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  ),
};

/* ========== CATEGORY ICON HELPER ========== */
function getCategoryIcon(slug: string) {
  switch(slug) {
    case 'audio': return <Icons.headphones />;
    case 'electronics': return <Icons.cpu />;
    case 'wearables': return <Icons.watch />;
    case 'footwear': return <Icons.footprints />;
    case 'accessories': return <Icons.gem />;
    case 'lifestyle': return <Icons.sparkles />;
    default: return <Icons.grid />;
  }
}

/* ========== STAR RATING ========== */
function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="product-card-rating">
      <div className="stars">
        {[1,2,3,4,5].map(i => (
          <span key={i} className={i <= Math.round(rating) ? '' : 'star-empty'}>
            <Icons.star />
          </span>
        ))}
      </div>
      <span className="rating-count">({reviews.toLocaleString()})</span>
    </div>
  );
}

/* ========== MAIN APP ========== */
export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const [scrolled, setScrolled] = useState(false);

  /* Scroll listener */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Intersection Observer for reveal animations */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [activeCategory]);

  /* Toast */
  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2500);
  }, []);

  /* Cart operations */
  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`${product.name} added to cart!`);
  }, [showToast]);

  const removeFromCart = useCallback((productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  }, []);

  const toggleWishlist = useCallback((productId: number) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);

  /* Computed values */
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.categorySlug === activeCategory);

  return (
    <>
      {/* Background */}
      <div className="bg-gradient">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <a href="#" className="navbar-logo">
            <Icons.logo />
            <span>ZYRAXON</span>
          </a>

          <ul className="navbar-links">
            <li><a href="#" className="active">Home</a></li>
            <li><a href="#products">Shop</a></li>
            <li><a href="#categories">Categories</a></li>
            <li><a href="#features">About</a></li>
          </ul>

          <div className="navbar-actions">
            <div className="navbar-search">
              <Icons.search />
              <span>Search products...</span>
            </div>
            <button className="cart-btn" onClick={() => setCartOpen(true)}>
              <Icons.cart />
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </button>
            <button className="mobile-menu-btn">
              <Icons.menu />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="dot" />
              New Collection 2026
            </div>
            <h1>
              Discover <span className="gradient-text">Premium</span> Products for Modern Lifestyle
            </h1>
            <p>Explore our curated collection of high-end electronics, fashion, and lifestyle products. Crafted with precision, designed for you.</p>
            <div className="hero-buttons">
              <a href="#products" className="btn-primary">
                Shop Now <Icons.arrowRight />
              </a>
              <a href="#categories" className="btn-secondary">
                Explore Categories
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">15K+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Premium Products</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4.9</div>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-glow" />
              <img className="hero-card-image" src={headphonesImg} alt="Featured Product" />
              <div className="hero-card-info">
                <h3>ProMax Headphones</h3>
                <p>$299.99</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories reveal" id="categories">
        <div className="section-header">
          <div className="section-tag">Browse</div>
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Find exactly what you're looking for in our curated categories</p>
        </div>
        <div className="categories-grid">
          {categories.map(cat => (
            <div
              key={cat.slug}
              className={`category-card glass-card ${activeCategory === cat.slug ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.slug)}
            >
              <div className="category-icon">
                {getCategoryIcon(cat.slug)}
              </div>
              <h3>{cat.name}</h3>
              <p>{cat.count} products</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="products" id="products">
        <div className="section-header reveal">
          <div className="section-tag">Collection</div>
          <h2 className="section-title">
            {activeCategory === 'all' ? 'Featured Products' : categories.find(c => c.slug === activeCategory)?.name + ' Products'}
          </h2>
          <p className="section-subtitle">Handpicked premium products just for you</p>
        </div>
        <div className="products-grid">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="product-card glass-card reveal"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="product-card-image">
                <img src={product.image} alt={product.name} loading="lazy" />
                <div className="product-card-overlay">
                  {product.tag && (
                    <span className={`product-tag ${product.tag}`}>{product.tag}</span>
                  )}
                  <button
                    className={`product-wishlist ${wishlist.includes(product.id) ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                  >
                    {wishlist.includes(product.id) ? <Icons.heartFilled /> : <Icons.heart />}
                  </button>
                </div>
                <div className="product-quick-actions">
                  <button className="quick-action-btn" onClick={() => setSelectedProduct(product)}>
                    Quick View
                  </button>
                  <button className="quick-action-btn primary" onClick={() => addToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="product-card-body">
                <div className="product-card-category">{product.category}</div>
                <h3 className="product-card-title">{product.name}</h3>
                <StarRating rating={product.rating} reviews={product.reviews} />
                <div className="product-card-price">
                  <span className="price-current">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <>
                      <span className="price-original">${product.originalPrice.toFixed(2)}</span>
                      <span className="price-discount">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features reveal" id="features">
        <div className="section-header">
          <div className="section-tag">Why Us</div>
          <h2 className="section-title">The ZYRAXON Difference</h2>
          <p className="section-subtitle">We go above and beyond for every customer</p>
        </div>
        <div className="features-grid">
          {[
            { icon: <Icons.truck />, title: 'Free Shipping', desc: 'Free worldwide shipping on all orders over $100. Fast and reliable delivery.' },
            { icon: <Icons.shield />, title: 'Secure Payment', desc: '100% secure payment processing. Your data is protected with encryption.' },
            { icon: <Icons.refresh />, title: 'Easy Returns', desc: '30-day hassle-free return policy. Not satisfied? Send it back, no questions.' },
            { icon: <Icons.headset />, title: '24/7 Support', desc: 'Round-the-clock customer support. We are always here to help you.' },
          ].map((feature, i) => (
            <div key={i} className="feature-card glass-card" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter reveal">
        <div className="newsletter-card glass-strong">
          <h2>Stay in the Loop</h2>
          <p>Subscribe to our newsletter for exclusive deals, new arrivals, and insider-only discounts.</p>
          <div className="newsletter-form">
            <input className="newsletter-input" type="email" placeholder="Enter your email address" />
            <button className="btn-primary" onClick={() => showToast('Subscribed successfully!')}>
              Subscribe <Icons.arrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#" className="navbar-logo" style={{ marginBottom: 0 }}>
                <Icons.logo />
                <span>ZYRAXON</span>
              </a>
              <p>Premium products for the modern lifestyle. Quality craftsmanship meets innovative design.</p>
              <div className="footer-socials">
                {['Twitter', 'Instagram', 'GitHub'].map(social => (
                  <a key={social} href="#" className="footer-social-link" title={social}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="footer-col">
              <h4>Shop</h4>
              <ul>
                <li><a href="#">New Arrivals</a></li>
                <li><a href="#">Best Sellers</a></li>
                <li><a href="#">Sale</a></li>
                <li><a href="#">All Products</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Shipping Info</a></li>
                <li><a href="#">Returns</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 ZYRAXON Store. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <div className={`cart-overlay ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)} />
      <div className={`cart-sidebar ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>
            <Icons.shoppingBag />
            <span>Your Cart</span>
            <span className="cart-count-label">({cartItemCount} items)</span>
          </h2>
          <button className="cart-close" onClick={() => setCartOpen(false)}>
            <Icons.close />
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <Icons.shoppingBag />
              <h3>Your cart is empty</h3>
              <p>Start shopping to add items to your cart</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.product.image} alt={item.product.name} />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.product.name}</div>
                  <div className="cart-item-category">{item.product.category}</div>
                  <div className="cart-item-bottom">
                    <span className="cart-item-price">${(item.product.price * item.quantity).toFixed(2)}</span>
                    <div className="cart-item-qty">
                      <button className="qty-btn" onClick={() => updateQuantity(item.product.id, -1)}>
                        <Icons.minus />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.product.id, 1)}>
                        <Icons.plus />
                      </button>
                    </div>
                  </div>
                </div>
                <button className="cart-item-remove" onClick={() => removeFromCart(item.product.id)}>
                  <Icons.trash />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="cart-subtotal">
              <span>Shipping</span>
              <span style={{ color: 'var(--success)' }}>Free</span>
            </div>
            <div className="cart-total">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={() => { showToast('Order placed successfully!'); setCart([]); setCartOpen(false); }}>
              <Icons.check />
              Checkout Now
            </button>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <div className={`modal-overlay ${selectedProduct ? 'open' : ''}`} onClick={() => setSelectedProduct(null)}>
        {selectedProduct && (
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>
              <Icons.close />
            </button>
            <div className="modal-image">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
            </div>
            <div className="modal-info">
              <div className="modal-category">{selectedProduct.category}</div>
              <h2 className="modal-title">{selectedProduct.name}</h2>
              <div className="modal-rating">
                <StarRating rating={selectedProduct.rating} reviews={selectedProduct.reviews} />
              </div>
              <p className="modal-description">{selectedProduct.description}</p>
              <div className="modal-price">
                <span className="price-current">${selectedProduct.price.toFixed(2)}</span>
                {selectedProduct.originalPrice && (
                  <>
                    <span className="price-original">${selectedProduct.originalPrice.toFixed(2)}</span>
                    <span className="price-discount">
                      -{Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>
                Add to Cart <Icons.cart />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      <div className={`toast ${toast.visible ? 'show' : ''}`}>
        <Icons.check />
        {toast.message}
      </div>

      {/* Mobile Bottom Nav */}
      <div className="mobile-bottom-nav">
        <div className="mobile-bottom-nav-inner">
          <button className="mobile-nav-item active">
            <Icons.home />
            <span>Home</span>
          </button>
          <button className="mobile-nav-item" onClick={() => { document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <Icons.grid />
            <span>Categories</span>
          </button>
          <button className="mobile-nav-item" onClick={() => { document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <Icons.tag />
            <span>Shop</span>
          </button>
          <button className="mobile-nav-item" onClick={() => setCartOpen(true)}>
            <Icons.cart />
            <span>Cart</span>
            {cartItemCount > 0 && <span className="mobile-cart-badge">{cartItemCount}</span>}
          </button>
          <button className="mobile-nav-item">
            <Icons.user />
            <span>Account</span>
          </button>
        </div>
      </div>
    </>
  );
}
