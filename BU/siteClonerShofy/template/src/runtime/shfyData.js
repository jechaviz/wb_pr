export const ROUTE_ALIAS = {
  "/": "main_page",
  "/main_page": "main_page",
  "/blog": "blog",
  "/brands": "brands",
  "/careers": "careers",
  "/cart": "cart",
  "/categories": "categories",
  "/coming-soon": "coming-soon",
  "/compare": "compare",
  "/contact": "contact",
  "/cookie-policy": "cookie-policy",
  "/coupons": "coupons",
  "/faqs": "faqs",
  "/faq": "faqs",
  "/login": "login",
  "/our-story": "our-story",
  "/products": "products-grid",
  "/products-grid": "products-grid",
  "/products-list": "products-list",
  "/product-detail": "product-detail",
  "/product-compare": "product-compare",
  "/register": "register",
  "/shipping": "shipping",
  "/stores": "stores",
  "/wishlist": "wishlist",
  "/checkout": "checkout",
  "/orders/tracking": "shipping",
  "/customer/overview": "user-dashboard",
  "/customer/dashboard": "user-dashboard",
  "/admin/dashboard": "admin-dashboard"
};

export const LANGUAGE_OPTIONS = ["English", "Vietnamese", "Arabic", "French"];
export const CURRENCY_OPTIONS = ["USD", "EUR", "VND", "NGN"];

export const HOME_DROPDOWN = [
  { label: "Electronics", slug: "main_page" },
  { label: "Fashion", slug: "products-grid" },
  { label: "Beauty", slug: "products-list" },
  { label: "Jewelry", slug: "product-detail" },
  { label: "Grocery", slug: "categories" }
];

export const SHOP_DROPDOWN = [
  { label: "Shop Categories", slug: "categories" },
  { label: "Shop Brands", slug: "brands" },
  { label: "Shop List", slug: "products-list" },
  { label: "Shop Grid", slug: "products-grid" },
  { label: "Product Detail", slug: "product-detail" },
  { label: "Product Compare Matrix", slug: "product-compare" },
  { label: "Grab Coupons", slug: "coupons" },
  { label: "Cart", slug: "cart" },
  { label: "Checkout", slug: "checkout" },
  { label: "Compare", slug: "compare" },
  { label: "Wishlist", slug: "wishlist" },
  { label: "Track Your Order", slug: "shipping" }
];

export const PAGES_DROPDOWN = [
  { label: "About", slug: "our-story" },
  { label: "Store Location", slug: "stores" },
  { label: "Blogs", slug: "blog" },
  { label: "FAQs", slug: "faqs" },
  { label: "Login", slug: "login" },
  { label: "Register", slug: "register" },
  { label: "User Dashboard", slug: "user-dashboard" },
  { label: "Admin Dashboard", slug: "admin-dashboard" },
  { label: "Contact", slug: "contact" },
  { label: "Careers", slug: "careers" }
];

export const CATEGORY_MENU = [
  "New Arrivals",
  "Electronics",
  "Gifts",
  "Computers",
  "Smartphones & Tablets",
  "TV, Video & Music",
  "Cameras",
  "Cooking",
  "Accessories",
  "Sports",
  "Electronics Gadgets"
];

export const MEGA_COLUMNS = [
  {
    title: "Featured",
    image: "https://shofy.botble.com/storage/main/product-categories/menu-1.jpg",
    links: ["Featured", "New Arrivals", "Best Sellers", "Mobile Phone", "Gaming Console"]
  },
  {
    title: "Computers & Laptops",
    image: "https://shofy.botble.com/storage/main/product-categories/menu-2.jpg",
    links: ["Top Brands", "Weekly Best Selling", "CPU Heat Pipes", "CPU Coolers", "Playstation"]
  },
  {
    title: "Accessories",
    image: "https://shofy.botble.com/storage/main/product-categories/menu-3.jpg",
    links: ["Headphones", "Wireless Headphones", "TWS Earphones", "Smart Watch", "Accessories"]
  }
];

export const FOOTER_LINKS = {
  myAccount: [
    { label: "Track Orders", slug: "shipping" },
    { label: "Shipping", slug: "shipping" },
    { label: "Wishlist", slug: "wishlist" },
    { label: "My Account", slug: "user-dashboard" },
    { label: "Order History", slug: "user-dashboard" },
    { label: "Returns", slug: "shipping" }
  ],
  information: [
    { label: "Our Story", slug: "our-story" },
    { label: "Careers", slug: "careers" },
    { label: "Privacy Policy", slug: "cookie-policy" },
    { label: "Latest News", slug: "blog" },
    { label: "Contact Us", slug: "contact" }
  ],
  tagsA: ["Top Brands", "Best Sellers", "Computers & Laptops", "Mobile Phone", "CPU Heat Pipes", "Accessories", "CPU Coolers"],
  tagsB: ["Featured", "New Arrivals", "TWS Earphones", "Gifts", "Computers", "Playstation"],
  tagsC: ["Headphones", "Wireless Headphones", "Accessories", "TWS Earphones", "CPU Coolers", "Smart Watch", "Gaming Console"]
};
