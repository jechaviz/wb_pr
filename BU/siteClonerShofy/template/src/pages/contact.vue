<template>
<section class="space-y-5">
  <header class="rounded border border-[#dbe2ee] bg-white p-4">
    <h1 class="text-[32px] font-black text-[#06131d]">Contact</h1>
    <p class="text-sm text-slate-500">Need help with an order or vendor onboarding? Send us a message.</p>
  </header>

  <div class="grid gap-4 lg:grid-cols-[1fr_360px]">
    <form class="space-y-3 rounded border border-[#dbe2ee] bg-white p-4" @submit.prevent="submit">
      <div class="grid gap-3 md:grid-cols-2">
        <label class="form-control">
          <span class="label-text">First name</span>
          <input class="input input-bordered" v-model="firstName" required />
        </label>
        <label class="form-control">
          <span class="label-text">Last name</span>
          <input class="input input-bordered" v-model="lastName" required />
        </label>
      </div>
      <label class="form-control">
        <span class="label-text">Email</span>
        <input class="input input-bordered" type="email" v-model="email" required />
      </label>
      <label class="form-control">
        <span class="label-text">Topic</span>
        <select class="select select-bordered" v-model="topic">
          <option value="order">Order Support</option>
          <option value="returns">Returns</option>
          <option value="vendor">Vendor Partnership</option>
          <option value="technical">Technical Issue</option>
        </select>
      </label>
      <label class="form-control">
        <span class="label-text">Message</span>
        <textarea class="textarea textarea-bordered min-h-[140px]" v-model="message" required></textarea>
      </label>
      <button class="btn border-none bg-[#0c55aa] text-white">Send message</button>
      <p class="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700" v-if="sent">Message received. Support will contact you soon.</p>
    </form>

    <aside class="space-y-3 rounded border border-[#dbe2ee] bg-white p-4">
      <h2 class="text-lg font-bold text-[#10243a]">Support channels</h2>
      <p class="text-sm text-slate-600"><i class="fa-solid fa-phone mr-2 text-[#0c55aa]"></i>+670 413 90 762</p>
      <p class="text-sm text-slate-600"><i class="fa-solid fa-envelope mr-2 text-[#0c55aa]"></i>support@shofy.com</p>
      <p class="text-sm text-slate-600"><i class="fa-solid fa-location-dot mr-2 text-[#0c55aa]"></i>79 Sleepy Hollow St. Jamaica, NY</p>
      <p class="text-sm text-slate-600"><i class="fa-solid fa-clock mr-2 text-[#0c55aa]"></i>Mon - Fri, 9:00 - 18:00</p>
    </aside>
  </div>
</section>
</template>

<script>
export default {
  name: "Pagecontact",
  data: function () {
    return {
      firstName: "",
      lastName: "",
      email: "",
      topic: "order",
      message: "",
      sent: false
    };
  },
  methods: {
    submit: function () {
      this.sent = true;
      this.message = "";
    }
  }
};
</script>
