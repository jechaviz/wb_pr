export const routes = [{ slug: "main_page", title: "Main Page", path: "/" }, { slug: "blog", title: "Blog", path: "/blog" }, { slug: "brands", title: "Brands", path: "/brands" }, { slug: "careers", title: "Careers", path: "/careers" }, { slug: "cart", title: "Cart", path: "/cart" }, { slug: "categories", title: "Categories", path: "/categories" }, { slug: "checkout", title: "Checkout", path: "/checkout" }, { slug: "coming-soon", title: "Coming Soon", path: "/coming-soon" }, { slug: "compare", title: "Compare", path: "/compare" }, { slug: "contact", title: "Contact", path: "/contact" }, { slug: "cookie-policy", title: "Cookie Policy", path: "/cookie-policy" }, { slug: "coupons", title: "Coupons", path: "/coupons" }, { slug: "faqs", title: "FAQs", path: "/faqs" }, { slug: "login", title: "Login", path: "/login" }, { slug: "our-story", title: "Our Story", path: "/our-story" }, { slug: "products-grid", title: "Products Grid", path: "/products-grid" }, { slug: "products-list", title: "Products List", path: "/products-list" }, { slug: "product-detail", title: "Product Detail", path: "/product-detail" }, { slug: "product-compare", title: "Product Compare", path: "/product-compare" }, { slug: "register", title: "Register", path: "/register" }, { slug: "shipping", title: "Shipping", path: "/shipping" }, { slug: "stores", title: "Stores", path: "/stores" }, { slug: "wishlist", title: "Wishlist", path: "/wishlist" }, { slug: "user-dashboard", title: "User Dashboard", path: "/customer/overview" }, { slug: "admin-dashboard", title: "Admin Dashboard", path: "/admin/dashboard" }];
export const defaultRouteSlug = routes.length > 0 ? routes[0].slug : "main_page";
export function findRouteByHash(hash, fallback) {
const fb = fallback || defaultRouteSlug;
const raw = (hash || "").replace(/^#\/?/, "").trim();
if (!raw) return fb;
const clean = raw.split("?")[0];
const hit = routes.find(function (r) { return r.slug === clean; });
return hit ? hit.slug : fb;
}
