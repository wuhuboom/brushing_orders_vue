<template>
  <div class="w-full min-h-[100vh] bg-[#f8f8f8] px-[20px]">
    <div class="container w-full mb-[100px] bg-white">
      <van-nav-bar
        :title="$t('定金')"
        fixed
        left-arrow
        class="shadow"
        @click-left="onClickLeft"
      />
    </div>
    <div class="flex flex-col items-center mt-[80px]">
        <div class="text-[#000] text-[24px] font-bold">{{100}}</div>
        <div class="text-[14px] font-bold mt-[10px] my-[10px]">{{$t('网络')}} - TRON(TRC-20)</div>
        <div class="bg-[#ffeeee] text-[red] rounded-[5px] py-[10px] px-[5px]">
            ⚠️{{$t('你有一个尚未付款的订单')}}
        </div>
        <div class="text-[14px] text-[#ff6600] mb-[15px] mt-[10px]">{{$t('一次性地址')}}:</div>
           <img
            :src="url+AddressInfor.qrCode"
            width="200"
            height="200"
        />
    </div>
    <div class="mt-[20px]">
        <div class="flex justify-between">
            <div class="text-[#333] text-[16px]">{{AddressInfor.url}}</div>
            <div class="text-center" @click="copyContent(AddressInfor.url)">⧉</div>
        </div>
        <div class="bg-[#f6f6f6] h-[52px] flex items-center justify-center pl-[5px] text-[20px] mt-[15px]">
            {{$t('等待支付...')}}
        </div>
    </div>
    <div class="text-[14px] text-[#000]">
        <div class="text-[#000] text-[16px] font-bold pb-[10px]">{{$t('提示')}}:</div>
        <div class="pb-[10px]">1.{{$t('充值地址为')}}<span class="text-[#ff0000] font-bold">{{$t('一次性地址')}}</span>，{{$t('请勿重复填写或转移')}}。</div>
        <div class="pb-[10px]">2.{{$t('最低充值金额以实际转账金额为准，不低于')}} <span class="text-[#ff0000] font-bold">10 USDT</span>。</div>
        <div class="pb-[10px]">3.{{$t('充值成功后，大约需要')}}<span class="text-[#ff0000] font-bold">{{$t('1到2分钟')}}</span> {{$t('才能确认付款，请耐心等待')}}。</div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref,watchEffect } from "vue";
import {getRechargeAddress} from "../../api/apis"
// import VueQrcode from "@chenfengyuan/vue-qrcode"; // 新增导入
import QRCode from 'qrcode'
import { useRoute } from "vue-router";
import { useCommonStore } from '@/store/modules/common';
import { copyContent } from "../../util/utils";
const route = useRoute();
const commonStore = useCommonStore();
const url = window.g.VITE_API_IMG_URL;
const qrImg = ref('')
onMounted(() =>{
    getFullDomain()
    getGetRechargeAddress()
})
const address = ref('')
const getFullDomain = () =>{
  console.log(route.query.code)
  const fullDomain = window.location.origin +'/#/account/register?code='+route.query.code;
  address.value = fullDomain
  console.log(address.value)
}
const AddressInfor = ref({})
const getGetRechargeAddress = async () =>{
    let res = await getRechargeAddress()
    AddressInfor.value = res.data[0]

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
