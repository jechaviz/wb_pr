<template>
<section class="space-y-5">
  <header class="rounded border border-[#dbe2ee] bg-white p-4">
    <h1 class="text-[32px] font-black text-[#06131d]">Track Your Order</h1>
    <p class="text-sm text-slate-500">Use your order number to review shipping progress.</p>
  </header>

  <div class="rounded border border-[#dbe2ee] bg-white p-4">
    <form class="flex flex-wrap items-end gap-2" @submit.prevent="track">
      <label class="form-control w-full sm:w-80">
        <span class="label-text">Order ID</span>
        <input class="input input-bordered" v-model="orderId" placeholder="SO-XXXXXX" />
      </label>
      <button class="btn border-none bg-[#0c55aa] text-white">Track</button>
    </form>
  </div>

  <div class="rounded border border-[#dbe2ee] bg-white p-4" v-if="tracking">
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-xl font-bold text-[#10243a]">Order {{ tracking.id }}</h2>
      <span class="badge border-none bg-[#0c55aa] text-white">{{ tracking.status }}</span>
    </div>

    <ul class="space-y-3">
      <li class="flex gap-3" v-for="step in tracking.steps" :key="step.label">
        <span class="mt-1 inline-block h-3 w-3 rounded-full bg-[#0c55aa]"></span>
        <div>
          <div class="font-semibold text-[#10243a]">{{ step.label }}</div>
          <div class="text-xs text-slate-500">{{ step.when }}</div>
        </div>
      </li>
    </ul>
  </div>
</section>
</template>

<script>
export default {
  name: "Pageshipping",
  data: function () {
    return {
      store: null,
      orderId: "",
      tracking: null
    };
  },
  created: function () {
    this.store = window.__shfyCommerce || null;
    if (this.store && this.store.session && this.store.session.lastOrderAt) {
      this.orderId = "SO-LAST";
      this.track();
    }
  },
  methods: {
    track: function () {
      const id = String(this.orderId || "").trim() || "SO-DEMO01";
      const now = new Date();
      const d = function (minutesAgo) {
        return new Date(now.getTime() - minutesAgo * 60000).toLocaleString();
      };
      this.tracking = {
        id: id,
        status: "In Transit",
        steps: [
          { label: "Order confirmed", when: d(260) },
          { label: "Supplier accepted", when: d(180) },
          { label: "Warehouse processing", when: d(120) },
          { label: "Carrier pickup", when: d(60) }
        ]
      };
    }
  }
};
</script>
