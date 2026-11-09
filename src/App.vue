<template>
  <div id="app">
    <SiteHeader v-if="$route.name !== 'home'" />
    <router-view />
    <SiteFooter v-if="$route.name !== 'home'" />
  </div>
</template>

<script>
import SiteHeader from "@/components/SiteHeader.vue";
import SiteFooter from "@/components/SiteFooter.vue";

export default {
  name: "App",
  components: { SiteHeader, SiteFooter },
};
</script>
