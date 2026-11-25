<template>
  <span
    class="reference-loading"
    role="status"
    :aria-label="$t('das.common.loading')"
  >
    <i></i><i></i><i></i>
  </span>
</template>

<style>
.reference-loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 6px;
  font-size: 0;
  line-height: 0;
}
.reference-loading i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #165dff;
  animation: reference-loading-opacity 1.2s linear infinite;
}
.reference-loading i:nth-child(2) {
  animation-delay: -0.4s;
}
.reference-loading i:nth-child(3) {
  animation-delay: -0.8s;
}
@keyframes reference-loading-opacity {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.15;
  }
}
</style>
