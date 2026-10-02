<template>
  <div
    class="task-showcase"
    :class="{ 'task-showcase--tiles': tiles }"
    aria-hidden="true"
  >
    <video
      ref="video"
      :src="source"
      autoplay
      loop
      muted
      playsinline
      webkit-playsinline
      preload="auto"
      disablepictureinpicture
      @canplay="resume"
    ></video>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";

defineProps({ tiles: Boolean });
const source = import.meta.env.BASE_URL + "amplava/start-work-video.mp4";
const video = ref(null);

const resume = () => {
  const player = video.value;
  if (document.hidden || !player?.paused) return;
  player.defaultMuted = true;
  player.muted = true;
  // Some mobile browsers require another attempt after loading or a user gesture.
  player.play()?.catch(() => {});
};
const onVisibilityChange = () => {
  if (document.hidden) video.value?.pause();
  else resume();
};

onMounted(() => {
  resume();
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pageshow", resume);
  document.addEventListener("pointerdown", resume, { passive: true });
});
onBeforeUnmount(() => {
  document.removeEventListener("visibilitychange", onVisibilityChange);
  window.removeEventListener("pageshow", resume);
  document.removeEventListener("pointerdown", resume);
  video.value?.pause();
});
</script>

<style scoped>
.task-showcase {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #fff;
}
video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: invert(1) hue-rotate(180deg);
}
/* Keep the card layout's compact height without splitting the moving picture. */
.task-showcase--tiles {
  aspect-ratio: 1.14;
}
.task-showcase--tiles video {
  object-fit: fill;
}
</style>
