<template>
<section class="grid min-h-[360px] place-items-center rounded border border-[#dbe2ee] bg-white p-6 text-center">
  <div class="space-y-4">
    <p class="text-xs font-bold uppercase tracking-wider text-[#0c55aa]">New experience</p>
    <h1 class="text-4xl font-black text-[#06131d]">Coming Soon</h1>
    <p class="text-sm text-slate-600">We are preparing the next storefront upgrade. Stay tuned.</p>
    <div class="inline-flex items-center gap-2 rounded border border-[#dbe2ee] px-4 py-2 text-lg font-bold text-[#10243a]">
      <i class="fa-regular fa-clock text-[#0c55aa]"></i>{{ countdown }}
    </div>
  </div>
</section>
</template>

<script>
export default {
  name: "Pagecoming-soon",
  data: function () {
    return {
      countdown: "48:00:00",
      timer: null,
      targetMs: Date.now() + 1000 * 60 * 60 * 48
    };
  },
  mounted: function () {
    const self = this;
    this.timer = setInterval(function () {
      const total = Math.max(0, Math.floor((self.targetMs - Date.now()) / 1000));
      const h = String(Math.floor(total / 3600)).padStart(2, "0");
      const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
      const s = String(total % 60).padStart(2, "0");
      self.countdown = h + ":" + m + ":" + s;
    }, 1000);
  },
  beforeUnmount: function () {
    if (this.timer) clearInterval(this.timer);
  }
};
</script>
