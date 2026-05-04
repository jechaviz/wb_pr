<template>
<section class="space-y-5">
  <header class="rounded border border-[#dbe2ee] bg-white p-4">
    <h1 class="text-[32px] font-black text-[#06131d]">Careers</h1>
    <p class="text-sm text-slate-500">Join the team building the next generation ecommerce experience.</p>
  </header>

  <div class="grid gap-4 md:grid-cols-2">
    <article class="rounded border border-[#dbe2ee] bg-white p-4" v-for="job in jobs" :key="job.role">
      <h2 class="text-lg font-bold text-[#10243a]">{{ job.role }}</h2>
      <p class="mt-1 text-xs text-slate-500">{{ job.location }} · {{ job.type }}</p>
      <p class="mt-2 text-sm text-slate-600">{{ job.summary }}</p>
      <button class="btn btn-sm mt-3 border-none bg-[#0c55aa] text-white">Apply</button>
    </article>
  </div>
</section>
</template>

<script>
export default {
  name: "Pagecareers",
  data: function () {
    return {
      jobs: [
        { role: "Frontend Engineer", location: "Remote", type: "Full-time", summary: "Build high-fidelity storefront interfaces and component systems." },
        { role: "Product Designer", location: "Remote", type: "Contract", summary: "Drive UX quality for shopping flows, navigation, and conversion paths." },
        { role: "Ecommerce Operations Lead", location: "Hybrid", type: "Full-time", summary: "Coordinate vendor operations, pricing, and order performance." },
        { role: "Growth Analyst", location: "Remote", type: "Part-time", summary: "Measure conversion funnels and optimize traffic-to-checkout performance." }
      ]
    };
  }
};
</script>
