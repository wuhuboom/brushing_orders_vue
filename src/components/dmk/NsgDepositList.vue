<template>
  <section class="nsg-deposit-list">
    <div class="nsg-deposit-filters" role="tablist">
      <button v-for="tab in tabs" :key="tab.status" type="button" role="tab" :aria-selected="active === tab.status" :class="[tone(tab.status), { active: active === tab.status }]" @click="$emit('filter', active === tab.status ? '' : tab.status)"><NsgUiIcon :name="tab.icon" />{{ $t(tab.label) }}</button>
    </div>
    <div role="feed" :aria-busy="loading">
      <article v-for="item in items" :key="item.id || item.orderNumber" class="nsg-deposit-record" :class="tone(item.status)">
        <img class="nsg-deposit-record__icon" :src="String(item.status) === '3' ? '/nsg16/deposit-failed.png' : '/nsg16/deposit-received.png'" alt="" />
        <div class="nsg-deposit-record__details"><p><span>ID: </span>{{ item.orderNumber || item.id }}</p><time>{{ formatDate(item.createTime) }}</time></div>
        <span class="nsg-deposit-record__status">{{ statusLabel(item.status) ? $t(statusLabel(item.status)) : item.status || '—' }}</span>
        <strong class="nsg-deposit-record__amount">{{ $t('das.dmk.currencyUsd') }} {{ money(item.receivedAmount ?? item.amount) }}</strong>
      </article>
      <div v-if="loading" class="nsg-deposit-loading" role="status"><VanLoading size="22" />{{ $t('das.common.loading') }}</div>
      <div v-else-if="finished" class="nsg-deposit-end"><span class="nsg-deposit-end__icon" aria-hidden="true"></span><p>{{ $t('das.dmk.noMoreData') }}</p></div>
      <button v-else type="button" class="nsg-deposit-more" @click="$emit('load')">{{ $t('das.dmk.loadMore') }}</button>
    </div>
  </section>
</template>
<script setup>
import { Loading as VanLoading } from "vant";
import NsgUiIcon from "./NsgUiIcon.vue";
defineProps({ items: { type: Array, default: () => [] }, active: String, loading: Boolean, finished: Boolean, formatDate: { type: Function, required: true } });
defineEmits(["filter", "load"]);
const tabs = [{status:'1', icon:'clock', label:'das.dmk.reviewing'}, {status:'2', icon:'check', label:'das.common.success'}, {status:'3', icon:'reject', label:'das.dmk.reject'}];
const tone = status => ({ '1': 'is-reviewing', '2': 'is-success', '3': 'is-reject' }[String(status)] || '');
const statusLabel = status => ({ '1': 'das.dmk.reviewing', '2': 'das.records.completed', '3': 'das.nsg.depositFailed' }[String(status)]);
const money = value => Number(value ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
</script>
<style>
.nsg-deposit-list { width: calc(100% - 208px); margin: 64px auto 0; padding-bottom: 100px; font: 16px/1.5 "DM Sans", Arial, sans-serif; color: #cbd0e1; }
.nsg-deposit-list * { box-sizing: border-box; }
.nsg-deposit-list .is-reviewing { --status-color: #8d8cdf; --status-fill: #242b43; --status-border: #454e72; }
.nsg-deposit-list .is-success { --status-color: #41cba5; --status-fill: #123637; --status-border: #195b55; }
.nsg-deposit-list .is-reject { --status-color: #f15b72; --status-fill: #341f2d; --status-border: #68283c; }
.nsg-deposit-filters { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); overflow: hidden; margin-bottom: 42px; border: 1px solid #292e3d; border-radius: 12px; background: #101626; }
.nsg-deposit-filters button { display: flex; justify-content: center; align-items: center; gap: 8px; min-height: 50px; border: 0; color: var(--status-color); background: transparent; font: inherit; cursor: pointer; }
.nsg-deposit-filters button + button { border-left: 2px solid #292d3c; }
.nsg-deposit-filters .active { background: var(--status-fill); }
.nsg-deposit-record { display: grid; grid-template-columns: 48px minmax(0, 1fr) auto auto; align-items: center; gap: 16px; min-height: 98px; margin-bottom: 16px; padding: 22px 24px; border-radius: 14px; background: #222b40; }
.nsg-deposit-record__icon { width: 48px; height: 48px; object-fit: contain; }
.nsg-deposit-record__details { min-width: 0; color: #b7bfd5; }
.nsg-deposit-record__details p { margin: 0 0 3px; font-size: 13px; letter-spacing: .05em; overflow-wrap: anywhere; }
.nsg-deposit-record__details time { font-size: 16px; }
.nsg-deposit-record__status { padding: 3px 12px; border: 1px solid var(--status-border); border-radius: 20px; color: var(--status-color); background: var(--status-fill); font-size: 12px; letter-spacing: .06em; }
.nsg-deposit-record__amount { min-width: 104px; text-align: right; font-size: 18px; font-weight: 600; }
.nsg-deposit-end { margin-top: 78px; text-align: center; color: #697386; }
.nsg-deposit-end__icon { display: none; }
.nsg-deposit-loading { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 120px; }
.nsg-deposit-more { display: block; width: 100%; padding: 20px; border: 0; color: #9d95cd; background: transparent; cursor: pointer; }
@media (max-width: 1023px) {
  .nsg-deposit-list { width: auto; margin: 22px 20px 0; padding-bottom: 80px; font-size: 14px; }
  .nsg-deposit-filters { margin-bottom: 18px; min-height: 50px; padding: 5px; border-radius: 9px; background: #101825; }
  .nsg-deposit-filters button { min-height: 36px; padding: 6px 3px; gap: 5px; font-size: 14px; }
  .nsg-deposit-filters button + button { border-color: #1f293a; }
  .nsg-deposit-filters .active { border-radius: 5px; }
  .nsg-deposit-record { grid-template-columns: 28px minmax(0, 1fr) auto; gap: 4px 10px; min-height: 90px; padding: 12px 10px; border: 1px solid #222e41; border-radius: 8px; background: #10192b; }
  .nsg-deposit-record__icon { grid-row: 1 / 3; width: 28px; height: 28px; }
  .nsg-deposit-record__details { grid-row: 1 / 3; }
  .nsg-deposit-record__details p { font-size: 12px; letter-spacing: -.025em; line-height: 1.4; }
  .nsg-deposit-record__details p > span { display: block; }
  .nsg-deposit-record__details time { display: block; margin-top: 5px; font-size: 12px; white-space: normal; }
  .nsg-deposit-record__amount { grid-column: 3; grid-row: 1; align-self: end; min-width: 0; padding-bottom: 4px; font-size: 13px; }
  .nsg-deposit-record__status { grid-column: 3; grid-row: 2; align-self: start; text-align: center; padding: 3px 8px; border-radius: 6px; letter-spacing: 0; font-size: 11px; }
  .nsg-deposit-end { margin-top: 52px; font-size: 14px; }
  .nsg-deposit-end__icon { display: block; width: 60px; height: 60px; margin: 0 auto 14px; background: url('/nsg16/empty-state.png') center top / 113px auto no-repeat; }
}
</style>
