<template>
<section class="space-y-5">
  <header class="rounded border border-[#dbe2ee] bg-white p-4">
    <h1 class="text-[32px] font-black text-[#06131d]">Vendors & Brands</h1>
    <p class="text-sm text-slate-500">Trusted brands available in this storefront.</p>
  </header>

  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <article class="rounded border border-[#dbe2ee] bg-white p-4" v-for="b in brands" :key="b.name">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-lg font-black text-[#10243a]">{{ b.name }}</h2>
        <span class="badge badge-outline">{{ b.count }}</span>
      </div>
      <p class="text-sm text-slate-600">Featured products from {{ b.name }} and related partner stores.</p>
      <button class="btn btn-sm mt-3 border-none bg-[#0c55aa] text-white" @click="openBrand(b.name)">View products</button>
    </article>
  </div>

  <section class="rounded border border-[#dbe2ee] bg-white p-4" v-if="selectedBrand">
    <div class="mb-3 flex items-center justify-between">
      <h3 class="text-xl font-bold text-[#10243a]">{{ selectedBrand }} products</h3>
      <button class="btn btn-xs btn-outline" @click="selectedBrand=''">Close</button>
    </div>
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article class="rounded border border-[#dbe2ee] p-3" v-for="p in brandItems" :key="p.id">
        <img :src="p.img" class="mb-2 h-28 w-full object-contain" alt="item" />
        <h4 class="line-clamp-2 text-sm font-semibold">{{ p.name }}</h4>
        <div class="mt-1 flex items-center justify-between">
          <strong class="text-[#0c55aa]">{{ p.price }}</strong>
          <button class="btn btn-xs border-none bg-[#0c55aa] text-white" @click="openDetail(p)">Open</button>
        </div>
      </article>
    </div>
  </section>
</section>
</template>

<script>
import { getCatalogByBrand } from "../runtime/catalog.js";

export default {
  name: "Pagebrands",
  data: function () {
    return {
      store: null,
      selectedBrand: ""
    };
  },
  created: function () {
    this.store = window.__shfyCommerce || null;
  },
  computed: {
    catalog: function () {
      return this.store && Array.isArray(this.store.catalog) ? this.store.catalog : [];
    },
    brands: function () {
      const byBrand = {};
      this.catalog.forEach(function (item) {
        const brand = String(item.brand || "Shofy");
        byBrand[brand] = (byBrand[brand] || 0) + 1;
      });
      return Object.keys(byBrand).map(function (name) {
        return { name: name, count: byBrand[name] };
      });
    },
    brandItems: function () {
      if (!this.selectedBrand) return [];
      return getCatalogByBrand(this.selectedBrand).slice(0, 8);
    }
  },
  methods: {
    openBrand: function (name) {
      this.selectedBrand = name;
      if (this.store) this.store.setSearchTerm(name);
    },
    openDetail: function (p) {
      if (!this.store) return;
      this.store.setSelectedProduct(p);
      location.hash = "/product-detail?id=" + encodeURIComponent(p.id);
    }
  }
};
</script>
