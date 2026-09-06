<template>
  <DmkH5Layout class="dmk-mobile-current">
    <NsgMarketingContent page="about" @start-work="startWork" />
  </DmkH5Layout>
</template>
<script setup>
import { useRouter } from "vue-router";
import NsgMarketingContent from "@/components/dmk/NsgMarketingContent.vue";
import { useUserStore } from "@/store/modules/user";
import { safePush } from "@/utils/navigation";
import DmkH5Layout from "./DmkH5Layout.vue";
const router = useRouter();
const store = useUserStore();
const startWork = () => safePush(router, store.token ? "/starting" : "/account/login");
</script>
