<template>
  <div
    class="task-showcase"
    :class="{ 'task-showcase--tiles': tiles, 'task-showcase--framed': framed }"
    aria-hidden="true"
  >
    <svg v-if="framed" class="task-showcase__clip" aria-hidden="true">
      <defs>
        <clipPath :id="clipId" clipPathUnits="objectBoundingBox">
          <rect
            x="0"
            y="0"
            width="0.494"
            height="0.491"
            rx="0.028"
            ry="0.031"
          />
          <rect
            x="0.506"
            y="0"
            width="0.494"
            height="0.491"
            rx="0.028"
            ry="0.031"
          />
          <rect
            x="0"
            y="0.509"
            width="0.494"
            height="0.491"
            rx="0.028"
            ry="0.031"
          />
          <rect
            x="0.506"
            y="0.509"
            width="0.494"
            height="0.491"
            rx="0.028"
            ry="0.031"
          />
        </clipPath>
      </defs>
    </svg>
    <video
      ref="video"
      :src="source"
      :style="framed ? { clipPath: `url(#${clipId})` } : undefined"
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
import { getCurrentInstance, onMounted, onBeforeUnmount, ref } from "vue";

defineProps({ tiles: Boolean, framed: Boolean });
const clipId = `task-showcase-${getCurrentInstance().uid}`;
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
/* Rounded windows reveal the page gradient without adding borders or extra players. */
.task-showcase--framed {
  position: relative;
  aspect-ratio: 1.11;
  background: transparent;
}
.task-showcase__clip {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}
</style>
