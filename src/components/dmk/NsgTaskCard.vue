<template>
  <div class="nsg-task-card" :aria-busy="busy">
    <section class="nsg-task-hero">
      <div class="nsg-task-heading">
        <p class="nsg-task-eyebrow">{{ $t('das.dmk.ratingSubmission') }}</p>
        <h1>{{ success ? $t('das.started.created') : $t('das.dmk.productDetailsSubmission') }}</h1>
        <p v-if="success" class="nsg-task-description">{{ $t('das.records.submitted') }}</p>
      </div>
      <div class="nsg-task-product">
        <div class="nsg-task-stage">
          <van-image v-if="details.cover" :src="details.cover" :alt="details.name || ''" fit="contain" />
          <span v-else class="nsg-task-no-image" aria-hidden="true">◇</span>
        </div>
        <h2>{{ details.name || '—' }}</h2>
      </div>
    </section>
    <div class="nsg-task-body">
      <section class="nsg-task-summary">
        <div><p>{{ $t('das.dmk.totalAmount') }}</p><strong><span>{{ $t('das.dmk.currencyUsd') }}</span> {{ details.totalAmount }}</strong></div>
        <div><p>{{ $t('das.dmk.profit') }}</p><strong><span>{{ $t('das.dmk.currencyUsd') }}</span> {{ details.profit }}</strong></div>
        <div><p>{{ $t('das.dmk.commission') }}</p><strong>{{ details.commissionRate }}</strong></div>
      </section>
      <dl class="nsg-task-meta">
        <div><dt>{{ $t('das.dmk.createdAt') }}</dt><dd>{{ details.createdAt }}</dd></div>
        <div><dt>{{ $t('das.dmk.taskCode') }}</dt><dd class="nsg-task-code"><span>{{ details.code || '—' }}</span><NsgCopyButton :value="details.code" /></dd></div>
        <div><dt>{{ $t('das.dmk.rating') }}</dt><dd class="nsg-task-rating"><VanRate :model-value="rating" :size="20" color="#7d71ff" void-color="#393b65" :gutter="2" readonly /><span>({{ rating.toFixed(1) }} / 5.0)</span></dd></div>
      </dl>
      <button class="nsg-task-action" type="button" :disabled="disabled || busy" @click="$emit('action')">{{ success ? $t('das.auth.continue') : $t('das.dmk.submitOrder') }}</button>
    </div>
    <div v-if="busy" class="nsg-task-loading" role="status" :aria-label="$t('das.common.loading')"><slot name="loading"><VanLoading color="#8272ff" /></slot></div>
  </div>
</template>
<script setup>
import { Rate as VanRate, Loading as VanLoading } from "vant";
import NsgCopyButton from "./NsgCopyButton.vue";
defineProps({ details: { type: Object, required: true }, rating: { type: Number, default: 5 }, success: Boolean, disabled: Boolean, busy: Boolean });
defineEmits(["action"]);
</script>
<style>
html .nsg-task-dialog.van-popup {
  box-sizing: border-box;
  top: 50%;
  left: 50%;
  bottom: auto;
  width: min(770px, calc(100vw - 40px));
  max-height: calc(100dvh - 40px);
  margin: 0;
  transform: translate(-50%, -50%);
  overflow: auto;
  border: 1px solid #3b3d79;
  border-radius: 30px !important;
  background: #02031e;
  color: #d3d7ed;
  --van-popup-close-icon-color: #a3a6c5;
  --van-popup-close-icon-size: 22px;
}
.nsg-task-card { position: relative; font-family: "DM Sans", Arial, sans-serif; }
.nsg-task-card * { box-sizing: border-box; }
.nsg-task-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  align-items: center;
  padding: 60px 36px 20px 64px;
  background: url('/nsg16/task-card-bg.png') center -56px / calc(100% + 4px) auto no-repeat;
}
.nsg-task-eyebrow { margin: 0 0 20px; color: #dce0f3; font-size: 14px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; }
.nsg-task-heading h1 { margin: 0; background: linear-gradient(105deg, #49bbf0, #8c2dd9); background-clip: text; color: transparent; font-size: 46px; font-weight: 700; line-height: 1.05; overflow-wrap: anywhere; }
.nsg-task-description { margin: 28px 0 0; color: #c4c5d9; font-size: 18px; line-height: 1.55; }
.nsg-task-product { min-width: 0; text-align: center; }
.nsg-task-stage { position: relative; width: 240px; max-width: 100%; aspect-ratio: 1; margin: 0 auto; background: url('/nsg16/task-stage.png') center / contain no-repeat; }
.nsg-task-stage .van-image { position: absolute; inset: 10% 12% 18%; }
.nsg-task-stage img { width: 100%; height: 100%; object-fit: contain; }
.nsg-task-stage .van-image__error, .nsg-task-stage .van-image__loading { background: transparent; color: #c4c8f3; }
.nsg-task-no-image { position: absolute; inset: 0; display: grid; place-items: center; color: #97a6ee; font-size: 70px; }
.nsg-task-product h2 { position: relative; margin: -25px 0 0; padding: 21px 16px; border: 1px solid #669be4; border-radius: 16px; background: linear-gradient(105deg, #051039, #2c21bf); color: #dce1fa; font-size: 17px; font-weight: 600; line-height: 1.4; overflow-wrap: anywhere; }
.nsg-task-body { padding: 0 32px 32px; }
.nsg-task-summary { display: grid; grid-template-columns: 1.15fr 1fr 1fr; gap: 0; padding: 26px 0; border: 1px solid #1c2145; border-radius: 18px; background: #0b1030; }
.nsg-task-summary > div { min-width: 0; padding: 0 24px; }
.nsg-task-summary > div + div { border-left: 1px solid #303651; }
.nsg-task-summary p { margin: 0 0 9px; color: #8996b9; font-size: 14px; line-height: 1.4; }
.nsg-task-summary strong { color: #f0f1fb; font-size: 22px; font-weight: 600; line-height: 1.3; overflow-wrap: anywhere; }
.nsg-task-meta { margin: 20px 0; padding: 16px 32px; border: 1px solid #1c2145; border-radius: 18px; background: #0b1030; }
.nsg-task-meta > div { display: flex; justify-content: space-between; align-items: center; gap: 20px; min-height: 66px; }
.nsg-task-meta > div + div { border-top: 1px solid #1b2342; }
.nsg-task-meta dt { color: #8996b9; font-size: 16px; }
.nsg-task-meta dd { min-width: 0; margin: 0; color: #d3d7ed; font-size: 16px; text-align: right; overflow-wrap: anywhere; }
.nsg-task-rating { display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 12px; }
.nsg-task-rating > span { color: #8996b9; }
.nsg-task-code { display: flex; align-items: center; justify-content: flex-end; gap: 10px; }
.nsg-task-code > span { min-width: 0; overflow-wrap: anywhere; }
.nsg-task-action { display: block; width: min(100%, 430px); min-height: 65px; margin: 24px auto 0; padding: 12px 24px; border: 0; border-radius: 999px; background: url('/nsg16/task-action-bg.png') center / 100% 100% no-repeat; box-shadow: none; color: #fff; font: 600 18px/1.4 "DM Sans", Arial, sans-serif; cursor: pointer; }
.nsg-task-action:disabled { opacity: .5; cursor: not-allowed; }
.nsg-task-loading { position: absolute; z-index: 5; inset: 0; display: grid; place-items: center; background: #02031ebd; }
.nsg-task-loading img { width: 128px; height: auto; }
@media (max-width: 1023px) {
  html .nsg-task-dialog.van-popup { width: calc(100vw - 36px); max-height: calc(100dvh - 32px); border-radius: 18px !important; }
  .nsg-task-hero { display: block; padding: 30px 20px 10px; background-position: center -26px; }
  .nsg-task-eyebrow { margin: 0 0 24px; color: #12cce6; font-size: 12px; text-align: left; }
  .nsg-task-eyebrow::before { content: ''; display: inline-block; width: 6px; height: 6px; margin-right: 6px; border-radius: 2px; background: currentColor; }
  .nsg-task-heading h1 { font-size: clamp(25px, 6.7vw, 40px); line-height: 1.15; text-align: center; }
  .nsg-task-description { margin: 14px 0; font-size: 14px; text-align: center; }
  .nsg-task-product { margin-top: 16px; }
  .nsg-task-stage { width: 142px; }
  .nsg-task-product h2 { width: 82%; margin: 10px auto 0; padding: 8px 12px; border-radius: 9px; font-size: 14px; }
  .nsg-task-body { padding: 0 20px 24px; }
  .nsg-task-summary { padding: 12px 0; border-radius: 12px; grid-template-columns: 1.15fr 1fr 1fr; }
  .nsg-task-summary > div { padding: 0 10px; }
  .nsg-task-summary p { margin-bottom: 6px; font-size: 10px; text-transform: uppercase; }
  .nsg-task-summary strong { font-size: 13px; }
  .nsg-task-summary strong span { font-size: 11px; color: #09cee8; }
  .nsg-task-summary > div:nth-child(2) strong, .nsg-task-summary > div:nth-child(2) strong span { color: #00cba0; }
  .nsg-task-summary > div:nth-child(3) strong { color: #c8a2ef; }
  .nsg-task-meta { margin: 14px 0 0; padding: 8px 0 0; border: 0; border-top: 2px solid #242a40; border-radius: 0; background: transparent; }
  .nsg-task-meta > div { gap: 10px; min-height: 32px; }
  .nsg-task-meta > div + div { border: 0; }
  .nsg-task-meta dt, .nsg-task-meta dd { font-size: 12px; }
  .nsg-task-rating { gap: 6px; }
  .nsg-task-rating .van-rate { --van-rate-icon-size: 15px !important; }
  .nsg-task-action { min-height: 45px; margin-top: 20px; padding: 10px; font-size: 14px; text-transform: uppercase; }
}
</style>
