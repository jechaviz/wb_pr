<template>
<section class="space-y-6">
  <div class="grid gap-5 lg:grid-cols-[1fr_1fr]">
    <div class="rounded border border-[#dbe2ee] bg-white p-4">
      <img :src="activeImage" class="h-[430px] w-full object-contain" alt="product" @error="onImageError($event, 'hero')" />
      <div class="mt-3 grid grid-cols-4 gap-2">
        <button class="overflow-hidden rounded border border-[#dbe2ee] p-1" :class="img === activeImage ? 'border-[#0c55aa]' : ''" v-for="img in gallery" :key="img" @click="activeImage = img">
          <img :src="img" class="h-20 w-full object-contain" alt="thumb" @error="onImageError($event, 'thumb')" />
        </button>
      </div>
    </div>

    <div class="rounded border border-[#dbe2ee] bg-white p-5">
      <div class="mb-3 flex items-center gap-2 text-sm text-slate-600">
        <span class="font-semibold text-[#0c55aa]">{{ product.store }}</span>
        <span>|</span>
        <span><i class="fa-solid fa-star text-amber-500"></i> {{ product.rating }}</span>
        <span>({{ product.reviews }} reviews)</span>
      </div>

      <h1 class="text-[34px] font-black leading-tight text-[#10243a]">{{ product.name }}</h1>
      <div class="mt-3 flex items-center gap-3">
        <strong class="text-[34px] text-[#0c55aa]">{{ product.price }}</strong>
        <span class="text-xl text-slate-400 line-through" v-if="product.oldPrice">{{ product.oldPrice }}</span>
      </div>

      <p class="mt-4 text-sm leading-relaxed text-slate-600">{{ product.desc }}</p>

      <div class="mt-4 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
        <p><i class="fa-solid fa-truck-fast mr-2 text-[#0c55aa]"></i>Fast delivery in 2-5 business days</p>
        <p><i class="fa-solid fa-shield-heart mr-2 text-[#0c55aa]"></i>Warranty and support included</p>
        <p><i class="fa-solid fa-rotate-left mr-2 text-[#0c55aa]"></i>30-day easy return policy</p>
        <p><i class="fa-solid fa-credit-card mr-2 text-[#0c55aa]"></i>Secure payments and checkout</p>
      </div>

      <div class="mt-5 flex flex-wrap items-center gap-2">
        <div class="inline-flex items-center rounded border">
          <button class="px-3 py-2" @click="qty = Math.max(1, qty - 1)"><i class="fa-solid fa-minus"></i></button>
          <span class="min-w-[34px] text-center">{{ qty }}</span>
          <button class="px-3 py-2" @click="qty = qty + 1"><i class="fa-solid fa-plus"></i></button>
        </div>

        <button class="btn border-none bg-[#0c55aa] text-white" @click="addItem"><i class="fa-solid fa-cart-plus mr-2"></i>Add to cart</button>
        <button class="btn btn-outline" @click="addWish"><i class="fa-regular fa-heart mr-2"></i>Wishlist</button>
        <button class="btn btn-outline" @click="addCompare"><i class="fa-solid fa-code-compare mr-2"></i>Compare</button>
      </div>

      <div class="mt-5 border-t pt-4 text-sm text-slate-600">
        <p><strong>SKU:</strong> {{ product.id }}</p>
        <p><strong>Category:</strong> {{ product.category }}</p>
        <p><strong>Brand:</strong> {{ product.brand }}</p>
      </div>
    </div>
  </div>

  <div class="rounded border border-[#dbe2ee] bg-white p-5">
    <div class="mb-4 flex flex-wrap gap-2">
      <button class="btn btn-sm" :class="tab === 'desc' ? 'border-none bg-[#0c55aa] text-white' : 'btn-outline'" @click="tab='desc'">Description</button>
      <button class="btn btn-sm" :class="tab === 'specs' ? 'border-none bg-[#0c55aa] text-white' : 'btn-outline'" @click="tab='specs'">Additional Information</button>
      <button class="btn btn-sm" :class="tab === 'reviews' ? 'border-none bg-[#0c55aa] text-white' : 'btn-outline'" @click="tab='reviews'">Reviews</button>
    </div>

    <div v-if="tab === 'desc'" class="space-y-3 text-sm leading-relaxed text-slate-700">
      <p>{{ product.desc }}</p>
      <p>
        Built for high-performance workflows and immersive media, this item balances premium design,
        strong reliability, and practical day-to-day usability.
      </p>
      <p>
        Use this page as the canonical detail layout for comparison, variants, social proof, and conversion-focused actions.
      </p>
    </div>

    <div v-else-if="tab === 'specs'" class="overflow-x-auto">
      <table class="table table-sm">
        <tbody>
          <tr><td class="font-semibold">Category</td><td>{{ product.category }}</td></tr>
          <tr><td class="font-semibold">Brand</td><td>{{ product.brand }}</td></tr>
          <tr><td class="font-semibold">Rating</td><td>{{ product.rating }}</td></tr>
          <tr><td class="font-semibold">Store</td><td>{{ product.store }}</td></tr>
          <tr><td class="font-semibold">Warranty</td><td>12 months</td></tr>
          <tr><td class="font-semibold">Shipping</td><td>Standard and express supported</td></tr>
        </tbody>
      </table>
    </div>

    <div v-else class="space-y-4">
      <article class="rounded border border-[#dbe2ee] p-3" v-for="r in reviews" :key="r.name">
        <div class="flex items-center justify-between">
          <strong>{{ r.name }}</strong>
          <span><i class="fa-solid fa-star text-amber-500"></i> {{ r.rating }}</span>
        </div>
        <p class="mt-2 text-sm text-slate-600">{{ r.text }}</p>
      </article>
      <form class="grid gap-3 rounded border border-[#dbe2ee] bg-[#f8fbff] p-4" @submit.prevent="submitReview">
        <h3 class="text-lg font-bold text-[#10243a]">Write a review</h3>
        <input class="input input-bordered" v-model="reviewForm.name" placeholder="Your name" />
        <select class="select select-bordered" v-model="reviewForm.rating">
          <option value="5.0">5.0</option>
          <option value="4.5">4.5</option>
          <option value="4.0">4.0</option>
          <option value="3.5">3.5</option>
        </select>
        <textarea class="textarea textarea-bordered" rows="3" v-model="reviewForm.text" placeholder="Share your opinion"></textarea>
        <button class="btn w-fit border-none bg-[#0c55aa] text-white" type="submit">Submit review</button>
      </form>
    </div>
  </div>

  <section class="rounded border border-[#dbe2ee] bg-white p-5">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-[28px] font-black text-[#06131d]">Frequently bought together</h3>
      <button class="btn btn-sm border-none bg-[#0c55aa] text-white" @click="addBundle"><i class="fa-solid fa-cart-plus mr-2"></i>Add bundle</button>
    </div>
    <div class="grid gap-4 md:grid-cols-3">
      <article class="rounded border border-[#dbe2ee] p-3" v-for="item in bundleItems" :key="'bundle-' + item.id">
        <img :src="item.img" :alt="item.name" class="mx-auto h-32 w-full object-contain" @error="onImageError($event, item.name)" />
        <h4 class="mt-2 line-clamp-2 text-sm font-bold text-[#10243a]">{{ item.name }}</h4>
        <p class="mt-1 text-sm font-semibold text-[#0c55aa]">{{ item.price }}</p>
      </article>
    </div>
  </section>

  <section>
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-[28px] font-black text-[#06131d]">Related products</h3>
      <button class="btn btn-sm btn-outline" @click="goGrid">View all</button>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article class="rounded border border-[#dbe2ee] bg-white p-4" v-for="p in related" :key="p.id">
        <img :src="p.img" class="mx-auto mb-3 h-36 w-full object-contain" alt="item" @error="onImageError($event, p.name)" />
        <h4 class="line-clamp-2 text-sm font-bold text-[#10243a]">{{ p.name }}</h4>
        <div class="mt-2 flex items-center justify-between">
          <strong class="text-[#0c55aa]">{{ p.price }}</strong>
          <button class="btn btn-xs border-none bg-[#0c55aa] text-white" @click="openRelated(p)"><i class="fa-regular fa-eye mr-1"></i>Open</button>
        </div>
      </article>
    </div>
  </section>
</section>
</template>

<script>
export default {
  name: "Pageproduct-detail",
  data: function () {
    return {
      store: null,
      qty: 1,
      tab: "desc",
      activeImage: "",
      gallery: [],
      reviews: [
        { name: "Alex M.", rating: "4.8", text: "Excellent image quality and smooth gaming mode." },
        { name: "Sofia R.", rating: "4.6", text: "Great panel brightness and premium build quality." },
        { name: "Daniel P.", rating: "4.7", text: "Fast UI and easy setup with streaming services." }
      ],
      reviewForm: {
        name: "",
        rating: "5.0",
        text: ""
      },
      fallbackProduct: {
        id: "fallback",
        name: "Featured product",
        price: "$0.00",
        oldPrice: "",
        rating: 4.0,
        reviews: 0,
        tag: "General",
        category: "General",
        brand: "Shofy",
        store: "Shofy",
        desc: "Details pending.",
        img: "https://shofy.botble.com/storage/main/general/placeholder.png"
      }
    };
  },
  created: function () {
    this.store = window.__shfyCommerce || null;
    this.hydrateFromSelection();
    window.addEventListener("hashchange", this.hydrateFromSelection);
  },
  beforeUnmount: function () {
    window.removeEventListener("hashchange", this.hydrateFromSelection);
  },
  computed: {
    product: function () {
      if (!this.store)
        return this.fallbackProduct;
      const selected = this.store.getSelectedProduct();
      return selected || (this.store.catalog && this.store.catalog[0]) || this.fallbackProduct;
    },
    related: function () {
      if (!this.store || !Array.isArray(this.store.catalog))
        return [];
      const currentId = this.product.id;
      return this.store.catalog.filter(function (item) {
        return item.id !== currentId;
      }).slice(0, 4);
    },
    bundleItems: function () {
      if (!this.store || !Array.isArray(this.store.catalog))
        return [];
      const currentId = this.product.id;
      return this.store.catalog.filter(function (item) {
        return item.id !== currentId;
      }).slice(0, 3);
    }
  },
  methods: {
    hydrateFromSelection: function () {
      if (!this.store || !Array.isArray(this.store.catalog))
        return;
      const hash = String(window.location.hash || "");
      const queryIndex = hash.indexOf("?");
      const query = queryIndex >= 0 ? hash.slice(queryIndex + 1) : "";
      const params = new URLSearchParams(query);
      const id = params.get("id");
      const picked = (id && this.store.getProductById(id)) || this.store.getSelectedProduct() || this.store.catalog[0];
      if (!picked)
        return;
      this.store.setSelectedProduct(picked.id);
      this.activeImage = picked.img;
      const altImages = this.store.catalog.filter(function (item) {
        return item.id !== picked.id;
      }).slice(0, 3).map(function (item) {
        return item.img;
      });
      this.gallery = [picked.img].concat(altImages);
    },
    asProduct: function () {
      const p = this.product;
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        tag: p.tag,
        img: this.activeImage || p.img
      };
    },
    addItem: function () {
      if (this.store)
        this.store.addToCart(this.asProduct(), this.qty);
    },
    addWish: function () {
      if (this.store)
        this.store.addToWishlist(this.asProduct());
    },
    addCompare: function () {
      if (this.store)
        this.store.addToCompare(this.asProduct());
    },
    addBundle: function () {
      if (!this.store)
        return;
      const self = this;
      this.bundleItems.forEach(function (item) {
        self.store.addToCart(item, 1);
      });
    },
    submitReview: function () {
      const name = String(this.reviewForm.name || "").trim();
      const text = String(this.reviewForm.text || "").trim();
      if (!name || !text)
        return;
      this.reviews.unshift({
        name: name,
        rating: String(this.reviewForm.rating || "5.0"),
        text: text
      });
      this.reviewForm.name = "";
      this.reviewForm.rating = "5.0";
      this.reviewForm.text = "";
      this.tab = "reviews";
    },
    openRelated: function (p) {
      if (!this.store)
        return;
      this.store.setSelectedProduct(p.id);
      location.hash = "/product-detail?id=" + encodeURIComponent(p.id);
    },
    fallbackImage: function (seed) {
      return "https://source.unsplash.com/640x640/?" + encodeURIComponent(seed || "electronics");
    },
    onImageError: function (evt, seed) {
      const target = evt && evt.target;
      if (!target)
        return;
      const fb = this.fallbackImage(seed);
      if (target.src !== fb)
        target.src = fb;
    },
    goGrid: function () {
      location.hash = "/products-grid";
    }
  }
};
</script>
