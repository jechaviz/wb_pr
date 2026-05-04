<template>
<section class="mx-auto max-w-[1280px] space-y-4">
  <div class="flex items-end justify-between">
    <div>
      <h1 class="text-3xl font-extrabold text-[#06131d]"><i class="fa-solid fa-cart-shopping mr-2"></i>Shopping Cart</h1>
      <p class="text-sm text-slate-500">Review your products before checkout.</p>
    </div>
    <div class="text-sm text-slate-600">Items: <strong>{{ count }}</strong></div>
  </div>

  <div v-if="items.length === 0" class="rounded border border-[#dfe5ef] bg-white p-10 text-center">
    <p class="mb-4 text-slate-600">Your cart is empty.</p>
    <button class="btn border-none bg-[#0c55aa] text-white" @click="goProducts">Go to products</button>
  </div>

  <div v-else class="rounded border border-[#dfe5ef] bg-white">
    <table class="w-full text-sm">
      <thead class="border-b bg-[#f8fbff] text-left text-[#23364d]">
        <tr>
          <th class="p-3">Product</th>
          <th class="p-3">Price</th>
          <th class="p-3">Qty</th>
          <th class="p-3">Total</th>
          <th class="p-3"></th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b" v-for="item in items" :key="item.id">
          <td class="p-3">
            <div class="flex items-center gap-3">
              <button @click="openDetail(item)">
                <img :src="item.img" class="h-14 w-14 rounded border object-cover" alt="item" />
              </button>
              <div>
                <div class="font-semibold">{{ item.name }}</div>
                <div class="text-xs text-slate-500">{{ item.tag }}</div>
              </div>
            </div>
          </td>
          <td class="p-3">{{ item.price }}</td>
          <td class="p-3">
            <div class="inline-flex items-center rounded border">
              <button class="px-2 py-1" @click="qtyDown(item)"><i class="fa-solid fa-minus"></i></button>
              <span class="min-w-[32px] text-center">{{ item.qty }}</span>
              <button class="px-2 py-1" @click="qtyUp(item)"><i class="fa-solid fa-plus"></i></button>
            </div>
          </td>
          <td class="p-3 font-semibold">{{ lineTotal(item) }}</td>
          <td class="p-3 text-right">
            <button class="btn btn-xs btn-outline" @click="remove(item.id)"><i class="fa-solid fa-trash mr-1"></i>Remove</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex flex-wrap items-center justify-between gap-2 p-4">
      <button class="btn btn-outline btn-sm" @click="clear"><i class="fa-solid fa-xmark mr-1"></i>Clear cart</button>
      <div class="flex items-center gap-3">
        <div class="text-base">Subtotal: <strong>{{ subtotal }}</strong></div>
        <button class="btn border-none bg-[#0c55aa] text-white" @click="goCheckout">Proceed to checkout</button>
      </div>
    </div>
  </div>
</section>
</template>

<script>
export default {
  name: "Pagecart",
  data: function () {
    return { store: null };
  },
  created: function () {
    this.store = window.__shfyCommerce || null;
  },
  computed: {
    items: function () {
      return this.store ? this.store.state.cart : [];
    },
    count: function () {
      return this.store ? this.store.getCartCount() : 0;
    },
    subtotal: function () {
      return this.store ? this.store.formatCurrency(this.store.getCartSubtotal()) : "$0.00";
    }
  },
  methods: {
    qtyUp: function (item) {
      if (!this.store) return;
      this.store.setCartQty(item.id, Number(item.qty || 1) + 1);
    },
    qtyDown: function (item) {
      if (!this.store) return;
      this.store.setCartQty(item.id, Math.max(1, Number(item.qty || 1) - 1));
    },
    remove: function (id) {
      if (this.store) this.store.removeFromCart(id);
    },
    clear: function () {
      if (this.store) this.store.clearCart();
    },
    openDetail: function (item) {
      if (!this.store) return;
      this.store.setSelectedProduct(item);
      location.hash = "/product-detail?id=" + encodeURIComponent(item.id);
    },
    lineTotal: function (item) {
      if (!this.store) return "$0.00";
      const unit = parseFloat(String(item.price || "0").replace(/[^\d.]/g, "")) || 0;
      return this.store.formatCurrency(unit * Math.max(1, Number(item.qty || 1)));
    },
    goProducts: function () {
      location.hash = "/products-grid";
    },
    goCheckout: function () {
      location.hash = "/checkout";
    }
  }
};
</script>
