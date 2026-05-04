<template>
<section class="space-y-5">
  <header class="rounded border border-[#dbe2ee] bg-white p-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-[32px] font-black text-[#06131d]">Shop List Layout</h1>
        <p class="text-sm text-slate-500">Detailed product cards with richer metadata.</p>
      </div>
      <div class="flex items-center gap-2">
        <input v-model="searchTerm" class="input input-bordered input-sm w-52" placeholder="Search list" />
        <select class="select select-bordered select-sm" v-model="sortMode">
          <option value="default">Default</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
        <button class="btn btn-sm btn-outline" @click="goGrid"><i class="fa-solid fa-table-cells-large mr-2"></i>Grid View</button>
      </div>
    </div>
  </header>

  <div class="space-y-3">
    <article class="rounded border border-[#dbe2ee] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,34,67,0.1)]" v-for="p in pagedProducts" :key="p.id">
      <div class="grid gap-4 md:grid-cols-[220px_1fr_auto]">
        <a href="#/product-detail" @click.prevent="goDetail(p)">
          <img :src="p.img" :alt="p.name" class="h-44 w-full object-contain" @error="onImageError($event, p.name)" />
        </a>

        <div>
          <div class="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <span>{{ p.store }}</span>
            <span><i class="fa-solid fa-star text-amber-500"></i> {{ p.rating }}</span>
            <span>|</span>
            <span>{{ p.reviews }} reviews</span>
          </div>
          <a href="#/product-detail" class="text-[20px] font-black text-[#10243a]" @click.prevent="goDetail(p)">{{ p.name }}</a>
          <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ p.desc }}</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <span class="badge badge-outline">{{ p.tag }}</span>
            <span class="badge badge-outline">{{ p.category }}</span>
            <span class="badge badge-outline">{{ p.brand }}</span>
          </div>
        </div>

        <div class="flex flex-col items-end justify-between">
          <div class="text-right">
            <strong class="text-[22px] text-[#0c55aa]">{{ p.price }}</strong>
            <div class="text-xs text-slate-400 line-through" v-if="p.oldPrice">{{ p.oldPrice }}</div>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-sm border-none bg-[#0c55aa] text-white" @click="addItem(p)"><i class="fa-solid fa-cart-plus mr-2"></i>Add to cart</button>
            <button class="btn btn-sm btn-outline" @click="addWish(p)"><i class="fa-regular fa-heart"></i></button>
            <button class="btn btn-sm btn-outline" @click="addCompare(p)"><i class="fa-solid fa-code-compare"></i></button>
          </div>
        </div>
      </div>
    </article>

    <div class="flex flex-wrap items-center justify-between gap-2 rounded border border-[#dbe2ee] bg-white p-3" v-if="pageCount > 1">
      <span class="text-sm text-slate-500">Page {{ currentPage }} / {{ pageCount }}</span>
      <div class="join">
        <button class="join-item btn btn-sm btn-outline" :disabled="currentPage <= 1" @click="currentPage = Math.max(1, currentPage - 1)">Prev</button>
        <button class="join-item btn btn-sm" v-for="page in pageButtons" :key="'list-page-' + page" :class="page === currentPage ? 'border-none bg-[#0c55aa] text-white' : 'btn-outline'" @click="currentPage = page">{{ page }}</button>
        <button class="join-item btn btn-sm btn-outline" :disabled="currentPage >= pageCount" @click="currentPage = Math.min(pageCount, currentPage + 1)">Next</button>
      </div>
    </div>

    <div class="rounded border border-dashed border-[#d9e1ee] p-5 text-center text-sm text-slate-500" v-if="products.length===0">
      No products available for current search.
    </div>
  </div>
</section>
</template>

<script>
import { filterProductsByQuery, sortProducts } from "../runtime/catalog.js";

export default {
  name: "Pageproducts-list",
  data: function () {
    return {
      store: null,
      sortMode: "default",
      currentPage: 1,
      pageSize: 8
    };
  },
  created: function () {
    this.store = window.__shfyCommerce || null;
  },
  watch: {
    searchTerm: function () {
      this.currentPage = 1;
    },
    sortMode: function () {
      this.currentPage = 1;
    }
  },
  computed: {
    searchTerm: {
      get: function () {
        return this.store ? this.store.getSearchTerm() : "";
      },
      set: function (value) {
        if (!this.store) return;
        this.store.setSearchTerm(value);
      }
    },
    products: function () {
      const catalog = this.store && Array.isArray(this.store.catalog) ? this.store.catalog : [];
      const filtered = filterProductsByQuery(catalog, this.searchTerm);
      return sortProducts(filtered, this.sortMode);
    },
    pageCount: function () {
      const total = this.products.length;
      return Math.max(1, Math.ceil(total / this.pageSize));
    },
    pagedProducts: function () {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.products.slice(start, start + this.pageSize);
    },
    pageButtons: function () {
      const total = this.pageCount;
      if (total <= 7)
        return Array.from({ length: total }, function (_, idx) {
          return idx + 1;
        });
      const curr = this.currentPage;
      const left = Math.max(1, curr - 2);
      const right = Math.min(total, curr + 2);
      const pages = [];
      for (let i = left; i <= right; i += 1)
        pages.push(i);
      if (!pages.includes(1))
        pages.unshift(1);
      if (!pages.includes(total))
        pages.push(total);
      return pages;
    }
  },
  methods: {
    fallbackImage: function (seed) {
      return "https://source.unsplash.com/640x640/?" + encodeURIComponent(seed || "electronics");
    },
    onImageError: function (evt, seed) {
      const target = evt && evt.target;
      if (!target) return;
      const fb = this.fallbackImage(seed);
      if (target.src !== fb) target.src = fb;
    },
    addItem: function (p) {
      if (this.store) this.store.addToCart(p, 1);
    },
    addWish: function (p) {
      if (this.store) this.store.addToWishlist(p);
    },
    addCompare: function (p) {
      if (this.store) this.store.addToCompare(p);
    },
    goDetail: function (p) {
      if (!this.store) return;
      this.store.setSelectedProduct(p);
      location.hash = "/product-detail?id=" + encodeURIComponent(p.id);
    },
    goGrid: function () {
      location.hash = "/products-grid";
    }
  }
};
</script>
