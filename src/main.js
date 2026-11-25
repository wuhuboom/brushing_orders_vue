import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

function mountApp() {
  new Vue({ router, render: (h) => h(App) }).$mount("#app");
}

const configScript = document.createElement("script");
configScript.src = `${process.env.BASE_URL}config.js?_=${Date.now()}`;
configScript.onload = mountApp;
configScript.onerror = mountApp;
document.head.appendChild(configScript);
