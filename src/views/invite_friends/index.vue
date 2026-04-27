<template>
  <div class="w-full min-h-[100vh] bg-[#f8f8f8] px-[20px]">
    <div class="container w-full mb-[100px] bg-white">
      <PageTopBar :title="$t('invite_friends')" show-back @click-left="onClickLeft" />
    </div>
    <div class="flex flex-col items-center mt-[200px]">
        <div class="text-[#999] text-[12px]">{{$t('my_invitation_code')}}</div>
        <div class="text-[27px] font-bold mt-[10px] mb-[30px]">{{route.query.code}}</div>
        <!-- <img class="w-[124px] h-[124px]" src="@/static/images/cunkuan.png" alt=""> -->
        <!-- <vue-qrcode
            :value="address"
            :options="{ width: 124, margin: 0 }"
            class="p-0"
          /> -->
           <img
            v-if="qrImg"
            :src="qrImg"
            width="124"
            height="124"
        />
        <div class="text-[#f37335] text-[10px] pt-[10px]">{{$t('long_press_to_save_the_qr_code')}}</div>
    </div>
    <div class="bg-[#fff] p-[20px] mt-[20px]">
        <div class="flex justify-between text-[12px]">
            <div class="text-[#333]">{{$t('share_link')}}</div>
            <div class="text-[#f37335]" @click="copyContent(address)">{{$t('copy')}}</div>
        </div>
        <div class="bg-[#f6f6f6] h-[52px] flex items-center pl-[5px] text-[10px] mt-[15px]">
            {{address}}
        </div>
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
