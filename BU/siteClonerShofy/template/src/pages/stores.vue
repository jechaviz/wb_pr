<template>
<section class="space-y-5">
  <header class="rounded border border-[#dbe2ee] bg-white p-4">
    <h1 class="text-[32px] font-black text-[#06131d]">Store Locations</h1>
    <p class="text-sm text-slate-500">Find service points and partner warehouses near your region.</p>
  </header>

  <div class="grid gap-4 lg:grid-cols-[1fr_380px]">
    <div class="rounded border border-[#dbe2ee] bg-white p-4">
      <div class="mb-4 grid gap-3 md:grid-cols-2">
        <input class="input input-bordered" v-model="query" placeholder="Search by city" />
        <select class="select select-bordered" v-model="country">
          <option value="">All countries</option>
          <option value="US">United States</option>
          <option value="MX">Mexico</option>
          <option value="CA">Canada</option>
        </select>
      </div>

      <div class="space-y-3">
        <article class="rounded border border-[#dbe2ee] p-3" v-for="store in filteredStores" :key="store.name">
          <h3 class="font-bold text-[#10243a]">{{ store.name }}</h3>
          <p class="text-sm text-slate-600">{{ store.address }}</p>
          <p class="text-xs text-slate-500">{{ store.city }}, {{ store.country }}</p>
        </article>
      </div>
    </div>

    <aside class="rounded border border-[#dbe2ee] bg-white p-4">
      <h2 class="mb-3 text-lg font-bold text-[#10243a]">Map preview</h2>
      <div class="grid h-72 place-items-center rounded border bg-slate-50 text-center text-sm text-slate-500">
        Interactive map can be connected to Mapbox/OpenStreetMap.
      </div>
    </aside>
  </div>
</section>
</template>

<script>
export default {
  name: "Pagestores",
  data: function () {
    return {
      query: "",
      country: "",
      stores: [
        { name: "Shofy NY Fulfillment", address: "79 Sleepy Hollow St", city: "New York", country: "US" },
        { name: "Shofy West Hub", address: "120 Harbor Ave", city: "San Diego", country: "US" },
        { name: "Shofy CDMX Partner", address: "Av. Insurgentes 1450", city: "Mexico City", country: "MX" },
        { name: "Shofy Toronto Hub", address: "15 King Street W", city: "Toronto", country: "CA" }
      ]
    };
  },
  computed: {
    filteredStores: function () {
      const q = String(this.query || "").toLowerCase().trim();
      const country = String(this.country || "").trim();
      return this.stores.filter(function (s) {
        const byCountry = !country || s.country === country;
        const hay = (s.name + " " + s.address + " " + s.city).toLowerCase();
        const byQuery = !q || hay.includes(q);
        return byCountry && byQuery;
      });
    }
  }
};
</script>
