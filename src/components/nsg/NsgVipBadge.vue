<template>
  <span class="nsg-vip-badge" :style="{ backgroundImage: `url(/nsg16/vip-badge-${color}.png)` }"><b>{{ label }}</b></span>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({ label: { type: String, default: "" } });
const color = computed(() => {
  const number = Number(props.label.match(/\d+/)?.[0]);
  return number >= 1 && number <= 4 ? number : 4;
});
</script>

<style scoped>
.nsg-vip-badge { display: inline-flex; width: 81px; height: 35px; flex: 0 0 auto; align-items: center; justify-content: center; padding: 5px 4px 0 24px; background: center / contain no-repeat; vertical-align: middle; }
.nsg-vip-badge b { color: #f4e8cc; font: 500 12px/1 Arial, sans-serif; white-space: nowrap; }
</style>
