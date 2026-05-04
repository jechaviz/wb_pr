<template>
<section class="space-y-5">
  <header class="rounded border border-[#dbe2ee] bg-white p-4">
    <h1 class="text-[32px] font-black text-[#06131d]">Coupons</h1>
    <p class="text-sm text-slate-500">Copy a promo code and use it during checkout.</p>
  </header>

  <div class="grid gap-4 md:grid-cols-2">
    <article class="rounded border border-dashed border-[#0c55aa] bg-white p-4" v-for="c in coupons" :key="c.code">
      <div class="mb-2 flex items-center justify-between">
        <span class="badge border-none bg-[#0c55aa] text-white">{{ c.discount }}</span>
        <span class="text-xs text-slate-500">Valid {{ c.valid }}</span>
      </div>
      <h2 class="text-xl font-black text-[#10243a]">{{ c.code }}</h2>
      <p class="mt-1 text-sm text-slate-600">{{ c.desc }}</p>
      <button class="btn btn-sm mt-3 border-none bg-[#0c55aa] text-white" @click="useCoupon(c.code)">Use coupon</button>
    </article>
  </div>

  <p class="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700" v-if="selected">
    Coupon <strong>{{ selected }}</strong> selected. Proceed to checkout to apply.
  </p>
</section>
</template>

<script>
export default {
  name: "Pagecoupons",
  data: function () {
    return {
      selected: "",
      coupons: [
        { code: "WELCOME20", discount: "20% OFF", valid: "until Aug 31", desc: "Applies to first order over $80." },
        { code: "FREESHIP99", discount: "Free Shipping", valid: "until Sep 10", desc: "Free delivery for orders above $99." },
        { code: "TVDEAL15", discount: "15% OFF TV", valid: "until Sep 01", desc: "Valid for Smart TV category only." },
        { code: "AUDIO10", discount: "10% OFF Audio", valid: "until Sep 15", desc: "Applies to soundbar and headphones." }
      ]
    };
  },
  methods: {
    useCoupon: function (code) {
      this.selected = code;
      const store = window.__shfyCommerce || null;
      if (store) store.setSearchTerm(code.replace(/[0-9]/g, ""));
    }
  }
};
</script>
