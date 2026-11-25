<template>
  <div class="wester-tasks">
    <div v-if="goodsList.length" ref="strip" class="wester-task-strip" @pointerdown="stopAnimation">
      <button
        v-for="(item, index) in goodsList"
        :key="item.id ?? item.orderNo ?? index"
        class="wester-task-tile"
        type="button"
        :aria-label="item.goodsName || `${$t('das.page.productDetails')} ${index + 1}`"
        :aria-pressed="selected === index"
        @click="select(index)"
      >
        <img
          v-if="imageUrl(item.coverUrl) && !failedImages.has(item.coverUrl)"
          :src="imageUrl(item.coverUrl)"
          alt=""
          draggable="false"
          @error="failedImages.add(item.coverUrl)"
        />
        <DasImagePlaceholder v-else />
      </button>
    </div>
    <slot />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { getGoodsList } from "@/api/apis";
import { resolveProfileImageUrl } from "@/utils/avatar";
import DasImagePlaceholder from "@/components/DasImagePlaceholder.vue";

const goodsList = ref([]);
const failedImages = ref(new Set());
const selected = ref(3);
const strip = ref(null);
const imageUrl = (path) => resolveProfileImageUrl(path, window.g?.VITE_API_IMG_URL || "");
let animation;
let refreshTimer;
let pageAlive = false;

const getList = async () => {
  try {
    const response = await getGoodsList();
    if (!pageAlive) return;
    const nextGoods = Array.isArray(response.data) ? response.data : [];
    const signature = (list) => JSON.stringify(list.map((item) => [
      item.id ?? item.orderNo, item.coverUrl, item.goodsName, item.price, item.rating,
    ]));
    if (signature(nextGoods) !== signature(goodsList.value)) {
      const previous = goodsList.value[selected.value];
      const preservedIndex = previous ? nextGoods.findIndex((item) =>
        String(item.id ?? item.orderNo) === String(previous.id ?? previous.orderNo),
      ) : -1;
      goodsList.value = nextGoods;
      selected.value = preservedIndex >= 0 ? preservedIndex : Math.min(selected.value, Math.max(0, nextGoods.length - 1));
    }
  } catch (_) {
  } finally {
    if (pageAlive) refreshTimer = setTimeout(getList, 10000);
  }
};

const stopAnimation = () => clearInterval(animation);
const select = (index) => {
  stopAnimation();
  selected.value = index;
};

const revealSelected = () => {
  const container = strip.value;
  const tile = container?.querySelector('[aria-pressed="true"]');
  if (!tile) return;
  const bounds = container.getBoundingClientRect();
  const target = tile.getBoundingClientRect();
  const left = container.scrollLeft + target.left - bounds.left - (container.clientWidth - target.width) / 2;
  container.scrollTo({
    left: Math.max(0, Math.min(left, container.scrollWidth - container.clientWidth)),
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });
};
watch([selected, goodsList], revealSelected, { flush: "post" });
watch(strip, (element, _previous, onCleanup) => {
  if (!element) return;
  const observer = new ResizeObserver(revealSelected);
  observer.observe(element);
  onCleanup(() => observer.disconnect());
});
onMounted(() => {
  pageAlive = true;
  getList();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  animation = setInterval(() => {
    if (goodsList.value.length > 1) selected.value = (selected.value + 1) % goodsList.value.length;
  }, 2600);
});

onBeforeUnmount(() => {
  pageAlive = false;
  clearInterval(animation);
  clearTimeout(refreshTimer);
});
</script>
