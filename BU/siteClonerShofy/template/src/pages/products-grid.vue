<template>
<section class="space-y-5">
  <header class="rounded border border-[#dbe2ee] bg-white p-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-[32px] font-black text-[#06131d]">Shop Grid Layout</h1>
        <p class="text-sm text-slate-500">Discover the latest arrivals and best deals.</p>
      </div>
      <div class="text-sm text-slate-500">Showing <strong>{{ filteredProducts.length }}</strong> products</div>
    </div>
  </header>

  <div class="grid gap-5 lg:grid-cols-[280px_1fr]">
    <aside class="rounded border border-[#dbe2ee] bg-white p-4">
      <h2 class="mb-3 text-lg font-bold text-[#10243a]">Search</h2>
      <input v-model="searchTerm" class="input input-bordered w-full" placeholder="Search products" />

      <h2 class="mb-3 mt-6 text-lg font-bold text-[#10243a]">Categories</h2>
      <button class="mb-1 block w-full rounded px-2 py-2 text-left text-sm font-semibold hover:bg-[#eef4ff]" :class="selectedCategory === '' ? 'bg-[#eef4ff] text-[#0c55aa]' : ''" @click="selectedCategory=''">All Categories</button>
      <button class="mb-1 block w-full rounded px-2 py-2 text-left text-sm font-semibold hover:bg-[#eef4ff]" v-for="c in categories" :key="c" :class="selectedCategory === c ? 'bg-[#eef4ff] text-[#0c55aa]' : ''" @click="selectedCategory=c">{{ c }}</button>
    </aside>

    <div class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-2 rounded border border-[#dbe2ee] bg-white p-3">
        <div class="inline-flex rounded border border-[#dbe2ee]">
          <button class="px-3 py-2 text-sm font-semibold text-[#0c55aa]"><i class="fa-solid fa-table-cells-large"></i></button>
          <button class="border-l px-3 py-2 text-sm text-slate-500" @click="goList"><i class="fa-solid fa-list"></i></button>
        </div>

        <div class="flex items-center gap-2 text-sm">
          <span class="text-slate-500">Sort by:</span>
          <select class="select select-bordered select-sm w-56" v-model="sortMode">
            <option value="default">Default</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="rating_desc">Rating: high to low</option>
          </select>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article class="group rounded border border-[#d9e1ee] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,34,67,0.1)]" v-for="p in pagedProducts" :key="p.id">
          <a href="#/product-detail" @click.prevent="goDetail(p)">
            <img :src="p.img" class="mx-auto mb-3 h-44 w-full object-contain" alt="item" @error="onImageError($event, p.name)" />
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

          <div class="mt-3 flex gap-2">
            <button class="btn btn-xs border-none bg-[#0c55aa] text-white" @click="addItem(p)"><i class="fa-solid fa-cart-plus"></i></button>
            <button class="btn btn-xs btn-outline" @click="addWish(p)"><i class="fa-regular fa-heart"></i></button>
            <button class="btn btn-xs btn-outline" @click="addCompare(p)"><i class="fa-solid fa-code-compare"></i></button>
            <button class="btn btn-xs btn-outline" @click="goDetail(p)"><i class="fa-regular fa-eye"></i></button>
          </div>
        </article>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 rounded border border-[#dbe2ee] bg-white p-3" v-if="pageCount > 1">
        <span class="text-sm text-slate-500">Page {{ currentPage }} / {{ pageCount }}</span>
        <div class="join">
          <button class="join-item btn btn-sm btn-outline" :disabled="currentPage <= 1" @click="currentPage = Math.max(1, currentPage - 1)">Prev</button>
          <button class="join-item btn btn-sm" v-for="page in pageButtons" :key="'page-' + page" :class="page === currentPage ? 'border-none bg-[#0c55aa] text-white' : 'btn-outline'" @click="currentPage = page">{{ page }}</button>
          <button class="join-item btn btn-sm btn-outline" :disabled="currentPage >= pageCount" @click="currentPage = Math.min(pageCount, currentPage + 1)">Next</button>
        </div>
      </div>

      <div class="rounded border border-dashed border-[#d9e1ee] p-5 text-center text-sm text-slate-500" v-if="filteredProducts.length===0">
        No products match your search/filter yet.
      </div>
    </div>
  </div>
</section>
</template>

<script>
import { filterProductsByQuery, sortProducts } from "../runtime/catalog.js";

export default {
  name: "Pageproducts-grid",
  data: function () {
    return {
      store: null,
      sortMode: "default",
      selectedCategory: "",
      currentPage: 1,
      pageSize: 9
    };
  },
  created: function () {
    this.store = window.__shfyCommerce || null;
  },
  watch: {
    searchTerm: function () {
      this.currentPage = 1;
    },
    selectedCategory: function () {
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
    catalog: function () {
      return this.store && Array.isArray(this.store.catalog) ? this.store.catalog : [];
    },
    categories: function () {
      const seen = {};
      return this.catalog.reduce(function (acc, item) {
        const key = String(item.category || "").trim();
        if (!key || seen[key]) return acc;
        seen[key] = 1;
        acc.push(key);
        return acc;
      }, []);
    },
    filteredProducts: function () {
      let next = filterProductsByQuery(this.catalog, this.searchTerm);
      if (this.selectedCategory) {
        const selected = String(this.selectedCategory || "").toLowerCase();
        next = next.filter(function (item) {
          return String(item.category || "").toLowerCase() === selected;
        });
      }
      return sortProducts(next, this.sortMode);
    },
    pageCount: function () {
      const total = this.filteredProducts.length;
      return Math.max(1, Math.ceil(total / this.pageSize));
    },
    pagedProducts: function () {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredProducts.slice(start, start + this.pageSize);
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
    goList: function () {
      location.hash = "/products-list";
    }
  }
};
</script>
