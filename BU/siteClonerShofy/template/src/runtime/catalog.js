export const PRODUCT_CATALOG = [
  {
    id: "prod-tv-18",
    name: "Sony A90J 4K OLED Smart TV",
    price: "$699.00",
    oldPrice: "$799.00",
    rating: 4.7,
    reviews: 126,
    tag: "TV",
    category: "Electronics",
    brand: "Sony",
    store: "Frito-Lay",
    desc: "Premium OLED display with deep blacks, HDR brilliance, and low-latency gaming support.",
    img: "https://shofy.botble.com/storage/main/products/product-18-600x600.jpg"
  },
  {
    id: "prod-tv-02",
    name: "Apple TV 4K (2nd Generation)",
    price: "$399.00",
    oldPrice: "$449.00",
    rating: 4.8,
    reviews: 98,
    tag: "Streaming",
    category: "Electronics",
    brand: "Apple",
    store: "The Quaker Oats Company",
    desc: "Fast streaming media hub with 4K HDR output, Dolby Atmos, and smooth app navigation.",
    img: "https://shofy.botble.com/storage/main/products/product-2-600x600.jpg"
  },
  {
    id: "prod-tv-06",
    name: "Roku Ultra Streaming Media Player",
    price: "$246.00",
    oldPrice: "$300.00",
    rating: 4.6,
    reviews: 77,
    tag: "Media",
    category: "Electronics",
    brand: "Roku",
    store: "StarKist",
    desc: "Powerful streaming player with stable Wi-Fi performance and broad app compatibility.",
    img: "https://shofy.botble.com/storage/main/products/product-6-600x600.jpg"
  },
  {
    id: "prod-tv-10",
    name: "Amazon Fire TV Stick 4K Max",
    price: "$120.00",
    oldPrice: "$150.00",
    rating: 4.5,
    reviews: 142,
    tag: "Streaming",
    category: "Electronics",
    brand: "Amazon",
    store: "Frito-Lay",
    desc: "Compact 4K streaming dongle with voice remote and fast app launch times.",
    img: "https://shofy.botble.com/storage/main/products/product-10-600x600.jpg"
  },
  {
    id: "prod-tv-08",
    name: "Google Chromecast with Google TV",
    price: "$180.00",
    oldPrice: "$230.00",
    rating: 4.7,
    reviews: 66,
    tag: "TV",
    category: "Electronics",
    brand: "Google",
    store: "Nestle",
    desc: "Smart casting and streaming device with curated recommendations and voice search.",
    img: "https://shofy.botble.com/storage/main/products/product-8-600x600.jpg"
  },
  {
    id: "prod-tv-01",
    name: "NVIDIA SHIELD TV Pro",
    price: "$320.00",
    oldPrice: "$360.00",
    rating: 4.8,
    reviews: 58,
    tag: "Gaming",
    category: "Computers",
    brand: "NVIDIA",
    store: "GoPro",
    desc: "Flagship Android TV experience with AI upscaling and premium game streaming support.",
    img: "https://shofy.botble.com/storage/main/products/product-1-600x600.jpg"
  },
  {
    id: "prod-audio-2",
    name: "Sonos Beam Gen 2 Soundbar",
    price: "$299.00",
    oldPrice: "$359.00",
    rating: 4.6,
    reviews: 41,
    tag: "Audio",
    category: "Accessories",
    brand: "Sonos",
    store: "Robert's Store",
    desc: "Compact premium soundbar with clear dialogue, wide soundstage, and smart integrations.",
    img: "https://shofy.botble.com/storage/main/products/product-details-desc-2-600x600.jpg"
  },
  {
    id: "prod-audio-12",
    name: "Bose Smart Soundbar 900",
    price: "$279.00",
    oldPrice: "$319.00",
    rating: 4.4,
    reviews: 35,
    tag: "Audio",
    category: "Accessories",
    brand: "Bose",
    store: "Bose",
    desc: "Immersive audio profile with sleek design for modern entertainment setups.",
    img: "https://shofy.botble.com/storage/main/products/product-12-600x600.jpg"
  },
  {
    id: "prod-phone-4",
    name: "5G Smartphone Pro Max",
    price: "$489.00",
    oldPrice: "$559.00",
    rating: 4.5,
    reviews: 73,
    tag: "Phone",
    category: "Smartphones & Tablets",
    brand: "Samsung",
    store: "AromaStore",
    desc: "Slim 5G smartphone with advanced camera system and long-lasting battery.",
    img: "https://shofy.botble.com/storage/main/products/product-4-600x600.jpg"
  },
  {
    id: "prod-phone-5",
    name: "Galaxy Smart Tablet S",
    price: "$530.00",
    oldPrice: "$620.00",
    rating: 4.7,
    reviews: 52,
    tag: "Tablet",
    category: "Smartphones & Tablets",
    brand: "Samsung",
    store: "AromaStore",
    desc: "High-resolution display and smooth stylus workflow for media and productivity.",
    img: "https://shofy.botble.com/storage/main/products/product-5-600x600.jpg"
  },
  {
    id: "prod-head-3",
    name: "Wireless Headphones X1",
    price: "$149.00",
    oldPrice: "$189.00",
    rating: 4.3,
    reviews: 88,
    tag: "Headphones",
    category: "Accessories",
    brand: "Shofy Audio",
    store: "Shofy Direct",
    desc: "Comfort-driven over-ear headphones with balanced sound and passive noise isolation.",
    img: "https://shofy.botble.com/storage/main/products/product-3-600x600.jpg"
  },
  {
    id: "prod-watch-9",
    name: "Smart Watch Elite",
    price: "$229.00",
    oldPrice: "$279.00",
    rating: 4.4,
    reviews: 37,
    tag: "Wearable",
    category: "Smart Watch",
    brand: "Shofy Wear",
    store: "Shofy Direct",
    desc: "Fitness-ready smartwatch with health tracking and vibrant always-on display.",
    img: "https://shofy.botble.com/storage/main/products/product-9-600x600.jpg"
  }
];

export function normalizeString(value) {
  return String(value || "").toLowerCase().trim();
}

export function parsePriceValue(price) {
  const parsed = parseFloat(String(price || "0").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function findProductById(id) {
  const key = normalizeString(id);
  if (!key) return null;
  return PRODUCT_CATALOG.find(function (item) {
    return normalizeString(item.id) === key;
  }) || null;
}

export function filterProductsByQuery(items, query) {
  const q = normalizeString(query);
  if (!q) return items.slice();
  return items.filter(function (item) {
    const haystack = [item.name, item.tag, item.brand, item.category, item.store, item.desc].map(normalizeString).join(" ");
    return haystack.includes(q);
  });
}

export function sortProducts(items, mode) {
  const next = items.slice();
  if (mode === "price_asc") {
    next.sort(function (a, b) { return parsePriceValue(a.price) - parsePriceValue(b.price); });
  } else if (mode === "price_desc") {
    next.sort(function (a, b) { return parsePriceValue(b.price) - parsePriceValue(a.price); });
  } else if (mode === "rating_desc") {
    next.sort(function (a, b) { return Number(b.rating || 0) - Number(a.rating || 0); });
  }
  return next;
}

export function getCatalogByCategory(category) {
  const key = normalizeString(category);
  if (!key) return PRODUCT_CATALOG.slice();
  return PRODUCT_CATALOG.filter(function (item) {
    return normalizeString(item.category) === key;
  });
}

export function getCatalogByBrand(brand) {
  const key = normalizeString(brand);
  if (!key) return PRODUCT_CATALOG.slice();
  return PRODUCT_CATALOG.filter(function (item) {
    return normalizeString(item.brand) === key;
  });
}
