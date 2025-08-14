<template>
  <div class="w-full min-h-[100vh] bg-[#f4f4f5]">
    <div
      class="w-full p-6 box-border flex flex-col font-montserrat text-[#666]"
    >
      <van-nav-bar
        :title="$t('条款协议')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="mt-10" v-html="registerProtocolEn">

      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getGlobalConfig} from "../../api/apis"
const onClickLeft = () => history.back();
const registerProtocolEn = ref('');
const getGetGlobalConfig = async() =>{
    let res = await getGlobalConfig();
    registerProtocolEn.value = res.data.registerProtocolEn
    console.log(res)
}
onMounted(() =>{
    getGetGlobalConfig();
})
</script>
