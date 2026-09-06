<template>
  <div class="dmk-credit-runner nsg-credit-road" :class="{ 'dmk-credit-runner--compact': compact }"
    role="progressbar" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="normalizedPercent"
    :aria-label="`Credit score ${normalizedPercent}%`">
    <div class="nsg-credit-road__track">
      <div class="nsg-credit-road__fill" :style="{ width: `${normalizedPercent}%` }"></div>
    </div>
    <div v-if="normalizedPercent > 0" class="nsg-credit-road__route" :style="{ width: `${normalizedPercent}%` }" aria-hidden="true">
      <span class="nsg-credit-road__car">
        <span class="nsg-credit-road__exhaust"><i></i><i></i><i></i></span>
        <svg viewBox="0 0 48 25" fill="none">
          <path d="m11 12 5-8h15l7 8 6 2v6H4v-6l7-2Z" fill="#63cfff" stroke="#c1eeff" stroke-width="1.2" stroke-linejoin="round"/>
          <path d="m16 11 3-5h10l5 5H16Z" fill="#182344"/>
          <path d="M26 6v5M7 16h4m29 0h3" stroke="#e5f9ff" stroke-width="2"/>
          <path d="M17 16h13" stroke="#8970ff" stroke-width="2" stroke-linecap="round"/>
          <circle cx="13" cy="20" r="4.5" fill="#0b1120" stroke="#a6b7df" stroke-width="1.5"/>
          <circle cx="36" cy="20" r="4.5" fill="#0b1120" stroke="#a6b7df" stroke-width="1.5"/>
          <circle cx="13" cy="20" r="1.5" fill="#70d9ff"/><circle cx="36" cy="20" r="1.5" fill="#70d9ff"/>
        </svg>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  percentage: { type: Number, default: 0 },
  compact: { type: Boolean, default: false },
});
const normalizedPercent = computed(() => {
  const value = Number(props.percentage);
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
});
</script>

<style scoped>
.dmk-credit-runner.nsg-credit-road { position: relative; width: 100%; height: 10px; margin-top: 18px; padding: 0; overflow: visible; }
.nsg-credit-road__track { position: absolute; inset: 4px 0 auto; height: 5px; border-radius: 99px; background: #252d45; }
.nsg-credit-road__fill { height: 100%; border-radius: inherit; background: linear-gradient(90deg, #28d6e8, #a05bff); box-shadow: 0 0 8px #4fbbdd50; }
.nsg-credit-road__route { position: absolute; left: 0; bottom: 5px; height: 25px; overflow: hidden; }
.nsg-credit-road__car { position: absolute; left: 0; bottom: 0; width: 44px; height: 25px; animation: nsg-credit-drive 6s linear infinite; }
.nsg-credit-road__car > svg { position: relative; width: 44px; height: 25px; display: block; filter: drop-shadow(0 0 4px #58cfff40); }
.nsg-credit-road__exhaust { position: absolute; left: 3px; bottom: 5px; }
.nsg-credit-road__exhaust i { position: absolute; width: 5px; height: 5px; border-radius: 50%; background: #afc9e7; animation: nsg-credit-exhaust .9s ease-out infinite; }
.nsg-credit-road__exhaust i:nth-child(2) { animation-delay: -.3s; }
.nsg-credit-road__exhaust i:nth-child(3) { animation-delay: -.6s; }
@keyframes nsg-credit-drive {
  0% { left: 0; transform: translateX(-44px); }
  92%, 100% { left: 100%; transform: translateX(-44px); }
}
@keyframes nsg-credit-exhaust {
  from { opacity: .65; transform: translate(0, 0) scale(.6); }
  to { opacity: 0; transform: translate(-27px, -9px) scale(2.2); }
}
@media (prefers-reduced-motion: reduce) {
  .nsg-credit-road__car { animation: none; left: 100%; transform: translateX(-44px); }
  .nsg-credit-road__exhaust { display: none; }
}
</style>
