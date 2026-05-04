<template>
<section class="mx-auto max-w-[1280px] space-y-4">
  <div class="flex items-end justify-between">
    <div>
      <h1 class="text-3xl font-extrabold text-[#06131d]"><i class="fa-solid fa-heart mr-2"></i>Wishlist</h1>
      <p class="text-sm text-slate-500">Save favorites and move them to cart when ready.</p>
    </div>
    <div class="text-sm text-slate-600">Saved: <strong>{{ items.length }}</strong></div>
  </div>

  <div v-if="items.length === 0" class="rounded border border-[#dfe5ef] bg-white p-10 text-center">
    <p class="mb-4 text-slate-600">Your wishlist is empty.</p>
    <button class="btn border-none bg-[#0c55aa] text-white" @click="goProducts">Discover products</button>
  </div>

  <div v-else class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
    <article class="rounded border border-[#dfe5ef] bg-white p-4" v-for="item in items" :key="item.id">
      <img :src="item.img" class="mb-3 h-28 w-full rounded border object-cover" alt="item" />
      <h3 class="line-clamp-2 font-semibold">{{ item.name }}</h3>
      <p class="text-sm text-slate-500">{{ item.tag }}</p>
      <div class="mt-2 flex items-center justify-between">
        <strong>{{ item.price }}</strong>
        <div class="flex gap-2">
          <button class="btn btn-xs btn-outline" @click="openDetail(item)"><i class="fa-regular fa-eye"></i></button>
          <button class="btn btn-xs border-none bg-[#0c55aa] text-white" @click="moveToCart(item.id)"><i class="fa-solid fa-cart-plus mr-1"></i>Move</button>
          <button class="btn btn-xs btn-outline" @click="remove(item.id)"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    </article>
  </div>
</section>
</template>

<script>
export default {
  name: "Pagewishlist",
  data: function () {
    return { store: null };
  },
  created: function () {
    this.store = window.__shfyCommerce || null;
  },
  computed: {
    items: function () {
      return this.store ? this.store.state.wishlist : [];
    }
  },
  methods: {
    moveToCart: function (id) {
      if (this.store) this.store.moveWishlistToCart(id);
    },
    remove: function (id) {
      if (this.store) this.store.removeFromWishlist(id);
    },
    openDetail: function (item) {
      if (!this.store) return;
      this.store.setSelectedProduct(item);
      location.hash = "/product-detail?id=" + encodeURIComponent(item.id);
    },
    goProducts: function () {
      location.hash = "/products-grid";
    }
  }
};
</script>
