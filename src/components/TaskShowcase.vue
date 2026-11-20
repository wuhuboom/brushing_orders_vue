<template>
  <div class="wester-tasks">
    <template v-for="(tile, index) in tiles" :key="tile || 'action'">
      <button
        v-if="tile"
        class="wester-task-tile"
        type="button"
        :aria-label="`${$t('das.page.productDetails')} ${index + 1}`"
        :aria-pressed="selected === index"
        @click="select(index)"
      >
        <img :src="`/westermedia/tile-${tile}.png`" alt="" draggable="false" />
      </button>
      <slot v-else />
    </template>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const tiles = ["camera", "objects", "laptop", "drone", null, "lenses", "watch", "headphones", "speaker"];
const selected = ref(3);
let animation;

const select = (index) => {
  clearInterval(animation);
  selected.value = index;
};

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  animation = setInterval(() => {
    const next = (selected.value + 1) % tiles.length;
    selected.value = tiles[next] ? next : next + 1;
  }, 2600);
});

onBeforeUnmount(() => clearInterval(animation));
</script>
