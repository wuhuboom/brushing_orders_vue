<template>
  <div
    class="task-showcase"
    :class="{ 'task-showcase--tiles': tiles, 'task-showcase--framed': framed }"
    aria-hidden="true"
  >
    <Swipe
      ref="swipe"
      class="task-showcase__swipe"
      :autoplay="3000"
      :duration="600"
      :width="204"
      :initial-swipe="centerStart + 1"
      :loop="false"
      :show-indicators="false"
      @change="onChange"
      @transitionend="onTransitionEnd"
    >
      <SwipeItem v-for="(image, index) in repeatedImages" :key="index"
        ><div class="task-showcase__slide">
          <img :src="image" alt="" draggable="false" /></div
      ></SwipeItem>
    </Swipe>
    <div class="task-showcase__indicators">
      <i
        v-for="(_, index) in images"
        :key="index"
        :class="{ active: index === active }"
      ></i>
    </div>
  </div>
</template>
<script setup>
import { onBeforeUnmount, ref } from "vue";
import { Swipe, SwipeItem } from "vant";
defineProps({ tiles: Boolean, framed: Boolean });
const swipe = ref(null);
const active = ref(1);
const images = [
  "/poetic/task-earphones.png",
  "/poetic/task-laptop.png",
  "/poetic/task-phone.png",
  "/poetic/task-camera.png",
];
const repeatedImages = Array(5).fill(images).flat();
const centerStart = images.length * 2;
let position = centerStart + 1;
let recenterTimer;

const onChange = (index) => {
  clearTimeout(recenterTimer);
  position = index;
  active.value = index % images.length;
  if (position !== centerStart + active.value)
    recenterTimer = setTimeout(recenter, 650);
};

// Keep both previews populated, then reset between identical copies offscreen.
const recenter = () => {
  clearTimeout(recenterTimer);
  const centeredPosition = centerStart + active.value;
  if (position === centeredPosition) return;
  position = centeredPosition;
  swipe.value?.swipeTo(centeredPosition, { immediate: true });
};

const onTransitionEnd = (event) => {
  if (
    event.propertyName === "transform" &&
    event.target.classList.contains("van-swipe__track")
  )
    recenter();
};

onBeforeUnmount(() => clearTimeout(recenterTimer));
</script>
