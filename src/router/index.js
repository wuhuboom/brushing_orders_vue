import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "hash",
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "*", redirect: "/" },
  ],
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});
