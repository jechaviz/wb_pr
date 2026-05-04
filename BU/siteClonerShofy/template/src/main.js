import * as Vue from "https://cdn.jsdelivr.net/npm/vue@3/dist/vue.esm-browser.prod.js";
import { loadModule } from "https://cdn.jsdelivr.net/npm/vue3-sfc-loader/dist/vue3-sfc-loader.esm.js";
import { routes, defaultRouteSlug, findRouteByHash } from "./routes.js";
import { applySetOfMarks } from "./runtime/setOfMarks.js";
import {
  ROUTE_ALIAS,
  LANGUAGE_OPTIONS,
  CURRENCY_OPTIONS,
  HOME_DROPDOWN,
  SHOP_DROPDOWN,
  PAGES_DROPDOWN,
  CATEGORY_MENU,
  MEGA_COLUMNS,
  FOOTER_LINKS
} from "./runtime/shfyData.js";
import { PRODUCT_CATALOG, findProductById } from "./runtime/catalog.js";

const APP_SHELL_TEMPLATE = window.__APP_SHELL_TEMPLATE__ || "<div></div>";

const STORE_KEY = "waiba.site-cloner-shofy.commerce.v3";
const UI_KEY = "waiba.site-cloner-shofy.ui.v3";
const SESSION_KEY = "waiba.site-cloner-shofy.session.v1";

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function parsePrice(text) {
  const n = parseFloat(String(text || "0").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function normalizeProduct(product) {
  const src = product || {};
  const name = String(src.name || "Product").trim();
  const id = String(src.id || slugify(name) || ("item-" + Math.random().toString(36).slice(2, 10)));
  return {
    id,
    name,
    price: String(src.price || "$0.00"),
    tag: String(src.tag || "General"),
    img: String(src.img || "https://shofy.botble.com/storage/main/general/placeholder.png")
  };
}

const savedStore = loadJson(STORE_KEY, {});
const savedUi = loadJson(UI_KEY, {});
const savedSession = loadJson(SESSION_KEY, {});
const savedUser = savedSession && savedSession.user && typeof savedSession.user === "object"
  ? savedSession.user
  : null;

const commerce = Vue.reactive({
  cart: Array.isArray(savedStore.cart) ? savedStore.cart : [],
  wishlist: Array.isArray(savedStore.wishlist) ? savedStore.wishlist : [],
  compare: Array.isArray(savedStore.compare) ? savedStore.compare : [],
  dealEndsAt: Number(savedStore.dealEndsAt) > Date.now() ? Number(savedStore.dealEndsAt) : Date.now() + 1000 * 60 * 60 * 36,
  nowTick: Date.now()
});

const ui = Vue.reactive({
  megaOpen: false,
  categoriesOpen: false,
  mobileOpen: false,
  activeDropdown: "",
  cartDrawerOpen: false,
  promoOpen: !(savedUi && savedUi.promoDismissed),
  cookieVisible: !(savedUi && savedUi.cookiesAccepted),
  cookieCustomize: false,
  cookiePrefs: {
    essential: true,
    analytics: !!(savedUi && savedUi.cookiePrefs && savedUi.cookiePrefs.analytics),
    marketing: !!(savedUi && savedUi.cookiePrefs && savedUi.cookiePrefs.marketing)
  },
  language: String((savedUi && savedUi.language) || "English"),
  currency: String((savedUi && savedUi.currency) || "USD")
});

const session = Vue.reactive({
  searchTerm: String((savedSession && savedSession.searchTerm) || ""),
  selectedProductId: String((savedSession && savedSession.selectedProductId) || ""),
  user: savedUser ? Object.assign({ role: "user" }, savedUser) : null,
  newsletterEmail: String((savedSession && savedSession.newsletterEmail) || ""),
  lastOrderAt: String((savedSession && savedSession.lastOrderAt) || "")
});

function persistStore() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      cart: commerce.cart,
      wishlist: commerce.wishlist,
      compare: commerce.compare,
      dealEndsAt: commerce.dealEndsAt
    }));
  } catch {
  }
}

function persistUi() {
  try {
    localStorage.setItem(UI_KEY, JSON.stringify({
      promoDismissed: !ui.promoOpen,
      cookiesAccepted: !ui.cookieVisible,
      cookiePrefs: ui.cookiePrefs,
      language: ui.language,
      currency: ui.currency
    }));
  } catch {
  }
}

function persistSession() {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      searchTerm: session.searchTerm,
      selectedProductId: session.selectedProductId,
      user: session.user,
      newsletterEmail: session.newsletterEmail,
      lastOrderAt: session.lastOrderAt
    }));
  } catch {
  }
}

Vue.watch(function () { return [commerce.cart, commerce.wishlist, commerce.compare, commerce.dealEndsAt]; }, persistStore, { deep: true });
Vue.watch(function () { return [ui.promoOpen, ui.cookieVisible, ui.cookiePrefs, ui.language, ui.currency]; }, persistUi, { deep: true });
Vue.watch(function () { return [session.searchTerm, session.selectedProductId, session.user, session.newsletterEmail, session.lastOrderAt]; }, persistSession, { deep: true });

setInterval(function () {
  commerce.nowTick = Date.now();
  if (commerce.dealEndsAt <= commerce.nowTick) {
    commerce.dealEndsAt = commerce.nowTick + 1000 * 60 * 60 * 24;
  }
}, 1000);

const commerceApi = {
  state: commerce,
  session: session,
  catalog: PRODUCT_CATALOG,
  addToCart(product, qty) {
    const p = normalizeProduct(product);
    const q = Math.max(1, Number(qty || 1));
    const hit = commerce.cart.find(function (x) { return x.id === p.id; });
    if (hit) {
      hit.qty = Math.max(1, Number(hit.qty || 1) + q);
    } else {
      commerce.cart.push({ id: p.id, name: p.name, price: p.price, tag: p.tag, img: p.img, qty: q });
    }
  },
  removeFromCart(id) {
    const idx = commerce.cart.findIndex(function (x) { return x.id === id; });
    if (idx >= 0) commerce.cart.splice(idx, 1);
  },
  setCartQty(id, qty) {
    const hit = commerce.cart.find(function (x) { return x.id === id; });
    if (!hit) return;
    hit.qty = Math.max(1, Number(qty || 1));
  },
  clearCart() {
    commerce.cart.splice(0, commerce.cart.length);
  },
  addToWishlist(product) {
    const p = normalizeProduct(product);
    if (!commerce.wishlist.some(function (x) { return x.id === p.id; })) {
      commerce.wishlist.push({ id: p.id, name: p.name, price: p.price, tag: p.tag, img: p.img });
    }
  },
  removeFromWishlist(id) {
    const idx = commerce.wishlist.findIndex(function (x) { return x.id === id; });
    if (idx >= 0) commerce.wishlist.splice(idx, 1);
  },
  moveWishlistToCart(id) {
    const hit = commerce.wishlist.find(function (x) { return x.id === id; });
    if (!hit) return;
    this.addToCart(hit, 1);
    this.removeFromWishlist(id);
  },
  addToCompare(product) {
    const p = normalizeProduct(product);
    if (!commerce.compare.some(function (x) { return x.id === p.id; })) {
      commerce.compare.push({ id: p.id, name: p.name, price: p.price, tag: p.tag, img: p.img });
    }
  },
  removeFromCompare(id) {
    const idx = commerce.compare.findIndex(function (x) { return x.id === id; });
    if (idx >= 0) commerce.compare.splice(idx, 1);
  },
  moveCompareToCart(id) {
    const hit = commerce.compare.find(function (x) { return x.id === id; });
    if (!hit) return;
    this.addToCart(hit, 1);
    this.removeFromCompare(id);
  },
  clearCompare() {
    commerce.compare.splice(0, commerce.compare.length);
  },
  getCartCount() {
    return commerce.cart.reduce(function (acc, x) { return acc + Math.max(0, Number(x.qty || 0)); }, 0);
  },
  getWishlistCount() {
    return commerce.wishlist.length;
  },
  getCompareCount() {
    return commerce.compare.length;
  },
  getCartSubtotal() {
    return commerce.cart.reduce(function (acc, x) {
      return acc + parsePrice(x.price) * Math.max(1, Number(x.qty || 1));
    }, 0);
  },
  formatCurrency(value) {
    return "$" + Number(value || 0).toFixed(2);
  },
  getDealCountdown() {
    const sec = Math.max(0, Math.floor((commerce.dealEndsAt - commerce.nowTick) / 1000));
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return h + ":" + m + ":" + s;
  },
  setSearchTerm(term) {
    session.searchTerm = String(term || "").trim();
  },
  getSearchTerm() {
    return session.searchTerm || "";
  },
  setSelectedProduct(productOrId) {
    const id = typeof productOrId === "string" ? productOrId : normalizeProduct(productOrId).id;
    session.selectedProductId = String(id || "").trim();
  },
  getSelectedProduct() {
    if (!session.selectedProductId) return null;
    return findProductById(session.selectedProductId);
  },
  getProductById(id) {
    return findProductById(id);
  },
  resolveRole(profile) {
    const p = profile || {};
    const explicit = String(p.role || "").trim().toLowerCase();
    if (explicit === "admin" || explicit === "user") return explicit;
    const email = String(p.email || "").trim().toLowerCase();
    if (email.includes("admin") || email.startsWith("owner@") || email.startsWith("manager@")) return "admin";
    return "user";
  },
  login(profile) {
    const p = profile || {};
    const first = String(p.firstName || p.first_name || "").trim();
    const last = String(p.lastName || p.last_name || "").trim();
    const email = String(p.email || "").trim();
    const fallbackName = email ? email.split("@")[0] : "Customer";
    const fullName = (first + " " + last).trim() || fallbackName;
    const role = this.resolveRole(p);
    session.user = {
      firstName: first,
      lastName: last,
      fullName: fullName,
      email: email,
      role: role
    };
  },
  logout() {
    session.user = null;
  },
  getUser() {
    return session.user;
  },
  isAuthenticated() {
    return !!session.user;
  },
  isAdmin() {
    return !!(session.user && String(session.user.role || "").toLowerCase() === "admin");
  },
  completeOrder() {
    session.lastOrderAt = new Date().toISOString();
    this.clearCart();
  }
};

window.__shfyCommerce = commerceApi;
window.__shfyCatalog = PRODUCT_CATALOG;

const options = {
  moduleCache: { vue: Vue },
  async getFile(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status + " " + res.statusText + " " + url);
    return {
      getContentData: function () {
        return res.text();
      }
    };
  },
  addStyle(textContent) {
    const style = document.createElement("style");
    style.textContent = textContent;
    document.head.appendChild(style);
  }
};

function resolveSlug() {
  return findRouteByHash(window.location.hash, defaultRouteSlug);
}

const state = Vue.reactive({
  routes: routes,
  slug: resolveSlug(),
  pageComponent: null,
  loading: false,
  error: "",
  som: null
});

async function loadCurrentPage() {
  state.loading = true;
  state.error = "";
  const modPath = "/src/pages/" + state.slug + ".vue";
  try {
    state.pageComponent = await loadModule(modPath, options);
    if (new URLSearchParams(window.location.search).get("som") === "1") {
      await new Promise(function (r) { setTimeout(r, 120); });
      state.som = applySetOfMarks();
    }
  } catch (e) {
    state.error = String(e);
  } finally {
    state.loading = false;
  }
}

window.addEventListener("hashchange", function () {
  state.slug = resolveSlug();
  loadCurrentPage();
});

const App = {
  setup() {
    let dropdownCloseTimer = 0;
    let megaCloseTimer = 0;

    const cartCount = Vue.computed(function () { return commerceApi.getCartCount(); });
    const wishCount = Vue.computed(function () { return commerceApi.getWishlistCount(); });
    const cmpCount = Vue.computed(function () { return commerceApi.getCompareCount(); });
    const countdown = Vue.computed(function () { return commerceApi.getDealCountdown(); });
    const cartItems = Vue.computed(function () { return commerce.state.cart; });
    const cartSubtotal = Vue.computed(function () { return commerceApi.formatCurrency(commerceApi.getCartSubtotal()); });
    const userFullName = Vue.computed(function () {
      return session.user && session.user.fullName ? session.user.fullName : "Guest";
    });
    const userLinePrimary = Vue.computed(function () {
      return session.user ? "Hello, " + userFullName.value : "Hello, Guest";
    });
    const userLineSecondary = Vue.computed(function () {
      if (!session.user) return "Login / Register";
      return commerceApi.isAdmin() ? "Admin Panel" : "My Account";
    });
    const userDashboardSlug = Vue.computed(function () {
      return commerceApi.isAdmin() ? "admin-dashboard" : "user-dashboard";
    });

    const activeRoute = Vue.computed(function () {
      return state.routes.find(function (r) { return r.slug === state.slug; }) || state.routes[0] || { slug: "main_page", title: "Main Page" };
    });

    function goTo(slug) {
      window.location.hash = "/" + slug;
      ui.mobileOpen = false;
      ui.megaOpen = false;
      ui.cartDrawerOpen = false;
      closeAllMenus();
    }

    function normalizePath(path) {
      const raw = String(path || "").trim();
      if (!raw) return "/";
      const split = raw.split("?")[0];
      if (split === "") return "/";
      return split.startsWith("/") ? split : "/" + split;
    }

    function goPath(path) {
      const slug = ROUTE_ALIAS[normalizePath(path)] || "main_page";
      goTo(slug);
    }

    function runSearch() {
      commerceApi.setSearchTerm(session.searchTerm);
      goTo("products-grid");
    }

    function openCatalogSeed(label) {
      session.searchTerm = String(label || "").trim();
      goTo("products-grid");
    }

    function goUserEntry() {
      if (session.user) {
        goTo(userDashboardSlug.value);
        return;
      }
      goTo("login");
    }

    function logoutUser() {
      commerceApi.logout();
      goTo("main_page");
    }

    function submitNewsletter() {
      const email = String(session.newsletterEmail || "").trim();
      if (!email || !email.includes("@")) return;
      session.newsletterEmail = email;
    }

    function selectLanguage(v) {
      ui.language = v;
      closeDropdown();
    }

    function selectCurrency(v) {
      ui.currency = v;
      closeDropdown();
    }

    function toggleCookieCustomize() {
      ui.cookieCustomize = !ui.cookieCustomize;
    }

    function rejectCookies() {
      ui.cookiePrefs.analytics = false;
      ui.cookiePrefs.marketing = false;
      ui.cookieCustomize = false;
      ui.cookieVisible = false;
    }

    function acceptCookies() {
      ui.cookiePrefs.analytics = true;
      ui.cookiePrefs.marketing = true;
      ui.cookieCustomize = false;
      ui.cookieVisible = false;
    }

    function saveCookiePrefs() {
      ui.cookieCustomize = false;
      ui.cookieVisible = false;
    }

    function clearDropdownCloseTimer() {
      if (!dropdownCloseTimer) return;
      clearTimeout(dropdownCloseTimer);
      dropdownCloseTimer = 0;
    }

    function clearMegaCloseTimer() {
      if (!megaCloseTimer) return;
      clearTimeout(megaCloseTimer);
      megaCloseTimer = 0;
    }

    function openDropdown(key) {
      clearDropdownCloseTimer();
      ui.activeDropdown = key;
    }

    function closeDropdown(key) {
      clearDropdownCloseTimer();
      dropdownCloseTimer = setTimeout(function () {
        if (!key || ui.activeDropdown === key) ui.activeDropdown = "";
      }, 110);
    }

    function toggleDropdown(key) {
      clearDropdownCloseTimer();
      ui.activeDropdown = ui.activeDropdown === key ? "" : key;
    }

    function openMega() {
      clearMegaCloseTimer();
      ui.categoriesOpen = true;
    }

    function closeMega() {
      clearMegaCloseTimer();
      megaCloseTimer = setTimeout(function () {
        ui.categoriesOpen = false;
      }, 110);
    }

    function toggleMega() {
      clearMegaCloseTimer();
      ui.categoriesOpen = !ui.categoriesOpen;
    }

    function closeAllMenus() {
      clearDropdownCloseTimer();
      clearMegaCloseTimer();
      ui.activeDropdown = "";
      ui.categoriesOpen = false;
    }

    function toggleCartDrawer() {
      ui.cartDrawerOpen = !ui.cartDrawerOpen;
      if (ui.cartDrawerOpen) {
        ui.mobileOpen = false;
        closeAllMenus();
      }
    }

    function removeFromCart(id) {
      commerceApi.removeFromCart(id);
    }

    function setQty(id, qty) {
      commerceApi.setCartQty(id, Math.max(1, Number(qty || 1)));
    }

    function openDetail(item) {
      commerceApi.setSelectedProduct(item && item.id ? item.id : "");
      window.location.hash = "/product-detail?id=" + encodeURIComponent(item && item.id ? item.id : "");
      ui.cartDrawerOpen = false;
    }

    function onGlobalPointerDown(evt) {
      const target = evt && evt.target;
      if (!(target instanceof Element)) {
        closeAllMenus();
        ui.cartDrawerOpen = false;
        return;
      }
      if (target.closest(".shfy-dd") || target.closest(".shfy-nav-item") || target.closest(".shfy-mega-root") || target.closest(".shfy-cart-drawer")) {
        return;
      }
      closeAllMenus();
      ui.cartDrawerOpen = false;
    }

    function onGlobalKeyDown(evt) {
      if (evt && evt.key === "Escape") closeAllMenus();
    }

    Vue.onMounted(function () {
      document.addEventListener("pointerdown", onGlobalPointerDown, true);
      document.addEventListener("keydown", onGlobalKeyDown, true);
    });

    Vue.onBeforeUnmount(function () {
      document.removeEventListener("pointerdown", onGlobalPointerDown, true);
      document.removeEventListener("keydown", onGlobalKeyDown, true);
      clearDropdownCloseTimer();
      clearMegaCloseTimer();
    });

    return {
      state,
      ui,
      session,
      homeDropdown: HOME_DROPDOWN,
      shopDropdown: SHOP_DROPDOWN,
      pagesDropdown: PAGES_DROPDOWN,
      categoryMenu: CATEGORY_MENU,
      megaColumns: MEGA_COLUMNS,
      footerLinks: FOOTER_LINKS,
      languageOptions: LANGUAGE_OPTIONS,
      currencyOptions: CURRENCY_OPTIONS,
      activeRoute,
      cartCount,
      wishCount,
      cmpCount,
      cartItems,
      cartSubtotal,
      countdown,
      userLinePrimary,
      userLineSecondary,
      goTo,
      goPath,
      runSearch,
      openCatalogSeed,
      goUserEntry,
      logoutUser,
      submitNewsletter,
      selectLanguage,
      selectCurrency,
      toggleCookieCustomize,
      rejectCookies,
      acceptCookies,
      saveCookiePrefs,
      openDropdown,
      closeDropdown,
      toggleDropdown,
      openMega,
      closeMega,
      toggleMega,
      toggleCartDrawer,
      removeFromCart,
      setQty,
      openDetail
    };
  },
  template: APP_SHELL_TEMPLATE
};

Vue.createApp(App).mount("#app");
loadCurrentPage();

