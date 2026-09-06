<template>
  <DmkPcLayout>
    <NsgMarketingContent page="about" @start-work="startWork" />
  </DmkPcLayout>
</template>
<script setup>
import { useRouter } from "vue-router";
import NsgMarketingContent from "@/components/dmk/NsgMarketingContent.vue";
import { useUserStore } from "@/store/modules/user";
import DmkPcLayout from "./DmkPcLayout.vue";
import { safePush } from "@/utils/navigation";
const router = useRouter();
const store = useUserStore();
const startWork = () =>
  safePush(router, store.token ? "/starting" : "/account/login");
</script>
