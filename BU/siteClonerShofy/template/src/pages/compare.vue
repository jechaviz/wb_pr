<template>
<section class="mx-auto max-w-[1280px] space-y-4">
  <div class="flex items-end justify-between">
    <div>
      <h1 class="text-3xl font-extrabold text-[#06131d]"><i class="fa-solid fa-code-compare mr-2"></i>Compare Products</h1>
      <p class="text-sm text-slate-500">Keep a shortlist before checkout.</p>
    </div>
    <div class="text-sm text-slate-600">Items: <strong>{{ items.length }}</strong></div>
  </div>

  <div v-if="items.length === 0" class="rounded border border-[#dfe5ef] bg-white p-10 text-center">
    <p class="mb-4 text-slate-600">No products in comparison.</p>
    <button class="btn border-none bg-[#0c55aa] text-white" @click="goProducts">Discover products</button>
  </div>

  <div v-else class="overflow-x-auto rounded border border-[#dfe5ef] bg-white">
    <table class="w-full min-w-[720px] text-sm">
      <thead class="border-b bg-[#f8fbff] text-left text-[#23364d]">
        <tr>
          <th class="p-3">Product</th>
          <th class="p-3">Tag</th>
          <th class="p-3">Price</th>
          <th class="p-3"></th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b" v-for="item in items" :key="item.id">
          <td class="p-3">
            <div class="flex items-center gap-3">
              <img :src="item.img" class="h-14 w-14 rounded border object-cover" alt="item" />
              <div class="font-semibold">{{ item.name }}</div>
            </div>
          </td>
          <td class="p-3">{{ item.tag }}</td>
          <td class="p-3 font-semibold">{{ item.price }}</td>
          <td class="p-3 text-right">
            <div class="inline-flex gap-2">
              <button class="btn btn-xs btn-outline" @click="openDetail(item)"><i class="fa-regular fa-eye"></i></button>
              <button class="btn btn-xs border-none bg-[#0c55aa] text-white" @click="moveToCart(item.id)"><i class="fa-solid fa-cart-plus mr-1"></i>Move</button>
              <button class="btn btn-xs btn-outline" @click="remove(item.id)"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-end p-3">
      <button class="btn btn-sm btn-outline" @click="clear"><i class="fa-solid fa-xmark mr-1"></i>Clear compare</button>
    </div>
  </div>
</section>
</template>

<script>
export default {
  name: "Pagecompare",
  data: function () {
    return { store: null };
  },
  created: function () {
    this.store = window.__shfyCommerce || null;
  },
  computed: {
    items: function () {
      return this.store ? this.store.state.compare : [];
    }
  },
  methods: {
    moveToCart: function (id) {
      if (this.store) this.store.moveCompareToCart(id);
    },
    remove: function (id) {
      if (this.store) this.store.removeFromCompare(id);
    },
    openDetail: function (item) {
      if (!this.store) return;
      this.store.setSelectedProduct(item);
      location.hash = "/product-detail?id=" + encodeURIComponent(item.id);
    },
    clear: function () {
      if (this.store) this.store.clearCompare();
    },
    goProducts: function () {
      location.hash = "/products-grid";
    }
  }
};
</script>
