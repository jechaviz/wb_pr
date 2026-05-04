<template>
<section class="mx-auto max-w-[1280px] space-y-5">
  <div class="flex items-end justify-between">
    <div>
      <h1 class="text-3xl font-extrabold text-[#06131d]">Checkout</h1>
      <p class="text-sm text-slate-500">Complete shipping and payment details.</p>
    </div>
    <div class="text-sm text-slate-600">Cart items: <strong>{{ cartCount }}</strong></div>
  </div>

  <div v-if="items.length === 0" class="rounded border border-[#e4e8ee] bg-white p-8 text-center">
    <p class="mb-4 text-slate-600">You do not have items to checkout.</p>
    <button class="btn border-none bg-[#0c55aa] text-white" @click="goCart">Back to cart</button>
  </div>

  <div v-else class="grid gap-4 lg:grid-cols-[1fr_360px]">
    <div class="space-y-4 rounded border border-[#e4e8ee] bg-white p-5">
      <h2 class="text-lg font-bold text-[#06131d]">Shipping information</h2>
      <div class="grid gap-3 md:grid-cols-2">
        <label class="form-control">
          <span class="label-text">First name</span>
          <input class="input input-bordered" placeholder="John" />
        </label>
        <label class="form-control">
          <span class="label-text">Last name</span>
          <input class="input input-bordered" placeholder="Doe" />
        </label>
        <label class="form-control md:col-span-2">
          <span class="label-text">Address</span>
          <input class="input input-bordered" placeholder="Street and number" />
        </label>
        <label class="form-control">
          <span class="label-text">City</span>
          <input class="input input-bordered" placeholder="San Diego" />
        </label>
        <label class="form-control">
          <span class="label-text">ZIP</span>
          <input class="input input-bordered" placeholder="92101" />
        </label>
      </div>

      <h2 class="text-lg font-bold text-[#06131d]">Payment</h2>
      <div class="grid gap-3 md:grid-cols-2">
        <label class="form-control md:col-span-2">
          <span class="label-text">Card holder</span>
          <input class="input input-bordered" placeholder="John Doe" />
        </label>
        <label class="form-control md:col-span-2">
          <span class="label-text">Card number</span>
          <input class="input input-bordered" placeholder="4242 4242 4242 4242" />
        </label>
        <label class="form-control">
          <span class="label-text">Exp. date</span>
          <input class="input input-bordered" placeholder="MM/YY" />
        </label>
        <label class="form-control">
          <span class="label-text">CVV</span>
          <input class="input input-bordered" placeholder="123" />
        </label>
      </div>

      <div class="flex flex-wrap gap-2 pt-2">
        <button class="btn border-none bg-[#0c55aa] text-white hover:bg-[#0a4a95]" @click="placeOrder">Place order</button>
        <button class="btn btn-outline" @click="goCart">Back to cart</button>
      </div>
      <p v-if="successMessage" class="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{{ successMessage }}</p>
    </div>

    <aside class="space-y-3 rounded border border-[#e4e8ee] bg-white p-4">
      <h2 class="text-lg font-bold text-[#06131d]">Order summary</h2>
      <div class="max-h-[320px] space-y-2 overflow-auto pr-1">
        <div class="flex items-center justify-between text-sm" v-for="item in items" :key="item.id">
          <span class="line-clamp-1">{{ item.name }} x {{ item.qty }}</span>
          <strong>{{ lineTotal(item) }}</strong>
        </div>
      </div>
      <div class="flex items-center justify-between border-t pt-3 text-base">
        <span class="font-semibold">Subtotal</span>
        <strong>{{ subtotalText }}</strong>
      </div>
      <p class="text-xs text-slate-500">Shipping, taxes, and discounts are calculated at final confirmation.</p>
    </aside>
  </div>
</section>
</template>

<script>
export default {
  name: "Pagecheckout",
  data: function () {
    return {
      store: null,
      successMessage: ""
    };
  },
  created: function () {
    this.store = window.__shfyCommerce || null;
  },
  computed: {
    items: function () {
      return this.store ? this.store.state.cart : [];
    },
    cartCount: function () {
      return this.store ? this.store.getCartCount() : 0;
    },
    subtotalText: function () {
      return this.store ? this.store.formatCurrency(this.store.getCartSubtotal()) : "$0.00";
    }
  },
  methods: {
    lineTotal: function (item) {
      if (!this.store) return "$0.00";
      return this.store.formatCurrency((parseFloat(String(item.price || "0").replace(/[^\d.]/g, "")) || 0) * Math.max(1, Number(item.qty || 1)));
    },
    placeOrder: function () {
      const orderId = "SO-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      this.successMessage = "Order " + orderId + " placed. Redirecting to home...";
      if (this.store) this.store.completeOrder();
      setTimeout(function () {
        location.hash = "/main_page";
      }, 1200);
    },
    goCart: function () {
      location.hash = "/cart";
    }
  }
};
</script>
