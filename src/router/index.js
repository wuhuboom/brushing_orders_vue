// router/index.js
import { createRouter, createWebHashHistory } from "vue-router";
import pinia from "@/store/index.js";
import { useUserStore } from "@/store/modules/user";

// 自动导入views目录下所有vue文件作为路由
const modules = import.meta.glob("../views/**/*.vue", { eager: true });

const routes = Object.entries(modules)
  .map(([path, module]) => {
    // Skip files in components directory
    if (path.includes("/components/")) return null;

    const routePath =
      path
        .replace("../views", "")
        .replace(/\.vue$/, "")
        .replace(/\/index$/, "") || "/";

    return {
      path: routePath,
      component: module.default,
      name: routePath.split("/").filter(Boolean).join("-") || "home",
    };
  })
  .filter(Boolean); // 过滤掉null值

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 更新路由拦截
router.beforeEach((to, from, next) => {
  const publicRoutes = [
    "/account/welcome",
    "/account/login",
    "/account/register",
    "/tc",
    "/clause",
    "/about",
    "/cert",
    "/faqs",
    "/event",
    "/guide",
    "/contact",
    "/setting/language",
  ];
  const isAuthenticated = Boolean(useUserStore(pinia).token);
  if (!publicRoutes.includes(to.path) && !isAuthenticated)
    next({ path: "/account/login", replace: true });
  else next();
});

export default router;
