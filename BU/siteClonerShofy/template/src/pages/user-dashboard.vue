<template>
<section class="space-y-5">
  <header class="rounded border border-[#dbe2ee] bg-white p-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-[34px] font-black text-[#06131d]">User Dashboard</h1>
        <p class="text-sm text-slate-500">Manage your orders, wishlist, addresses, and account activity.</p>
      </div>
      <button class="btn border-none bg-[#0c55aa] text-white" @click="goTo('products-grid')">
        <i class="fa-solid fa-bag-shopping mr-2"></i>
        Continue shopping
      </button>
    </div>
  </header>

  <div v-if="!user" class="rounded border border-[#dbe2ee] bg-white p-8 text-center">
    <p class="text-slate-600">You need to sign in to view your dashboard.</p>
    <button class="btn mt-4 border-none bg-[#0c55aa] text-white" @click="goTo('login')">Go to login</button>
  </div>

  <template v-else>
    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article class="rounded border border-[#dbe2ee] bg-white p-4" v-for="card in metricCards" :key="card.label">
        <p class="text-xs uppercase tracking-wide text-slate-500">{{ card.label }}</p>
        <p class="mt-2 text-[28px] font-black text-[#0c55aa]">{{ card.value }}</p>
        <p class="mt-1 text-xs text-slate-500">{{ card.meta }}</p>
      </article>
    </section>

    <section class="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <article class="rounded border border-[#dbe2ee] bg-white p-4">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-[22px] font-black text-[#10243a]">Recent orders</h2>
          <button class="btn btn-xs btn-outline" @click="goTo('shipping')">Track all</button>
        </div>

        <div class="overflow-x-auto">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id">
                <td class="font-semibold text-[#10243a]">{{ order.id }}</td>
                <td>{{ order.date }}</td>
                <td>
                  <span class="badge badge-sm" :class="statusClass(order.status)">{{ order.status }}</span>
                </td>
                <td class="font-semibold">{{ order.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="rounded border border-[#dbe2ee] bg-white p-4">
        <h2 class="mb-3 text-[22px] font-black text-[#10243a]">Quick actions</h2>
        <div class="grid gap-2">
          <button class="btn justify-start btn-outline" @click="goTo('shipping')"><i class="fa-solid fa-truck-fast mr-2"></i>Track shipment</button>
          <button class="btn justify-start btn-outline" @click="goTo('wishlist')"><i class="fa-regular fa-heart mr-2"></i>Open wishlist</button>
          <button class="btn justify-start btn-outline" @click="goTo('compare')"><i class="fa-solid fa-code-compare mr-2"></i>Compare products</button>
          <button class="btn justify-start btn-outline" @click="goTo('cart')"><i class="fa-solid fa-cart-shopping mr-2"></i>Open cart</button>
          <button class="btn justify-start border-none bg-[#0c55aa] text-white" @click="goTo('products-grid')"><i class="fa-solid fa-store mr-2"></i>Browse catalog</button>
        </div>
      </article>
    </section>

    <section class="grid gap-4 lg:grid-cols-2">
      <article class="rounded border border-[#dbe2ee] bg-white p-4">
        <h2 class="mb-3 text-[22px] font-black text-[#10243a]">Saved items snapshot</h2>
        <div class="space-y-2 text-sm">
          <p class="flex items-center justify-between"><span>Wishlist items</span><strong>{{ wishlistCount }}</strong></p>
          <p class="flex items-center justify-between"><span>Compare list</span><strong>{{ compareCount }}</strong></p>
          <p class="flex items-center justify-between"><span>Cart items</span><strong>{{ cartCount }}</strong></p>
          <p class="flex items-center justify-between"><span>Estimated subtotal</span><strong>{{ subtotal }}</strong></p>
        </div>
      </article>

      <article class="rounded border border-[#dbe2ee] bg-white p-4">
        <h2 class="mb-3 text-[22px] font-black text-[#10243a]">Account profile</h2>
        <div class="space-y-2 text-sm">
          <p><strong>Name:</strong> {{ user.fullName || "-" }}</p>
          <p><strong>Email:</strong> {{ user.email || "-" }}</p>
          <p><strong>Role:</strong> {{ user.role || "user" }}</p>
          <p><strong>Last order:</strong> {{ lastOrderText }}</p>
        </div>
      </article>
    </section>
  </template>
</section>
</template>

<script>
export default {
  name: "Pageuser-dashboard",
  data: function () {
    return {
      store: null
    };
  },
  created: function () {
    this.store = window.__shfyCommerce || null;
  },
  computed: {
    user: function () {
      return this.store ? this.store.getUser() : null;
    },
    cartCount: function () {
      return this.store ? this.store.getCartCount() : 0;
    },
    wishlistCount: function () {
      return this.store ? this.store.getWishlistCount() : 0;
    },
    compareCount: function () {
      return this.store ? this.store.getCompareCount() : 0;
    },
    subtotal: function () {
      return this.store ? this.store.formatCurrency(this.store.getCartSubtotal()) : "$0.00";
    },
    lastOrderText: function () {
      if (!this.store || !this.store.session || !this.store.session.lastOrderAt) return "No orders yet";
      try {
        return new Date(this.store.session.lastOrderAt).toLocaleString();
      } catch {
        return this.store.session.lastOrderAt;
      }
    },
    recentOrders: function () {
      const seeded = [
        { id: "SO-9Q81ZX", date: "2026-02-14", status: "Delivered", total: "$699.00" },
        { id: "SO-4KD2PW", date: "2026-02-10", status: "In Transit", total: "$320.00" },
        { id: "SO-X2PA18", date: "2026-02-03", status: "Processing", total: "$149.00" }
      ];
      if (!this.store || !this.store.session || !this.store.session.lastOrderAt)
        return seeded;
      const dynamic = {
        id: "SO-" + String(this.store.session.lastOrderAt).replace(/\D/g, "").slice(-6).padStart(6, "0"),
        date: String(new Date(this.store.session.lastOrderAt).toISOString()).slice(0, 10),
        status: "Placed",
        total: this.subtotal
      };
      return [dynamic].concat(seeded).slice(0, 4);
    },
    metricCards: function () {
      return [
        { label: "Orders", value: String(this.recentOrders.length), meta: "Recent order timeline" },
        { label: "Wishlist", value: String(this.wishlistCount), meta: "Saved for later" },
        { label: "Cart Items", value: String(this.cartCount), meta: "Ready to checkout" },
        { label: "Cart Value", value: this.subtotal, meta: "Estimated subtotal" }
      ];
    }
  },
  methods: {
    goTo: function (slug) {
      location.hash = "/" + slug;
    },
    statusClass: function (status) {
      const s = String(status || "").toLowerCase();
      if (s.includes("deliver")) return "badge-success";
      if (s.includes("transit")) return "badge-info";
      if (s.includes("process")) return "badge-warning";
      return "badge-outline";
    }
  }
};
</script>
