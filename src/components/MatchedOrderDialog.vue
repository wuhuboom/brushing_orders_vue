<template>
  <div>
    <van-dialog
      :show="show"
      @update:show="$emit('update:show', $event)"
      class="matched-dialog"
      closeable
      :show-confirm-button="false"
      :aria-label="$t('start.matched.title')"
    >
      <div class="matched-content">
        <h2 class="matched-title">{{ $t('start.matched.title') }}</h2>
        <div class="matched-product">
          <div class="matched-product-details">
            <van-image
              class="matched-product-image"
              fit="contain"
              :src="imageBaseURL + order.coverUrl"
              :alt="order.goodsName"
            />
            <div class="matched-product-name">
              {{ order.goodsName }}
            </div>
            <span class="matched-quantity">x1</span>
          </div>
          <div class="matched-created">
            <span>{{ $t("创建时间") }}</span>
            <span>{{ formatWithTimezone(order.createTime, userStore.zoneActive.tzName) }}</span>
          </div>
        </div>
        <div class="matched-summary">
          <div class="matched-order-id">{{ $t('start.matched.orderId') }} : {{ order.orderNo }}</div>
          <div class="matched-total">{{ $t('start.matched.totalPrice') }} : {{ order.price }} {{ $t("美元") }}</div>
        </div>
        <div class="matched-information">
          <h3>{{ $t('start.matched.information') }}</h3>
          <div class="matched-profit">{{ $t('start.matched.profit') }}: {{ order.commission }} {{ $t("美元") }}</div>
        </div>
        <van-button class="matched-submit" :loading="submitting" :disabled="submitting" @click.prevent="$emit('submit')">
          {{ $t('start.matched.complete') }}
        </van-button>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/modules/user';
import { formatWithTimezone } from '@/util/utils';

defineProps({
  show: Boolean,
  order: { type: Object, required: true },
  submitting: Boolean,
});
defineEmits(['update:show', 'submit']);

const userStore = useUserStore();
const imageBaseURL = window.g.VITE_API_IMG_URL;
</script>

<style scoped>
:deep(.matched-dialog) {
  top: 50%;
  width: calc(100% - 32px);
  max-width: 420px;
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  border: 1px solid #eedddd;
  border-radius: 32px;
  background: #fff;
  color: #2f1d1d;
  font-family: Arial, "PingFang SC", sans-serif;
  box-shadow: 0 20px 48px rgba(75, 18, 18, 0.24);
}
.matched-content {
  padding: 30px 24px 28px;
  text-align: left;
}
.matched-title {
  margin: 0 0 26px;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.8px;
}
.matched-product {
  padding: 18px 16px 14px;
  border: 1px solid #eedddd;
  border-radius: 18px;
  background: #fbf6f6;
  box-shadow: 0 2px 3px rgba(85, 32, 32, 0.05);
}
.matched-product-details {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.matched-product-image {
  flex: 0 0 64px;
  width: 64px;
  height: 64px;
  overflow: hidden;
  border: 1px solid #ddc7c7;
  border-radius: 12px;
  background: #fff;
}
.matched-product-name {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
}
.matched-quantity {
  flex-shrink: 0;
  padding: 4px 8px;
  border: 1px solid #9af0cb;
  border-radius: 9px;
  background: #edfcf5;
  color: #009e73;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
}
.matched-created {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 8px;
  margin-top: 22px;
  padding-top: 10px;
  border-top: 1px dotted #dfc3c3;
  color: #927d7d;
  font-size: 10px;
  line-height: 1.4;
}
.matched-summary {
  margin-top: 26px;
  padding-bottom: 22px;
  border-bottom: 1px solid #e8d0d0;
  overflow-wrap: anywhere;
}
.matched-order-id {
  color: #806b6b;
  font-size: 14px;
  line-height: 1.5;
}
.matched-total {
  margin-top: 10px;
  font-size: 23px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.5px;
}
.matched-information {
  margin-top: 26px;
}
.matched-information h3 {
  margin: 0;
  font-size: 21px;
  font-weight: 600;
  line-height: 1.35;
}
.matched-profit {
  margin-top: 12px;
  color: #009e73;
  font-size: 19px;
  font-weight: 600;
  line-height: 1.4;
  overflow-wrap: anywhere;
}
.matched-submit {
  width: 100%;
  height: auto;
  min-height: 56px;
  margin-top: 32px;
  padding: 12px;
  border: 0;
  border-radius: 18px;
  background: linear-gradient(110deg, #9d4849, #742e2f);
  color: #fff;
  box-shadow: 0 12px 20px rgba(116, 46, 47, 0.22);
  font-size: 19px;
  font-weight: 600;
  line-height: 1.3;
}
@media (max-width: 374px) {
  .matched-content {
    padding-right: 18px;
    padding-left: 18px;
  }
  .matched-product-details {
    gap: 9px;
  }
  .matched-product-image {
    flex-basis: 48px;
    width: 48px;
    height: 48px;
  }
  .matched-product-name {
    font-size: 15px;
  }
}
</style>
