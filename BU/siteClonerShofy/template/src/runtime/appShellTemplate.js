window.__APP_SHELL_TEMPLATE__ = `
<div class="shfy-shell">
  <div class="shfy-topbar">
    <div class="shfy-topbar-inner">
      <div class="left">
        <span><i class="fa-solid fa-arrow-left"></i></span>
        <span><i class="fa-solid fa-arrow-right"></i></span>
        <span>Enjoy free shipping on all orders over $99! Shop now and save on delivery costs.</span>
      </div>

      <div class="deal">Deal ends in <strong>{{ countdown }}</strong></div>

      <div class="shfy-dd"
           @mouseenter="openDropdown('language')"
           @mouseleave="closeDropdown('language')">
        <button class="shfy-dd-trigger" @click.stop="toggleDropdown('language')">
          <span>{{ ui.language }}</span>
          <i class="fa-solid fa-caret-down"></i>
        </button>
        <div class="shfy-dd-menu" v-if="ui.activeDropdown === 'language'">
          <button v-for="lang in languageOptions" :key="'lang-' + lang" @click="selectLanguage(lang)">
            {{ lang }}
          </button>
        </div>
      </div>

      <div class="shfy-dd"
           @mouseenter="openDropdown('currency')"
           @mouseleave="closeDropdown('currency')">
        <button class="shfy-dd-trigger" @click.stop="toggleDropdown('currency')">
          <span>{{ ui.currency }}</span>
          <i class="fa-solid fa-caret-down"></i>
        </button>
        <div class="shfy-dd-menu" v-if="ui.activeDropdown === 'currency'">
          <button v-for="currency in currencyOptions" :key="'currency-' + currency" @click="selectCurrency(currency)">
            {{ currency }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <header class="shfy-header">
    <div class="shfy-header-inner">
      <a class="logo" href="#/main_page" @click.prevent="goTo('main_page')">
        <img src="https://shofy.botble.com/storage/main/general/logo.png" alt="Shofy" />
      </a>

      <form class="shfy-search" @submit.prevent="runSearch">
        <input class="shfy-search-input" type="search" v-model="session.searchTerm" placeholder="Search for Products..." />
        <button class="shfy-search-cat" type="button" @click="goTo('categories')">
          <span>All Categories</span>
          <i class="fa-solid fa-caret-down"></i>
        </button>
        <button class="shfy-search-btn" type="submit" aria-label="Search">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>

      <a class="shfy-user" href="#/login" @click.prevent="goUserEntry">
        <span class="shfy-user-icon"><i class="fa-regular fa-user"></i></span>
        <span>
          {{ userLinePrimary }}<br>
          <strong>{{ userLineSecondary }}</strong>
        </span>
      </a>

      <button class="shfy-ico" type="button" @click="goTo('compare')" aria-label="Compare">
        <i class="fa-solid fa-code-compare"></i>
        <small>{{ cmpCount }}</small>
      </button>

      <button class="shfy-ico" type="button" @click="goTo('wishlist')" aria-label="Wishlist">
        <i class="fa-regular fa-heart"></i>
        <small>{{ wishCount }}</small>
      </button>

      <button class="shfy-ico" type="button" @click.stop="toggleCartDrawer" aria-label="Cart">
        <i class="fa-solid fa-cart-shopping"></i>
        <small>{{ cartCount }}</small>
      </button>
    </div>
  </header>

  <nav class="shfy-nav">
    <div class="shfy-nav-inner">
      <div class="shfy-mega-root" @mouseenter="openMega" @mouseleave="closeMega">
        <button class="shfy-cat-btn" @click.stop="toggleMega" type="button">
          <span><i class="fa-solid fa-bars"></i> All Categories</span>
          <i class="fa-solid fa-caret-down"></i>
        </button>

        <div class="shfy-mega-panel" v-if="ui.categoriesOpen">
          <div class="shfy-mega-layout">
            <div class="shfy-mega-left">
              <button class="shfy-cat-link" type="button" v-for="entry in categoryMenu" :key="'cat-' + entry" @click="openCatalogSeed(entry)">
                {{ entry }}
              </button>
            </div>

            <div class="shfy-mega-grid">
              <div class="shfy-mega-col" v-for="col in megaColumns" :key="col.title">
                <img :src="col.image" :alt="col.title" />
                <h4>{{ col.title }}</h4>
                <button class="shfy-mega-link" type="button" v-for="link in col.links" :key="col.title + '-' + link" @click="openCatalogSeed(link)">
                  {{ link }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="shfy-nav-item" @mouseenter="openDropdown('home')" @mouseleave="closeDropdown('home')">
        <a href="#/main_page" @click.prevent="goTo('main_page')">Home <i class="fa-solid fa-angle-down"></i></a>
        <div class="shfy-nav-dd" v-if="ui.activeDropdown === 'home'">
          <button type="button" v-for="item in homeDropdown" :key="'home-' + item.slug" @click="goTo(item.slug)">
            {{ item.label }}
          </button>
        </div>
      </div>

      <div class="shfy-nav-item" @mouseenter="openDropdown('shop')" @mouseleave="closeDropdown('shop')">
        <a href="#/products-grid" @click.prevent="goTo('products-grid')">Shop <i class="fa-solid fa-angle-down"></i></a>
        <div class="shfy-nav-dd" v-if="ui.activeDropdown === 'shop'">
          <button type="button" v-for="item in shopDropdown" :key="'shop-' + item.slug" @click="goTo(item.slug)">
            {{ item.label }}
          </button>
        </div>
      </div>

      <a class="shfy-simple-link" href="#/brands" @click.prevent="goTo('brands')">Vendors</a>

      <div class="shfy-nav-item" @mouseenter="openDropdown('pages')" @mouseleave="closeDropdown('pages')">
        <a href="#/pages" @click.prevent="goTo('our-story')">Pages <i class="fa-solid fa-angle-down"></i></a>
        <div class="shfy-nav-dd" v-if="ui.activeDropdown === 'pages'">
          <button type="button" v-for="item in pagesDropdown" :key="'pages-' + item.slug" @click="goTo(item.slug)">
            {{ item.label }}
          </button>
        </div>
      </div>

      <a class="shfy-simple-link" href="#/blog" @click.prevent="goTo('blog')">Blog</a>
      <a class="shfy-simple-link" href="#/contact" @click.prevent="goTo('contact')">Contact</a>

      <div class="shfy-hotline">
        <div><i class="fa-solid fa-phone"></i>Hotline:</div>
        <strong>8 800 332 65-66</strong>
      </div>

      <button class="shfy-mobile-btn" type="button" @click="ui.mobileOpen = !ui.mobileOpen">
        <i class="fa-solid fa-bars"></i>
        Menu
      </button>
    </div>

    <div class="shfy-mobile-nav" v-if="ui.mobileOpen">
      <button type="button" @click="goTo('main_page')">Home</button>
      <button type="button" @click="goTo('products-grid')">Shop</button>
      <button type="button" @click="goTo('brands')">Vendors</button>
      <button type="button" @click="goTo('our-story')">Pages</button>
      <button type="button" @click="goTo('blog')">Blog</button>
      <button type="button" @click="goTo('contact')">Contact</button>
      <button type="button" @click="goTo('cart')">Cart ({{ cartCount }})</button>
      <button type="button" @click="goTo('wishlist')">Wishlist ({{ wishCount }})</button>
      <button type="button" @click="goTo('compare')">Compare ({{ cmpCount }})</button>
      <button type="button" v-if="session.user && session.user.role !== 'admin'" @click="goTo('user-dashboard')">User Dashboard</button>
      <button type="button" v-if="session.user && session.user.role === 'admin'" @click="goTo('admin-dashboard')">Admin Dashboard</button>
      <button type="button" v-if="session.user" @click="logoutUser">Sign out</button>
    </div>
  </nav>

  <section class="shfy-page-hero" v-if="activeRoute.slug !== 'main_page'">
    <div class="shfy-page-hero-inner">
      <h1>{{ activeRoute.title }}</h1>
      <p>
        <a href="#/main_page" @click.prevent="goTo('main_page')">Home</a>
        <span> · </span>
        <span>{{ activeRoute.title }}</span>
      </p>
    </div>
  </section>

  <main class="shfy-main">
    <div v-if="state.loading" class="alert border border-[#dbe2ee] bg-white text-[#1f3b59]">
      <span>Loading section...</span>
    </div>

    <div v-else-if="state.error" class="alert alert-error">
      <span>{{ state.error }}</span>
    </div>

    <component v-else :is="state.pageComponent" :route="activeRoute"></component>
  </main>

  <section class="shfy-newsletter">
    <div class="shfy-newsletter-inner">
      <div>
        <div class="tag">SALE 20% OFF ALL STORE</div>
        <h3>Subscribe our Newsletter</h3>
      </div>
      <form class="newsletter-form" @submit.prevent="submitNewsletter">
        <input type="email" v-model="session.newsletterEmail" placeholder="Enter your email" />
        <button type="submit">Subscribe</button>
      </form>
    </div>
  </section>

  <footer class="shfy-footer">
    <div class="shfy-footer-top">
      <div>
        <a class="logo" href="#/main_page" @click.prevent="goTo('main_page')">
          <img src="https://shofy.botble.com/storage/main/general/logo.png" alt="Shofy" />
        </a>
        <p class="mt-3">
          Shofy is a powerful e-commerce design reference. This template rebuild keeps the structure and adds practical storefront interactions.
        </p>
        <div class="shfy-socials mt-4">
          <a href="#" aria-label="facebook"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#" aria-label="x"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="#" aria-label="instagram"><i class="fa-brands fa-instagram"></i></a>
          <a href="#" aria-label="youtube"><i class="fa-brands fa-youtube"></i></a>
        </div>
      </div>

      <div>
        <h4>My Account</h4>
        <button type="button" v-for="item in footerLinks.myAccount" :key="'my-' + item.slug + '-' + item.label" @click="goTo(item.slug)">
          {{ item.label }}
        </button>
      </div>

      <div>
        <h4>Information</h4>
        <button type="button" v-for="item in footerLinks.information" :key="'info-' + item.slug + '-' + item.label" @click="goTo(item.slug)">
          {{ item.label }}
        </button>
      </div>

      <div>
        <h4>Talk To Us</h4>
        <p>
          <strong>Got Questions? Call us</strong><br>
          +670 413 90 762
        </p>
        <p class="mt-2">79 Sleepy Hollow St. Jamaica, New York 1432</p>
      </div>
    </div>

    <div class="shfy-footer-tags">
      <div class="row"><span>Health & Beauty:</span> <a v-for="(tag, idx) in footerLinks.tagsA" :key="'a-' + idx" href="#" @click.prevent="openCatalogSeed(tag)">{{ tag }}</a></div>
      <div class="row"><span>Electronics:</span> <a v-for="(tag, idx) in footerLinks.tagsB" :key="'b-' + idx" href="#" @click.prevent="openCatalogSeed(tag)">{{ tag }}</a></div>
      <div class="row"><span>Fashion:</span> <a v-for="(tag, idx) in footerLinks.tagsC" :key="'c-' + idx" href="#" @click.prevent="openCatalogSeed(tag)">{{ tag }}</a></div>
    </div>

    <div class="shfy-copy">© 2026 All Rights Reserved.</div>
  </footer>

  <div class="shfy-promo-backdrop" v-if="ui.promoOpen">
    <div class="shfy-promo-modal">
      <button class="close" type="button" @click="ui.promoOpen = false"><i class="fa-solid fa-xmark"></i></button>
      <div class="eyebrow">Welcome Offer</div>
      <h3>Get 20% off your first order</h3>
      <p>Use code <strong>WELCOME20</strong> at checkout.</p>
      <div class="actions">
        <button class="btn border-none bg-[#0c55aa] text-white" type="button" @click="goTo('products-grid'); ui.promoOpen = false">Shop now</button>
        <button class="btn btn-outline" type="button" @click="ui.promoOpen = false">Maybe later</button>
      </div>
    </div>
  </div>

  <div class="shfy-cookie" v-if="ui.cookieVisible">
    <div class="shfy-cookie-inner">
      <p>
        Your experience on this site will be improved by allowing cookies.
        <a href="#/cookie-policy" @click.prevent="goTo('cookie-policy')">Cookie Policy</a>
      </p>
      <div class="actions">
        <button class="btn btn-sm" type="button" @click="rejectCookies">Reject</button>
        <button class="btn btn-sm btn-outline" type="button" @click="toggleCookieCustomize">Customize preferences</button>
        <button class="btn btn-sm border-none bg-[#0c55aa] text-white" type="button" @click="acceptCookies">Accept cookies</button>
      </div>
    </div>
    <div class="shfy-cookie-categories" v-if="ui.cookieCustomize">
      <label>
        <input type="checkbox" checked disabled />
        <span><strong>Essential</strong> — Required to keep storefront navigation and state stable.</span>
      </label>
      <label>
        <input type="checkbox" v-model="ui.cookiePrefs.analytics" />
        <span><strong>Analytics</strong> — Helps optimize conversion and navigation quality.</span>
      </label>
      <label>
        <input type="checkbox" v-model="ui.cookiePrefs.marketing" />
        <span><strong>Marketing</strong> — Personalizes offers and campaign banners.</span>
      </label>
      <div class="save-row">
        <button class="btn btn-sm border-none bg-[#0c55aa] text-white" type="button" @click="saveCookiePrefs">Save preferences</button>
      </div>
    </div>
  </div>

  <div class="shfy-cart-drawer-backdrop" v-if="ui.cartDrawerOpen" @click="ui.cartDrawerOpen = false"></div>
  <aside class="shfy-cart-drawer" :class="{ open: ui.cartDrawerOpen }" aria-label="Mini cart">
    <header>
      <h4>Shopping Cart</h4>
      <button type="button" @click="ui.cartDrawerOpen = false"><i class="fa-solid fa-xmark"></i></button>
    </header>
    <div class="drawer-list" v-if="cartItems.length">
      <article class="drawer-item" v-for="item in cartItems" :key="'drawer-' + item.id">
        <button type="button" class="thumb" @click="openDetail(item)">
          <img :src="item.img" :alt="item.name" />
        </button>
        <div class="meta">
          <strong>{{ item.name }}</strong>
          <p>{{ item.qty }} x {{ item.price }}</p>
          <div class="actions">
            <button type="button" @click="setQty(item.id, item.qty - 1)"><i class="fa-solid fa-minus"></i></button>
            <button type="button" @click="setQty(item.id, item.qty + 1)"><i class="fa-solid fa-plus"></i></button>
            <button type="button" @click="removeFromCart(item.id)"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </article>
    </div>
    <div class="drawer-empty" v-else>
      <p>Your cart is empty.</p>
      <button class="btn btn-sm border-none bg-[#0c55aa] text-white" type="button" @click="goTo('products-grid')">Go shopping</button>
    </div>
    <footer>
      <div class="subtotal">Subtotal <strong>{{ cartSubtotal }}</strong></div>
      <div class="footer-actions">
        <button class="btn btn-sm btn-outline" type="button" @click="goTo('cart'); ui.cartDrawerOpen = false">View cart</button>
        <button class="btn btn-sm border-none bg-[#0c55aa] text-white" type="button" @click="goTo('checkout'); ui.cartDrawerOpen = false">Checkout</button>
      </div>
    </footer>
  </aside>
</div>
`;


