<template>
<section class="space-y-5">
  <header class="rounded border border-[#dbe2ee] bg-white p-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-[34px] font-black text-[#06131d]">Admin Dashboard</h1>
        <p class="text-sm text-slate-500">Store performance, operations, catalog control, and fulfillment visibility.</p>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-outline" @click="goTo('products-grid')"><i class="fa-solid fa-boxes-stacked mr-2"></i>Catalog</button>
        <button class="btn border-none bg-[#0c55aa] text-white" @click="goTo('checkout')"><i class="fa-solid fa-file-invoice-dollar mr-2"></i>Checkout flow</button>
      </div>
    </div>
  </header>

  <div v-if="!isAdmin" class="rounded border border-[#dbe2ee] bg-white p-8 text-center">
    <p class="text-slate-600">Admin dashboard is restricted. Sign in with an admin account (email containing <code>admin</code>).</p>
    <button class="btn mt-4 border-none bg-[#0c55aa] text-white" @click="goTo('login')">Go to login</button>
  </div>

  <template v-else>
    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article class="rounded border border-[#dbe2ee] bg-white p-4" v-for="metric in kpis" :key="metric.label">
        <p class="text-xs uppercase tracking-wide text-slate-500">{{ metric.label }}</p>
        <p class="mt-2 text-[28px] font-black text-[#0c55aa]">{{ metric.value }}</p>
        <p class="mt-1 text-xs text-slate-500">{{ metric.meta }}</p>
      </article>
    </section>

    <section class="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
      <article class="rounded border border-[#dbe2ee] bg-white p-4">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-[22px] font-black text-[#10243a]">Order pipeline</h2>
          <button class="btn btn-xs btn-outline" @click="goTo('shipping')">Open fulfillment</button>
        </div>
        <div class="space-y-3">
          <div class="rounded border border-[#e4e9f3] p-3" v-for="stage in pipeline" :key="stage.name">
            <div class="mb-1 flex items-center justify-between">
              <strong class="text-[#10243a]">{{ stage.name }}</strong>
              <span class="text-sm font-semibold text-[#0c55aa]">{{ stage.count }}</span>
            </div>
            <div class="h-2 overflow-hidden rounded bg-[#eef3fb]">
              <div class="h-full bg-[#0c55aa]" :style="{ width: stage.progress + '%' }"></div>
            </div>
          </div>
        </div>
      </article>

      <article class="rounded border border-[#dbe2ee] bg-white p-4">
        <h2 class="mb-3 text-[22px] font-black text-[#10243a]">Top products</h2>
        <div class="space-y-2">
          <div class="flex items-center justify-between rounded border border-[#e4e9f3] p-2" v-for="item in topProducts" :key="item.id">
            <span class="line-clamp-1 text-sm">{{ item.name }}</span>
            <strong class="text-[#0c55aa]">{{ item.price }}</strong>
          </div>
        </div>
      </article>
    </section>

    <section class="grid gap-4 lg:grid-cols-2">
      <article class="rounded border border-[#dbe2ee] bg-white p-4">
        <h2 class="mb-3 text-[22px] font-black text-[#10243a]">Inventory alerts</h2>
        <div class="space-y-2">
          <div class="rounded border border-[#e4e9f3] p-3" v-for="alert in inventoryAlerts" :key="alert.sku">
            <div class="flex items-center justify-between">
              <strong>{{ alert.name }}</strong>
              <span class="badge badge-sm" :class="alert.stock < 8 ? 'badge-error' : 'badge-warning'">{{ alert.stock }} left</span>
            </div>
            <p class="mt-1 text-xs text-slate-500">SKU: {{ alert.sku }} · Supplier: {{ alert.supplier }}</p>
          </div>
        </div>
      </article>

      <article class="rounded border border-[#dbe2ee] bg-white p-4">
        <h2 class="mb-3 text-[22px] font-black text-[#10243a]">Traffic channels</h2>
        <div class="space-y-3">
          <div class="rounded border border-[#e4e9f3] p-3" v-for="channel in channels" :key="channel.name">
            <div class="mb-1 flex items-center justify-between">
              <strong>{{ channel.name }}</strong>
              <span class="text-sm">{{ channel.share }}%</span>
            </div>
            <div class="h-2 overflow-hidden rounded bg-[#eef3fb]">
              <div class="h-full bg-[#0c55aa]" :style="{ width: channel.share + '%' }"></div>
            </div>
          </div>
        </div>
      </article>
    </section>
  </template>
</section>
</template>

<script>
export default {
  name: "Pageadmin-dashboard",
  data: function () {
    return {
      store: null
    };
  },
  created: function () {
    this.store = window.__shfyCommerce || null;
  },
  computed: {
    isAdmin: function () {
      if (!this.store) return false;
      const user = this.store.getUser();
      return !!(user && String(user.role || "").toLowerCase() === "admin");
    },
    catalog: function () {
      return this.store && Array.isArray(this.store.catalog) ? this.store.catalog : [];
    },
    topProducts: function () {
      return this.catalog.slice().sort(function (a, b) {
        return Number(b.rating || 0) - Number(a.rating || 0);
      }).slice(0, 6);
    },
    kpis: function () {
      const gross = this.topProducts.reduce(function (acc, item) {
        const n = parseFloat(String(item.price || "0").replace(/[^\d.]/g, ""));
        return acc + (Number.isFinite(n) ? n : 0);
      }, 0);
      return [
        { label: "Total Products", value: String(this.catalog.length), meta: "Active SKU catalog" },
        { label: "Cart Demand", value: this.store ? String(this.store.getCartCount()) : "0", meta: "Items waiting checkout" },
        { label: "Wishlist Demand", value: this.store ? String(this.store.getWishlistCount()) : "0", meta: "Potential conversions" },
        { label: "Top Product GMV", value: "$" + gross.toFixed(2), meta: "Top-rated product pool" }
      ];
    },
    pipeline: function () {
      const cart = this.store ? this.store.getCartCount() : 0;
      return [
        { name: "New Orders", count: cart + 3, progress: 72 },
        { name: "Processing", count: 6, progress: 55 },
        { name: "Packed", count: 4, progress: 35 },
        { name: "In Transit", count: 9, progress: 88 },
        { name: "Delivered", count: 23, progress: 96 }
      ];
    },
    inventoryAlerts: function () {
      return this.topProducts.slice(0, 4).map(function (item, idx) {
        return {
          sku: "SKU-" + (1200 + idx),
          name: item.name,
          stock: 6 + idx * 2,
          supplier: idx % 2 === 0 ? "Primary Distributor" : "Backup Vendor"
        };
      });
    },
    channels: function () {
      return [
        { name: "Organic Search", share: 34 },
        { name: "Paid Ads", share: 26 },
        { name: "Social", share: 22 },
        { name: "Direct / Returning", share: 18 }
      ];
    }
  },
  methods: {
    goTo: function (slug) {
      location.hash = "/" + slug;
    }
  }
};
</script>
