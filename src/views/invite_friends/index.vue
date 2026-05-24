<template>
  <div class="invite-page min-h-screen bg-[#eef2fb]">
    <PageTopBar :title="$t('invite_friends')" show-back @click-left="onClickLeft" />

    <div class="invite-page__body">
      <section class="invite-page__hero">
        <div class="invite-page__label">{{ $t('my_invitation_code') }}</div>
        <div class="invite-page__code">{{ route.query.code }}</div>
        <div class="invite-page__qr-wrap">
          <img v-if="qrImg" :src="qrImg" width="124" height="124" />
        </div>
        <div class="invite-page__tip">{{ $t('long_press_to_save_the_qr_code') }}</div>
      </section>

      <section class="invite-page__link-card">
        <div class="invite-page__link-head">
          <div>{{ $t('share_link') }}</div>
          <button type="button" class="invite-page__copy" @click="copyContent(address)">
            {{ $t('copy') }}
          </button>
        </div>
        <div class="invite-page__link-box">{{ address }}</div>
      </section>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref,watchEffect } from "vue";
import {getConfigByLang} from "../../api/apis"
// import VueQrcode from "@chenfengyuan/vue-qrcode"; // 新增导入
import QRCode from 'qrcode'
import { useRoute } from "vue-router";
import { useCommonStore } from '@/store/modules/common';
import { copyContent } from "../../util/utils";
const route = useRoute();
const commonStore = useCommonStore();
const qrImg = ref('')
onMounted(() =>{
    getFullDomain()
})
const address = ref('')
const getFullDomain = () =>{
  console.log(route.query.code)
  const fullDomain = window.location.origin +'/#/account/register?code='+route.query.code;
  address.value = fullDomain
  console.log(address.value)
}
watchEffect(async () => {
  if (!address.value) return

  qrImg.value = await QRCode.toDataURL(address.value, {
    width: 124,
    margin: 0,
    errorCorrectionLevel: 'H',
  })
  console.log(qrImg.value )
})

const onClickLeft = () => history.back();
</script>

<style scoped>
.invite-page__body {
  padding: 92px 20px 32px;
}

.invite-page__hero,
.invite-page__link-card {
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(18, 25, 38, 0.04);
}

.invite-page__hero {
  padding: 28px 20px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.invite-page__label {
  color: #7a8496;
  font-size: 13px;
}

.invite-page__code {
  margin-top: 10px;
  color: #121826;
  font-size: 30px;
  font-weight: 700;
}

.invite-page__qr-wrap {
  margin-top: 24px;
  padding: 14px;
  border-radius: 18px;
  background: #f6f8ff;
}

.invite-page__tip {
  margin-top: 12px;
  color: #f37335;
  font-size: 12px;
}

.invite-page__link-card {
  margin-top: 18px;
  padding: 20px;
}

.invite-page__link-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #121826;
  font-size: 14px;
  font-weight: 500;
}

.invite-page__copy {
  border: 0;
  background: transparent;
  color: #3550e8;
  font-size: 14px;
  font-weight: 600;
}

.invite-page__link-box {
  margin-top: 14px;
  padding: 16px 12px;
  border-radius: 14px;
  background: #f5f7fb;
  color: #6b7486;
  font-size: 12px;
  line-height: 1.6;
  word-break: break-all;
}
</style>
