<template>
<section class="space-y-5">
  <header class="rounded border border-[#dbe2ee] bg-white p-4">
    <h1 class="text-[32px] font-black text-[#06131d]">Login</h1>
    <p class="text-sm text-slate-500">Access your account to manage orders and wishlist.</p>
  </header>

  <div class="mx-auto max-w-[980px] overflow-hidden rounded border border-[#dbe2ee] bg-white">
    <div class="grid md:grid-cols-2">
      <div class="bg-[#f6f8fc] p-6">
        <img src="https://shofy.botble.com/storage/main/general/auth-banner.png" alt="auth" class="h-full w-full object-contain" @error="onImageError($event, 'auth banner')" />
      </div>

      <div class="space-y-4 p-6">
        <h2 class="text-[30px] font-black text-[#10243a]">Login to your account</h2>
        <p class="text-sm text-slate-500">Your personal data will be used to support your experience throughout this website.</p>
        <p class="text-xs text-slate-400">Tip: use an email containing <code>admin</code> to access the admin dashboard in this clone.</p>

        <label class="form-control">
          <span class="label-text">Email</span>
          <input v-model="email" type="email" class="input input-bordered" placeholder="Email address" />
        </label>

        <label class="form-control">
          <span class="label-text">Password</span>
          <input v-model="password" type="password" class="input input-bordered" placeholder="Password" />
        </label>

        <p v-if="error" class="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</p>

        <div class="flex items-center justify-between text-sm">
          <label class="inline-flex items-center gap-2"><input type="checkbox" class="checkbox checkbox-xs" /> Remember me</label>
          <a href="#" class="text-[#0c55aa]">Forgot password?</a>
        </div>

        <button class="btn w-full border-none bg-[#00152d] text-white" @click="submit"><i class="fa-solid fa-right-to-bracket mr-2"></i>Login</button>

        <p class="text-center text-sm text-slate-500">Don\'t have an account? <a href="#/register" class="font-semibold text-[#0c55aa]" @click.prevent="goRegister">Register now</a></p>

        <div class="space-y-2 pt-2">
          <button class="btn w-full border-none bg-[#1877f2] text-white"><i class="fa-brands fa-facebook-f mr-2"></i>Sign in with Facebook</button>
          <button class="btn w-full border-none bg-[#ea4335] text-white"><i class="fa-brands fa-google mr-2"></i>Sign in with Google</button>
          <button class="btn w-full border-none bg-[#111827] text-white"><i class="fa-brands fa-github mr-2"></i>Sign in with GitHub</button>
          <button class="btn w-full border-none bg-[#0a66c2] text-white"><i class="fa-brands fa-linkedin mr-2"></i>Sign in with LinkedIn</button>
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<script>
export default {
  name: "Pagelogin",
  data: function () {
    return {
      store: null,
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
      const email = String(this.email || "").trim();
      const password = String(this.password || "");
      if (!email || !email.includes("@")) {
        this.error = "Please enter a valid email.";
        return;
      }
      if (password.length < 4) {
        this.error = "Password is too short.";
        return;
      }
      if (this.store) {
        this.store.login({ email: email });
      }
      if (this.store && this.store.isAdmin && this.store.isAdmin()) {
        location.hash = "/admin-dashboard";
        return;
      }
      location.hash = "/user-dashboard";
    },
    goRegister: function () {
      location.hash = "/register";
    },
    onImageError: function (evt, seed) {
      const target = evt && evt.target;
      if (!target) return;
      const fb = "https://source.unsplash.com/900x700/?" + encodeURIComponent(seed || "login");
      if (target.src !== fb) target.src = fb;
    }
  }
};
</script>
