<template>
  <span class="contact-route-proxy" aria-hidden="true"></span>
</template>
<script setup>
import { useRouter } from "vue-router";
import { safePush } from "@/utils/navigation";
const router = useRouter();
const open = () => safePush(router, "/contact");
const close = () => undefined;
defineExpose({ open, close });
</script>
<style scoped>
.contact-route-proxy {
  display: none;
}
</style>
