<template>
<section class="space-y-5">
  <header class="rounded border border-[#dbe2ee] bg-white p-4">
    <h1 class="text-[32px] font-black text-[#06131d]">FAQs</h1>
    <p class="text-sm text-slate-500">Answers about shopping, shipping, payment, and returns.</p>
  </header>

  <div class="rounded border border-[#dbe2ee] bg-white p-4">
    <input class="input input-bordered w-full" v-model="search" placeholder="Search in FAQ" />
  </div>

  <div class="space-y-3">
    <article class="rounded border border-[#dbe2ee] bg-white" v-for="item in filtered" :key="item.q">
      <button class="flex w-full items-center justify-between px-4 py-3 text-left" @click="toggle(item.q)">
        <span class="font-semibold text-[#10243a]">{{ item.q }}</span>
        <i class="fa-solid" :class="opened[item.q] ? 'fa-minus' : 'fa-plus'"></i>
      </button>
      <div class="border-t px-4 py-3 text-sm text-slate-600" v-if="opened[item.q]">{{ item.a }}</div>
    </article>
  </div>
</section>
</template>

<script>
export default {
  name: "Pagefaqs",
  data: function () {
    return {
      search: "",
      opened: {},
      items: [
        { q: "How fast is shipping?", a: "Most orders ship in 2-4 business days depending on destination and courier availability." },
        { q: "Can I track my order?", a: "Yes. Open the Shipping page and enter your order ID to view current status." },
        { q: "How do I return an item?", a: "Go to My Account > Order History and submit a return request within 30 days." },
        { q: "What payment methods are accepted?", a: "Credit/debit cards and selected digital wallets are supported." },
        { q: "Can I save items for later?", a: "Yes, use Wishlist and Compare from product cards to shortlist products." }
      ]
    };
  },
  computed: {
    filtered: function () {
      const q = String(this.search || "").toLowerCase().trim();
      if (!q) return this.items;
      return this.items.filter(function (item) {
        return (item.q + " " + item.a).toLowerCase().includes(q);
      });
    }
  },
  methods: {
    toggle: function (key) {
      this.opened[key] = !this.opened[key];
    }
  }
};
</script>
