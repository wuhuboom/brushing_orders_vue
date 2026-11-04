<template>
  <div
    ref="showcase"
    class="task-showcase"
    :class="{ 'task-showcase--tiles': tiles, 'task-showcase--framed': framed }"
    aria-hidden="true"
  >
    <template v-if="framed">
      <div
        v-for="(_, index) in cardWindows"
        :key="index"
        class="task-showcase__card"
      >
        <canvas :ref="(element) => (canvases[index] = element)"></canvas>
      </div>
    </template>
    <video
      ref="video"
      :src="source"
      :class="{ 'task-showcase__decoder': framed }"
      autoplay
      loop
      muted
      playsinline
      webkit-playsinline
      preload="auto"
      disablepictureinpicture
      @loadeddata="drawFrame"
      @canplay="resume"
    ></video>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";

const props = defineProps({ tiles: Boolean, framed: Boolean });
const cardWindows = [
  [0, 0],
  [0.506, 0],
  [0, 0.509],
  [0.506, 0.509],
];
const source = import.meta.env.BASE_URL + "amplava/start-work-video.mp4";
const showcase = ref(null);
const video = ref(null);
const canvases = [];
let frameId;
let canvasObserver;
let lastTime = -1;

// One video supplies four isolated surfaces; the decoder is never displayed.
const drawFrame = () => {
  const player = video.value;
  if (!props.framed || !player?.videoWidth || player.readyState < 2) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  for (const [index, [x, y]] of cardWindows.entries()) {
    const surface = canvases[index];
    if (!surface) continue;
    const bounds = surface.getBoundingClientRect();
    const width = Math.round(bounds.width * ratio);
    const height = Math.round(bounds.height * ratio);
    if (!width || !height) continue;
    const resized = surface.width !== width || surface.height !== height;
    if (!resized && player.currentTime === lastTime) continue;
    if (resized) {
      surface.width = width;
      surface.height = height;
    }
    const sourceWidth = player.videoWidth * 0.494;
    const sourceHeight = player.videoHeight * 0.491;
    const scale = Math.max(width / sourceWidth, height / sourceHeight);
    const drawnWidth = sourceWidth * scale;
    const drawnHeight = sourceHeight * scale;
    // Cover the existing frame in one draw, without clearing a visible surface.
    surface
      .getContext("2d")
      .drawImage(
        player,
        player.videoWidth * x,
        player.videoHeight * y,
        sourceWidth,
        sourceHeight,
        (width - drawnWidth) / 2,
        (height - drawnHeight) / 2,
        drawnWidth,
        drawnHeight,
      );
  }
  lastTime = player.currentTime;
};
const nextFrame = () => {
  drawFrame();
  frameId = video.value.requestVideoFrameCallback
    ? video.value.requestVideoFrameCallback(nextFrame)
    : requestAnimationFrame(nextFrame);
};

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
  if (props.framed) {
    canvasObserver = new ResizeObserver(drawFrame);
    canvasObserver.observe(showcase.value);
    nextFrame();
  }
  resume();
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pageshow", resume);
  document.addEventListener("pointerdown", resume, { passive: true });
});
onBeforeUnmount(() => {
  canvasObserver?.disconnect();
  if (props.framed) {
    if (video.value?.cancelVideoFrameCallback) {
      video.value.cancelVideoFrameCallback(frameId);
    } else {
      cancelAnimationFrame(frameId);
    }
  }
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
.task-showcase--tiles {
  aspect-ratio: 1.14;
}
.task-showcase--tiles video {
  object-fit: fill;
}
.task-showcase--framed {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 4px;
  aspect-ratio: 1.11;
  background: transparent;
}
.task-showcase__card {
  display: block;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border: 1px solid #fff;
  border-radius: 10px;
  background: #fff;
}
.task-showcase__card canvas {
  display: block;
  width: 100%;
  height: 100%;
  filter: invert(1) hue-rotate(180deg);
}
.task-showcase--framed .task-showcase__decoder {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
</style>
