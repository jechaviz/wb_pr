<template>
<section class="space-y-5">
  <header class="rounded border border-[#dbe2ee] bg-white p-4">
    <h1 class="text-[32px] font-black text-[#06131d]">Blog</h1>
    <p class="text-sm text-slate-500">Stories, trends and market updates from the Shofy world.</p>
  </header>

  <div class="grid gap-4 md:grid-cols-3">
    <article class="rounded border border-[#dbe2ee] bg-white" v-for="post in posts" :key="post.title">
      <img :src="post.image" :alt="post.title" class="h-48 w-full object-cover" @error="onImageError($event, post.title)" />
      <div class="p-4">
        <div class="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span><i class="fa-regular fa-calendar mr-1"></i>{{ post.date }}</span>
          <span><i class="fa-regular fa-user mr-1"></i>{{ post.author }}</span>
        </div>
        <h3 class="line-clamp-2 text-[20px] font-black text-[#10243a]">{{ post.title }}</h3>
        <p class="mt-2 line-clamp-3 text-sm text-slate-600">{{ post.excerpt }}</p>
        <button class="mt-3 text-sm font-semibold text-[#0c55aa]">Read more <i class="fa-solid fa-arrow-right ml-1"></i></button>
      </div>
    </article>
  </div>
</section>
</template>

<script>
export default {
  name: "Pageblog",
  data: function () {
    return {
      posts: [
        {
          title: "4 Expert Tips On How To Choose The Right Men's Wallet",
          date: "Jun 12, 2026",
          author: "Ravi O'Leigh",
          excerpt: "Explore practical selection criteria and style principles to choose wallets that align with your daily use and fashion goals.",
          image: "https://shofy.botble.com/storage/main/blog/post-6-420x270.jpg"
        },
        {
          title: "Sexy Clutches: How to Buy and Wear a Designer Clutch Bag",
          date: "May 28, 2026",
          author: "Ravi O'Leigh",
          excerpt: "A quick guide to selecting clutch bags for formal and casual outfits while maintaining comfort and utility.",
          image: "https://shofy.botble.com/storage/main/blog/post-12-420x270.jpg"
        },
        {
          title: "The Top 2026 Handbag Trends to Know",
          date: "May 11, 2026",
          author: "Ravi O'Leigh",
          excerpt: "From materials to shape trends, here are the silhouettes and design patterns leading this season's collections.",
          image: "https://shofy.botble.com/storage/main/blog/post-1-420x270.jpg"
        }
      ]
    };
  },
  methods: {
    onImageError: function (evt, seed) {
      const target = evt && evt.target;
      if (!target) return;
      const fb = "https://source.unsplash.com/900x500/?" + encodeURIComponent(seed || "blog");
      if (target.src !== fb) target.src = fb;
    }
  }
};
</script>
