<template>
<section class="space-y-5">
  <header class="rounded border border-[#dbe2ee] bg-white p-4">
    <h1 class="text-[32px] font-black text-[#06131d]">Register</h1>
    <p class="text-sm text-slate-500">Create a new account for orders, tracking, and rewards.</p>
  </header>

  <div class="mx-auto max-w-[980px] overflow-hidden rounded border border-[#dbe2ee] bg-white">
    <div class="grid md:grid-cols-2">
      <div class="bg-[#f6f8fc] p-6">
        <img src="https://shofy.botble.com/storage/main/general/auth-banner.png" alt="register" class="h-full w-full object-contain" @error="onImageError($event, 'register banner')" />
      </div>

      <div class="space-y-4 p-6">
        <h2 class="text-[30px] font-black text-[#10243a]">Register an account</h2>
        <p class="text-sm text-slate-500">Create your profile to start buying and tracking shipments.</p>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="form-control">
            <span class="label-text">First name</span>
            <input v-model="firstName" class="input input-bordered" placeholder="John" />
          </label>
          <label class="form-control">
            <span class="label-text">Last name</span>
            <input v-model="lastName" class="input input-bordered" placeholder="Doe" />
          </label>
        </div>

        <label class="form-control">
          <span class="label-text">Email</span>
          <input v-model="email" type="email" class="input input-bordered" placeholder="Email address" />
        </label>

        <label class="form-control">
          <span class="label-text">Password</span>
          <input v-model="password" type="password" class="input input-bordered" placeholder="Password" />
        </label>

        <p v-if="error" class="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</p>

        <label class="inline-flex items-center gap-2 text-sm"><input type="checkbox" class="checkbox checkbox-xs" checked /> I agree with privacy policy</label>

        <button class="btn w-full border-none bg-[#0c55aa] text-white" @click="submit"><i class="fa-solid fa-user-plus mr-2"></i>Create account</button>

        <p class="text-center text-sm text-slate-500">Already have an account? <a href="#/login" class="font-semibold text-[#0c55aa]" @click.prevent="goLogin">Login now</a></p>
      </div>
    </div>
  </div>
</section>
</template>

<script>
export default {
  name: "Pageregister",
  data: function () {
    return {
      store: null,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      error: ""
    };
  },
  created: function () {
    this.store = window.__shfyCommerce || null;
  },
  methods: {
    submit: function () {
      this.error = "";
      const firstName = String(this.firstName || "").trim();
      const lastName = String(this.lastName || "").trim();
      const email = String(this.email || "").trim();
      const password = String(this.password || "");
      if (!firstName || !lastName) {
        this.error = "Please fill first and last name.";
        return;
      }
      if (!email || !email.includes("@")) {
        this.error = "Please enter a valid email.";
        return;
      }
      if (password.length < 6) {
        this.error = "Password must have at least 6 characters.";
        return;
      }
      if (this.store) {
        this.store.login({ firstName: firstName, lastName: lastName, email: email });
      }
      location.hash = "/user-dashboard";
    },
    goLogin: function () {
      location.hash = "/login";
    },
    onImageError: function (evt, seed) {
      const target = evt && evt.target;
      if (!target) return;
      const fb = "https://source.unsplash.com/900x700/?" + encodeURIComponent(seed || "register");
      if (target.src !== fb) target.src = fb;
    }
  }
};
</script>
