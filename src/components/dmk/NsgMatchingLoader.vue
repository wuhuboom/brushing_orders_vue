<template>
  <section class="nsg-matching-loader" role="status" :aria-label="$t('das.common.loading')">
    <header><img src="/nsg16/logo.png" alt="NSG" /><span>{{ $t("das.nsg.autoMatching") }}</span></header>
    <div class="nsg-matching-loader__visual" aria-hidden="true">
      <span class="nsg-matching-loader__tile is-left"><img src="/nsg16/product-pool-icon.png" alt="" /></span>
      <span class="nsg-matching-loader__tile is-center"><img src="/nsg16/product-pool-icon.png" alt="" /></span>
      <span class="nsg-matching-loader__tile is-right"><img src="/nsg16/product-pool-icon.png" alt="" /></span>
      <i class="nsg-matching-loader__scan"></i>
    </div>
    <h2>{{ $t("das.common.loading") }}</h2>
    <p>{{ $t("das.nsg.productPoolHint") }}</p>
    <div class="nsg-matching-loader__track" aria-hidden="true"><i></i></div>
  </section>
</template>
<style>
.van-dialog.start-loading-dialog { width: min(390px, calc(100vw - 40px)) !important; padding: 0; overflow: hidden; border: 1px solid #3d4b70; border-radius: 24px; background: #10192d; box-shadow: 0 30px 100px #0009; }
</style>
<style scoped>
.nsg-matching-loader { position: relative; overflow: hidden; padding: 24px 28px 28px; background: radial-gradient(ellipse at 50% 38%, #384c8155, transparent 70%), #10192d; color: #eff4ff; font-family: "DM Sans", Arial, sans-serif; text-align: center; }
.nsg-matching-loader header { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.nsg-matching-loader header > img { width: 64px; height: 28px; object-fit: contain; }
.nsg-matching-loader header > span { color: #95a9c9; font-size: 9px; line-height: 1.4; letter-spacing: .1em; }
.nsg-matching-loader__visual { position: relative; display: flex; align-items: center; justify-content: center; height: 142px; margin: 12px 0 0; perspective: 500px; }
.nsg-matching-loader__tile { position: relative; display: grid; place-items: center; width: 70px; height: 86px; border: 1px solid #6073a8; border-radius: 16px; background: linear-gradient(145deg, #2b4365, #20223e); box-shadow: 0 12px 24px #050b224d; animation: nsg-match-float 2s ease-in-out infinite; }
.nsg-matching-loader__tile img { width: 44px; height: 44px; object-fit: contain; }
.nsg-matching-loader__tile.is-left { margin-right: -12px; transform: rotate(-14deg) scale(.85); opacity: .55; animation-delay: -.4s; }
.nsg-matching-loader__tile.is-center { z-index: 1; border-color: #84bbf8; }
.nsg-matching-loader__tile.is-right { margin-left: -12px; transform: rotate(14deg) scale(.85); opacity: .55; animation-delay: -.8s; }
.nsg-matching-loader__scan { position: absolute; z-index: 2; top: 20px; left: 18%; right: 18%; height: 1px; background: linear-gradient(90deg, transparent, #86e9ff, transparent); box-shadow: 0 0 12px #6bddff; animation: nsg-match-scan 2s ease-in-out infinite; }
.nsg-matching-loader h2 { margin: 4px 0 8px; font-size: 22px; font-weight: 600; letter-spacing: -.02em; }
.nsg-matching-loader p { max-width: 260px; margin: 0 auto 26px; color: #96a9c7; font-size: 13px; line-height: 1.6; }
.nsg-matching-loader__track { height: 4px; overflow: hidden; border-radius: 8px; background: #27324f; }
.nsg-matching-loader__track i { display: block; width: 40%; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #4bc6f2, #a264f2); animation: nsg-match-track 1.6s ease-in-out infinite; }
@keyframes nsg-match-float { 50% { translate: 0 -6px; } }
@keyframes nsg-match-scan { 0%, 100% { transform: translateY(0); opacity: 0; } 20%, 80% { opacity: 1; } 90% { transform: translateY(96px); opacity: 0; } }
@keyframes nsg-match-track { from { transform: translateX(-105%); } to { transform: translateX(355%); } }
@media (prefers-reduced-motion: reduce) {
  .nsg-matching-loader__tile, .nsg-matching-loader__scan, .nsg-matching-loader__track i { animation: none; }
  .nsg-matching-loader__scan { display: none; }
  .nsg-matching-loader__track i { width: 100%; opacity: .6; }
}
</style>
