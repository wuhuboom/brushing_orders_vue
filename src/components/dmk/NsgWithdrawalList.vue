<template>
  <div class="nsg-withdraw-list">
    <div class="nsg-withdraw-filter" role="tablist">
      <button v-for="tab in tabs" :key="tab.status" type="button" role="tab" :aria-selected="active === tab.status" :class="[tone(tab.status), { active: active === tab.status }]" @click="$emit('filter', tab.status)">
        <NsgUiIcon :name="icon(tab.status)" />{{ $t(tab.labelKey) }}
      </button>
    </div>
    <div class="nsg-withdraw-feed" role="feed" :aria-busy="loading">
      <article v-for="item in items" :key="item.id || item.orderNumber" class="nsg-withdraw-record" :class="tone(item.status)">
        <header>
          <img class="nsg-withdraw-record__icon" :src="statusImage(item.status)" alt="" />
          <strong>{{ item.orderNumber || item.id || '—' }}</strong>
          <time><NsgUiIcon name="calendar" /><span class="nsg-withdraw-date--pc">{{ formatDate(item.createTime) }}</span><span class="nsg-withdraw-date--mobile">{{ shortDate(item.createTime) }}</span></time>
        </header>
        <dl>
          <div v-for="row in rows(item)" :key="row.key">
            <dt>{{ row.label }}</dt>
            <dd><span :class="{ 'nsg-withdraw-status': row.key === 'status' }">{{ row.value }}<template v-if="row.key === 'withdrawAmount' || row.key === 'amountReceived'">&nbsp;{{ $t('das.dmk.currencyUsd') }}</template></span><NsgCopyButton v-if="row.key === 'walletAddress'" :value="row.value" /></dd>
          </div>
        </dl>
      </article>
      <div v-if="loading" class="nsg-withdraw-loading" role="status"><VanLoading size="22" />{{ $t('das.common.loading') }}</div>
      <div v-else-if="finished" class="nsg-withdraw-end" :class="{ 'has-records': items.length }"><img src="/nsg16/withdraw-empty.png" alt="" /><p>{{ $t('das.dmk.noMoreData') }}</p></div>
      <button v-else type="button" class="nsg-withdraw-more" @click="$emit('load')">{{ $t('das.dmk.loadMore') }}</button>
    </div>
  </div>
</template>
<script setup>
import NsgUiIcon from "./NsgUiIcon.vue";
import { Loading as VanLoading } from "vant";
import NsgCopyButton from "./NsgCopyButton.vue";
const props = defineProps({ items: { type: Array, default: () => [] }, tabs: { type: Array, required: true }, active: String, rows: { type: Function, required: true }, formatDate: { type: Function, required: true }, loading: Boolean, finished: Boolean });
defineEmits(["filter", "load"]);
const tone = (status) => String(status) === "2" ? "is-success" : String(status) === "3" ? "is-reject" : "is-reviewing";
const icon = (status) => String(status) === "2" ? "check" : String(status) === "3" ? "reject" : "clock";
const statusImage = (status) => `/nsg16/status-${String(status) === "2" ? "success" : String(status) === "3" ? "rejected" : "reviewing"}.png`;
const shortDate = (value) => props.formatDate(value).replace(/^\d{4}-/, "").slice(0, 11);
</script>
<style>
.nsg-withdraw-list { box-sizing: border-box; width: calc(100% - 208px); margin: 64px auto 0; padding-bottom: 112px; font: 15px/1.5 "DM Sans", Arial, sans-serif; color: #cbd0e1; }
.nsg-withdraw-list * { box-sizing: border-box; }
.nsg-withdraw-list .is-reviewing { --status-color: #7c79ef; --status-fill: #232844; --status-border: #454977; }
.nsg-withdraw-list .is-success { --status-color: #00c59d; --status-fill: #123537; --status-border: #1e6159; }
.nsg-withdraw-list .is-reject { --status-color: #fa506d; --status-fill: #321e2d; --status-border: #763044; }
.nsg-withdraw-filter { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-bottom: 32px; overflow: hidden; border: 1px solid #282d3c; border-radius: 12px; background: #0e1423; }
.nsg-withdraw-filter button { min-width: 0; min-height: 50px; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 8px; border: 0; color: var(--status-color); background: transparent; font: inherit; cursor: pointer; }
.nsg-withdraw-filter button + button { border-left: 2px solid #292d3c; }
.nsg-withdraw-filter button.active { background: var(--status-fill); }
.nsg-withdraw-filter .nsg-ui-icon { font-size: 20px; }
.nsg-withdraw-record { margin: 0 0 24px; overflow: hidden; border: 1px solid #293045; border-radius: 12px; background: #0b1224; }
.nsg-withdraw-record > header { display: grid; grid-template-columns: 26px minmax(0, 1fr) auto; align-items: center; gap: 12px; padding: 16px 24px; border-bottom: 1px solid #30364a; background: #141b2f; }
.nsg-withdraw-record__icon { display: block; width: 26px; height: 26px; object-fit: contain; }
.nsg-withdraw-record > header strong { min-width: 0; overflow-wrap: anywhere; font-size: 16px; font-weight: 600; }
.nsg-withdraw-record time { display: flex; align-items: center; gap: 8px; color: #949aaf; font-size: 13px; white-space: nowrap; }
.nsg-withdraw-date--mobile { display: none; }
.nsg-withdraw-record dl { margin: 0; padding: 18px 48px 20px; }
.nsg-withdraw-record dl > div { display: grid; grid-template-columns: 32% minmax(0, 1fr); align-items: center; gap: 18px; min-height: 32px; }
.nsg-withdraw-record dt { color: #949caf; }
.nsg-withdraw-record dd { display: flex; align-items: center; gap: 8px; min-width: 0; margin: 0; overflow-wrap: anywhere; }
.nsg-withdraw-record dd::before { content: ":"; color: #949caf; }
.nsg-withdraw-record dd > span { min-width: 0; }
.nsg-withdraw-record dd > .nsg-copy-button { margin-left: 4px; }
.nsg-withdraw-status { color: var(--status-color); }
.nsg-withdraw-end { display: flex; min-height: 196px; flex-direction: column; align-items: center; justify-content: center; border: 1px solid #293045; border-radius: 12px; background: #0b1224; color: #949caf; }
.nsg-withdraw-end > img { display: block; width: 64px; height: 64px; object-fit: contain; }
.nsg-withdraw-end p { margin: 16px 0 0; }
.nsg-withdraw-loading { display: flex; justify-content: center; align-items: center; min-height: 120px; gap: 10px; color: #949caf; }
.nsg-withdraw-more { width: 100%; padding: 16px; border: 0; background: none; color: #aaa0f8; font: inherit; cursor: pointer; }
@media (max-width: 1023px) {
  .nsg-withdraw-list { width: auto; margin: 22px 20px 0; padding-bottom: 32px; font-size: 14px; }
  .nsg-withdraw-filter { min-height: 50px; margin-bottom: 18px; border-color: #283341; background: #101825; border-radius: 10px; padding: 5px 0; }
  .nsg-withdraw-filter button { padding: 8px 4px; min-height: 36px; gap: 5px; }
  .nsg-withdraw-filter button + button { border-color: #202938; }
  .nsg-withdraw-filter button.active { background: transparent; font-weight: 600; }
  .nsg-withdraw-filter .nsg-ui-icon { font-size: 18px; }
  .nsg-withdraw-record { margin-bottom: 16px; padding: 16px; border-color: #243045; border-radius: 10px; background: #111a2d; }
  .nsg-withdraw-record > header { grid-template-columns: 26px minmax(0, 1fr) auto; padding: 0 0 12px; gap: 8px; background: transparent; border-bottom: 2px solid #222c40; }
  .nsg-withdraw-record__icon { width: 26px; height: 26px; }
  .nsg-withdraw-record > header strong { font-size: 12px; letter-spacing: -.025em; }
  .nsg-withdraw-record time { gap: 4px; font-size: 11px; }
  .nsg-withdraw-date--pc { display: none; }
  .nsg-withdraw-date--mobile { display: inline; }
  .nsg-withdraw-record dl { padding: 10px 0 0; }
  .nsg-withdraw-record dl > div { grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr); min-height: 34px; gap: 10px; }
  .nsg-withdraw-record dd { justify-content: flex-end; text-align: right; gap: 4px; font-size: 13px; }
  .nsg-withdraw-record dd::before { display: none; }
  .nsg-withdraw-record dd > .nsg-copy-button { width: 22px; height: 26px; margin: 0; padding: 2px; font-size: 17px; }
  .nsg-withdraw-status { display: inline-block; margin: 4px 0; padding: 2px 11px; border: 1px solid var(--status-border); border-radius: 7px; background: var(--status-fill); font-weight: 600; }
  .nsg-withdraw-end.has-records { display: none; }
}
@media (max-width: 380px) {
  .nsg-withdraw-record { padding: 12px; }
  .nsg-withdraw-record > header { gap: 6px; }
  .nsg-withdraw-record > header strong { font-size: 10px; }
  .nsg-withdraw-record time { font-size: 10px; }
  .nsg-withdraw-record dt, .nsg-withdraw-record dd { font-size: 12px; }
}
</style>
