import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";

Vue.use(Router);

export default new Router({
  mode: "hash",
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/about", name: "about", component: About },
    { path: "/official", redirect: "/about" },
    { path: "*", redirect: "/" },
  ],
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});
