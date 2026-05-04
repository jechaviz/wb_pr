<template>
<section class="space-y-8">
  <div class="relative overflow-hidden rounded border border-[#d8dfeb] bg-[#145f78] text-white">
    <img class="absolute right-0 top-0 h-full w-auto object-contain" :src="activeSlide.image" alt="hero" @error="onImageError($event, activeSlide.name, true)" />
    <img class="pointer-events-none absolute right-16 top-3 w-[170px] opacity-40" src="https://shofy.botble.com/storage/main/sliders/shape-1.png" alt="shape" />
    <img class="pointer-events-none absolute right-2 top-0 w-[210px] opacity-50" src="https://shofy.botble.com/storage/main/sliders/shape-2.png" alt="shape" />

    <div class="relative z-10 max-w-[640px] p-10">
      <div class="mb-3 inline-flex items-center gap-2 rounded bg-[#154a5b]/75 px-3 py-1 text-sm font-bold uppercase tracking-wide">
        <span>Flash deal</span>
        <span class="rounded bg-[#facc15] px-2 py-0.5 text-[#0f172a]">{{ dealCountdown }}</span>
      </div>
      <p class="mb-2 text-[42px] font-black leading-none text-white/95">Starting at {{ activeSlide.price }}</p>
      <h1 class="shfy-home-hero-title text-[78px] font-black leading-[0.92] tracking-tight">{{ activeSlide.title }}</h1>
      <p class="shfy-home-hero-subtitle shfy-hero-script mt-4 text-[58px] leading-none text-white/90">{{ activeSlide.subtitle }}</p>

      <div class="mt-7 flex flex-wrap gap-2">
        <button class="btn border-none bg-white text-[#10243a] hover:bg-slate-200" @click="addItem(activeSlide)"><i class="fa-solid fa-cart-plus mr-2"></i>Shop now</button>
        <button class="btn btn-outline text-white" @click="addWish(activeSlide)"><i class="fa-regular fa-heart mr-2"></i>Wishlist</button>
        <button class="btn btn-outline text-white" @click="addCompare(activeSlide)"><i class="fa-solid fa-code-compare mr-2"></i>Compare</button>
      </div>

      <div class="mt-5 flex gap-2">
        <button class="btn btn-xs" @click="prev"><i class="fa-solid fa-chevron-left"></i></button>
        <button class="btn btn-xs" @click="next"><i class="fa-solid fa-chevron-right"></i></button>
      </div>
    </div>

    <div class="absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
      <div class="flex items-center gap-2">
        <button
          v-for="(slide, idx) in heroSlides"
          :key="'dot-' + slide.id"
          type="button"
          class="h-2.5 w-2.5 rounded-full transition-all"
          :class="idx === cursor ? 'bg-[#0c55aa] w-8' : 'bg-white/55'"
          @click="cursor = idx"
          :aria-label="'slide ' + (idx + 1)">
        </button>
      </div>
    </div>
  </div>

  <section class="grid gap-3 lg:grid-cols-3">
    <a
      v-for="tile in promoTiles"
      :key="tile.title"
      href="#/products-grid"
      class="group overflow-hidden rounded border border-[#dbe2ee] bg-white p-4"
      @click.prevent="goTo('products-grid')">
      <p class="text-xs font-semibold uppercase tracking-wide text-[#0c55aa]">{{ tile.badge }}</p>
      <h3 class="mt-1 text-[24px] font-black text-[#10243a]">{{ tile.title }}</h3>
      <p class="mt-1 text-sm text-slate-600">{{ tile.copy }}</p>
      <span class="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0c55aa]">
        Shop now <i class="fa-solid fa-arrow-right transition group-hover:translate-x-1"></i>
      </span>
    </a>
  </section>

  <section>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-[28px] font-black text-[#06131d]">Popular categories</h2>
      <a href="#/categories" class="text-sm font-semibold text-[#0c55aa]" @click.prevent="goTo('categories')">View all categories</a>
    </div>
    <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <article class="rounded border border-[#dbe2ee] bg-white p-4" v-for="c in categoryCards" :key="c.name">
        <img :src="c.image" :alt="c.name" class="mx-auto h-20 w-20 object-contain" />
        <h3 class="mt-3 text-center text-[18px] font-bold text-[#10243a]">{{ c.name }}</h3>
      </article>
    </div>
  </section>

  <section>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-[28px] font-black text-[#06131d]">Trending products</h2>
      <a href="#/products-grid" class="text-sm font-semibold text-[#0c55aa]" @click.prevent="goTo('products-grid')">Browse catalog</a>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article class="group shfy-product-card rounded border border-[#d9e1ee] bg-white p-4" v-for="p in products" :key="p.id">
        <a href="#/product-detail" @click.prevent="goDetail(p)">
          <img :src="p.img" class="mx-auto mb-3 h-44 w-full object-contain" alt="item" @error="onImageError($event, p.name, false)" />
        </a>

        <div class="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>{{ p.store }}</span>
          <span><i class="fa-solid fa-star text-amber-500"></i> {{ p.rating }}</span>
        </div>

        <a href="#/product-detail" class="line-clamp-2 text-[16px] font-bold text-[#10243a]" @click.prevent="goDetail(p)">{{ p.name }}</a>
        <div class="mt-2 flex items-center gap-2">
          <strong class="text-[18px] text-[#0c55aa]">{{ p.price }}</strong>
          <span class="text-xs text-slate-400 line-through" v-if="p.oldPrice">{{ p.oldPrice }}</span>
        </div>

        <div class="mt-3 flex items-center justify-between gap-2">
          <div class="flex gap-1.5">
            <span class="inline-block h-3 w-3 rounded-full bg-slate-900"></span>
            <span class="inline-block h-3 w-3 rounded-full bg-sky-400"></span>
            <span class="inline-block h-3 w-3 rounded-full bg-emerald-300"></span>
          </div>
          <div class="shfy-card-actions flex gap-2">
            <button class="btn btn-xs border-none bg-[#0c55aa] text-white" @click="addItem(p)"><i class="fa-solid fa-cart-plus"></i></button>
            <button class="btn btn-xs btn-outline" @click="addWish(p)"><i class="fa-regular fa-heart"></i></button>
            <button class="btn btn-xs btn-outline" @click="addCompare(p)"><i class="fa-solid fa-code-compare"></i></button>
            <button class="btn btn-xs btn-outline" @click="goDetail(p)"><i class="fa-regular fa-eye"></i></button>
          </div>
        </div>
      </article>
    </div>
  </section>

  <section>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-[28px] font-black text-[#06131d]">Top brands</h2>
      <a href="#/brands" class="text-sm font-semibold text-[#0c55aa]" @click.prevent="goTo('brands')">View all brands</a>
    </div>
    <div class="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
      <button
        type="button"
        class="rounded border border-[#dbe2ee] bg-white p-4 transition hover:border-[#b9cae4] hover:-translate-y-0.5"
        v-for="logo in brandLogos"
        :key="logo.name"
        @click="goTo('brands')">
        <div class="mx-auto flex h-10 items-center justify-center text-[28px] text-[#0c55aa]">
          <i :class="logo.icon"></i>
        </div>
        <div class="mt-2 text-center text-xs font-semibold text-[#10243a]">{{ logo.name }}</div>
      </button>
    </div>
  </section>

  <section>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-[28px] font-black text-[#06131d]">Latest news</h2>
      <a href="#/blog" class="text-sm font-semibold text-[#0c55aa]" @click.prevent="goTo('blog')">View blog</a>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <article class="rounded border border-[#dbe2ee] bg-white" v-for="post in posts" :key="post.title">
        <img :src="post.image" :alt="post.title" class="h-44 w-full object-cover" @error="onImageError($event, post.title, false)" />
        <div class="p-4">
          <p class="text-xs uppercase tracking-wide text-slate-500">{{ post.date }}</p>
          <h3 class="mt-2 line-clamp-2 text-[18px] font-bold text-[#10243a]">{{ post.title }}</h3>
          <button class="mt-3 text-sm font-semibold text-[#0c55aa]" @click="goTo('blog')">Read more</button>
        </div>
      </article>
    </div>
  </section>
</section>
</template>

<script>
export default {
  name: "Pagemain_page",
  data: function () {
    return {
      store: null,
      cursor: 0,
      timer: null,
      heroSlides: [
        {
          id: "hero-watch",
          name: "Digital Watch Mockup",
          title: "The best tablet Collection 2023",
          subtitle: "Exclusive offer -35% off this week",
          price: "$274.00",
          tag: "Mockup",
          img: "https://shofy.botble.com/storage/main/sliders/slider-1.png",
          image: "https://shofy.botble.com/storage/main/sliders/slider-1.png"
        },
        {
          id: "hero-game",
          name: "Gaming setup essentials",
          title: "Gaming setup essentials",
          subtitle: "Weekend deal -18% on selected products",
          price: "$199.00",
          tag: "Gaming",
          img: "https://shofy.botble.com/storage/main/sliders/slider-2.png",
          image: "https://shofy.botble.com/storage/main/sliders/slider-2.png"
        }
      ],
      promoTiles: [
        { badge: "New Season", title: "Level up your setup", copy: "Gaming and creator gear with faster shipping." },
        { badge: "Smart Home", title: "Build your smart stack", copy: "Connected devices for home and office automation." },
        { badge: "Mobile Deals", title: "Top phones & tablets", copy: "Weekly discounts across premium mobile brands." }
      ],
      categoryCards: [
        { name: "Headphones", image: "https://shofy.botble.com/storage/main/product-categories/1.png" },
        { name: "Mobile Phone", image: "https://shofy.botble.com/storage/main/product-categories/2.png" },
        { name: "CPU Heat Pipes", image: "https://shofy.botble.com/storage/main/product-categories/3.png" },
        { name: "Smart Watch", image: "https://shofy.botble.com/storage/main/product-categories/4.png" },
        { name: "With Bluetooth", image: "https://shofy.botble.com/storage/main/product-categories/5.png" }
      ],
      brandLogos: [
        { name: "Apple", icon: "fa-brands fa-apple" },
        { name: "Google", icon: "fa-brands fa-google" },
        { name: "Amazon", icon: "fa-brands fa-amazon" },
        { name: "Meta", icon: "fa-brands fa-meta" },
        { name: "Microsoft", icon: "fa-brands fa-microsoft" },
        { name: "GitHub", icon: "fa-brands fa-github" }
      ],
      posts: [
        { title: "Quality Foods Requirements For Every Human Body", date: "June 12, 2026", image: "https://shofy.botble.com/storage/main/blog/post-4-420x270.jpg" },
        { title: "Freelancer Days 2026, What's new?", date: "May 28, 2026", image: "https://shofy.botble.com/storage/main/blog/post-3-420x270.jpg" },
        { title: "Follow your own design process", date: "May 12, 2026", image: "https://shofy.botble.com/storage/main/blog/post-1-420x270.jpg" }
      ]
    };
  },
  computed: {
    activeSlide: function () {
      return this.heroSlides[this.cursor] || this.heroSlides[0];
    },
    products: function () {
      if (!this.store || !Array.isArray(this.store.catalog))
        return [];
      return this.store.catalog.slice(0, 8);
    },
    dealCountdown: function () {
      if (!this.store)
        return "36:00:00";
      return this.store.getDealCountdown();
    }
  },
  mounted: function () {
    this.store = window.__shfyCommerce || null;
    const self = this;
    this.timer = setInterval(function () {
      self.next();
    }, 5500);
  },
  beforeUnmount: function () {
    if (this.timer)
      clearInterval(this.timer);
  },
  methods: {
    next: function () {
      this.cursor = (this.cursor + 1) % this.heroSlides.length;
    },
    prev: function () {
      this.cursor = (this.cursor + this.heroSlides.length - 1) % this.heroSlides.length;
    },
    fallbackImage: function (seed, hero) {
      const q = encodeURIComponent((seed || "electronics") + (hero ? " product hero" : " ecommerce gadget"));
      const size = hero ? "1200x700" : "640x640";
      return "https://source.unsplash.com/" + size + "/?" + q;
    },
    onImageError: function (evt, seed, hero) {
      const target = evt && evt.target;
      if (!target)
        return;
      const fallback = this.fallbackImage(seed, hero);
      if (target.src !== fallback)
        target.src = fallback;
    },
    goTo: function (slug) {
      location.hash = "/" + slug;
    },
    goDetail: function (p) {
      if (!window.__shfyCommerce)
        return;
      window.__shfyCommerce.setSelectedProduct(p);
      location.hash = "/product-detail?id=" + encodeURIComponent(p.id);
    },
    addItem: function (p) {
      if (window.__shfyCommerce)
        window.__shfyCommerce.addToCart(p, 1);
    },
    addWish: function (p) {
      if (window.__shfyCommerce)
        window.__shfyCommerce.addToWishlist(p);
    },
    addCompare: function (p) {
      if (window.__shfyCommerce)
        window.__shfyCommerce.addToCompare(p);
    }
  }
};
</script>
