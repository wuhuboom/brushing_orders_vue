<template>
  <DmkPcAbout />
  <DmkH5About />
</template>
<script setup>
import { onMounted, ref } from "vue";
import { getContentConfig } from "@/api/apis";
import DmkPcAbout from "@/components/dmkPc/DmkPcAbout.vue";
import DmkH5About from "@/components/dmkH5/DmkH5About.vue";
const content = ref(""),
  loading = ref(true);
onMounted(async () => {
  try {
    content.value = (await getContentConfig()).data?.aboutContent || "";
  } finally {
    loading.value = false;
  }
});
</script>
