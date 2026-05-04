<template>
<section class="space-y-5">
  <header class="rounded border border-[#dbe2ee] bg-white p-4">
    <h1 class="text-[32px] font-black text-[#06131d]">Product Compare Matrix</h1>
    <p class="text-sm text-slate-500">Compare selected products side by side before checkout.</p>
  </header>

  <div class="rounded border border-[#dbe2ee] bg-white p-4" v-if="items.length === 0">
    <p class="text-sm text-slate-600">No products in compare list yet.</p>
    <button class="btn btn-sm mt-3 border-none bg-[#0c55aa] text-white" @click="goCatalog">Go to catalog</button>
  </div>

  <div class="overflow-x-auto rounded border border-[#dbe2ee] bg-white" v-else>
    <table class="w-full min-w-[820px] text-sm">
      <thead class="border-b bg-[#f8fbff]">
        <tr>
          <th class="p-3 text-left">Feature</th>
          <th class="p-3 text-left" v-for="p in items" :key="p.id">{{ p.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b">
          <td class="p-3 font-semibold">Price</td>
          <td class="p-3" v-for="p in items" :key="p.id + '-price'">{{ p.price }}</td>
        </tr>
        <tr class="border-b">
          <td class="p-3 font-semibold">Category</td>
          <td class="p-3" v-for="p in items" :key="p.id + '-category'">{{ p.tag }}</td>
        </tr>
        <tr class="border-b">
          <td class="p-3 font-semibold">Actions</td>
          <td class="p-3" v-for="p in items" :key="p.id + '-action'">
            <div class="flex gap-2">
              <button class="btn btn-xs border-none bg-[#0c55aa] text-white" @click="moveToCart(p.id)">Move</button>
              <button class="btn btn-xs btn-outline" @click="remove(p.id)">Remove</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</section>
</template>

<script>
export default {
  name: "Pageproduct-compare",
  data: function () {
    return {
      store: null
    };
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
    goCatalog: function () {
      location.hash = "/products-grid";
    }
  }
};
</script>
