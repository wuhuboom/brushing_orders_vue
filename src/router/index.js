// router/index.js
import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/index.vue";
import VipsView from "../views/vips/index.vue";
import StartingView from "../views/starting/index.vue";
import RecordsView from "../views/records/index.vue";
import MyView from "../views/my/index.vue";

// 自动导入views目录下所有vue文件作为路由
const modules = import.meta.glob("../views/**/*.vue");
const eagerRouteComponents = {
  "/": HomeView,
  "/vips": VipsView,
  "/starting": StartingView,
  "/records": RecordsView,
  "/my": MyView,
};

const routeMetaConfig = {
  "/guide": { skipZoneActive: true },
  "/clause": { skipZoneActive: true },
  "/event": { skipZoneActive: true },
  "/cert": { skipZoneActive: true },
  "/faqs": { skipZoneActive: true },
  "/vips": { skipZoneActive: true },
  "/": { skipZoneActive: true },
  "/my": { skipZoneActive: true },
  "/updatePassword": { skipZoneActive: true },
  "/updateTransactionPassword": { skipZoneActive: true },
  "/cardList": { skipZoneActive: true },
  "/tc": { skipZoneActive: true },
};

const routes = Object.entries(modules)
  .map(([path, component]) => {
    // Skip files in components directory
    if (path.includes("/components/")) return null;

    const routePath =
      path
        .replace("../views", "")
        .replace(/\.vue$/, "")
        .replace(/\/index$/, "") || "/";

    return {
      path: routePath,
      component: eagerRouteComponents[routePath] || component,
      name: routePath.split("/").filter(Boolean).join("-") || "home",
      meta: routeMetaConfig[routePath] || {},
    };
  })
  .filter(Boolean); // 过滤掉null值
console.log(routes, "routes");

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 登录路由拦截
// 只判断本地持久化的 token，避免未登录用户直接输入首页/其他业务页面地址时先看到页面。
const publicRoutePaths = [
  "/account/login",
  "/account/register",
  "/tc",
  "/clause",
  "/customer",
];

function getPersistedToken() {
  try {
    const userState = JSON.parse(localStorage.getItem("user") || "{}");
    return typeof userState?.token === "string" ? userState.token.trim() : "";
  } catch (error) {
    return "";
  }
}

router.beforeEach((to, from, next) => {
  if (publicRoutePaths.includes(to.path)) {
    next();
    return;
  }

  if (!getPersistedToken()) {
    next({ path: "/account/login", replace: true });
    return;
  }

  next();
});

export default router;
