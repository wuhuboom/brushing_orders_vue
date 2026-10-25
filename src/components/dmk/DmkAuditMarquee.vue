<template>
  <div class="w-full bg-black pb-5">
    <div class="dmk-audit-marquee w-[360px] h-[70px]">
      <div class="dmk-audit-marquee__track">
        <span v-for="index in 12" :key="index" class="mx-6">
          {{ $t("das.dmk.freeAudit") }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dmk-audit-marquee {
  overflow: hidden;
  color: #000;
  background: linear-gradient(
    31deg,
    rgb(218, 255, 69) 10.26%,
    rgb(150, 255, 100) 53.53%,
    rgb(218, 255, 69)
  );
}

.dmk-audit-marquee__track {
  width: max-content;
  height: 100%;
  display: flex;
  align-items: center;
  animation: dmk-audit-scroll 6.14s linear infinite;
  will-change: transform;
}

.dmk-audit-marquee__track span {
  flex: 0 0 auto;
  white-space: nowrap;
  font-size: 30px;
  font-weight: 700;
  line-height: 70px;
}

.dmk-audit-marquee:hover .dmk-audit-marquee__track {
  animation-play-state: paused;
}

@keyframes dmk-audit-scroll {
  to {
    transform: translateX(-8.333333%);
  }
}
</style>
