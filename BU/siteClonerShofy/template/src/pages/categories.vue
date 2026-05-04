<template>
<section class="space-y-5">
  <header class="rounded border border-[#dbe2ee] bg-white p-4">
    <h1 class="text-[32px] font-black text-[#06131d]">Categories</h1>
    <p class="text-sm text-slate-500">Browse catalog by category and open matching products.</p>
  </header>

  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    <article class="rounded border border-[#dbe2ee] bg-white p-4" v-for="c in categoryCards" :key="c.name">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-xl font-black text-[#10243a]">{{ c.name }}</h2>
        <span class="badge badge-outline">{{ c.count }} items</span>
      </div>
      <p class="text-sm text-slate-600">Top brands and curated picks for {{ c.name.toLowerCase() }}.</p>
      <div class="mt-4 flex items-center justify-between">
        <button class="btn btn-sm border-none bg-[#0c55aa] text-white" @click="openCategory(c.name)">Explore</button>
        <button class="btn btn-sm btn-outline" @click="preview(c.name)">Preview</button>
      </div>
    </article>
  </div>

  <section class="rounded border border-[#dbe2ee] bg-white p-4" v-if="previewItems.length">
    <div class="mb-3 flex items-center justify-between">
      <h3 class="text-xl font-bold text-[#10243a]">Preview: {{ previewCategory }}</h3>
      <button class="btn btn-xs btn-outline" @click="previewCategory=''">Close</button>
    </div>
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article class="rounded border border-[#dbe2ee] p-3" v-for="p in previewItems" :key="p.id">
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
import { getCatalogByCategory } from "../runtime/catalog.js";

export default {
  name: "Pagecategories",
  data: function () {
    return {
      store: null,
      previewCategory: ""
    };
  },
  created: function () {
    this.store = window.__shfyCommerce || null;
  },
  computed: {
    catalog: function () {
      return this.store && Array.isArray(this.store.catalog) ? this.store.catalog : [];
    },
    categoryCards: function () {
      const countByCategory = {};
      this.catalog.forEach(function (item) {
        const category = String(item.category || "General");
        countByCategory[category] = (countByCategory[category] || 0) + 1;
      });
      return Object.keys(countByCategory).map(function (name) {
        return { name: name, count: countByCategory[name] };
      });
    },
    previewItems: function () {
      if (!this.previewCategory) return [];
      return getCatalogByCategory(this.previewCategory).slice(0, 4);
    }
  },
  methods: {
    openCategory: function (name) {
      if (this.store) this.store.setSearchTerm(name);
      location.hash = "/products-grid";
    },
    preview: function (name) {
      this.previewCategory = name;
    },
    openDetail: function (p) {
      if (!this.store) return;
      this.store.setSelectedProduct(p);
      location.hash = "/product-detail?id=" + encodeURIComponent(p.id);
    }
  }
};
</script>
