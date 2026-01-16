<template>
  <van-popup
    v-model:show="dialogVisible"
    position="center"
    :style="{ width: '70%', height: '23%',background: '#fff',borderRadius: '10px' }"
  >
    <!-- <template #header>
      <div>
        <div
          class="bg-gray w-8 h-8 flex items-center justify-center rounded-2.5"
          @click="close"
        >
          <el-icon>
            <Close />
          </el-icon>
        </div>
        <p class="text-[25px] mt-5 text-black">{{ $t("选择语言") }}</p>
      </div>
    </template> -->
    <div class="flex flex-col gap-4 mt-[20px]">
      <div
        v-for="item in LANGS"
        :key="item.code"
        
        class="flex items-center gap-4  "
        @click="handleChangeLang(item)"
      >
        <div class="w-full h-full flex flex-col   box-border" >
          <div class="w-[80%] mx-auto h-[36px] flex items-center justify-center text-[#000000] font-bold text-[12px] uppercase border border-[#E3DDDD] rounded-[4px]" :class="locale==item.code?'active':''">
            <img :src="getStaticImageUrl(`${item.code}.png`)" alt="" class="w-[22px] h-[22px] mr-[26px]">
            <span class="w-[80px]">{{item.name}}</span>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { ref } from "vue";
import { LANGS } from "@/config/lang";
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useCommonStore } from "../store/modules/common";
import { useI18n } from "vue-i18n";
import { useCurrentLang } from 'vant';
import { getStaticImageUrl } from "../util/utils";
import { useLocale } from "../util/useLocale";
const currentLang = useCurrentLang();
const { locale } = useI18n();
const dialogVisible = ref(false);
const router = useRouter();
const commonStore = useCommonStore();
const { setLocale } = useLocale();


// 更符合Vue3习惯的暴露方式
const open = () => (dialogVisible.value = true);
const close = () => (dialogVisible.value = false);

defineExpose({
  open,
  close, // 新增关闭方法
});

console.log(locale)

function handleChangeLang(item) {
  console.log(item.code)
  if (commonStore.clientLang === item.code) return;
  commonStore.updateLang(item.code);
  locale.value = item.code;
  setLocale(locale.value);
  close();
}
</script>

<style scoped>
:deep(.el-drawer.btt) {
  border-top-left-radius: 20px !important;
  border-top-right-radius: 20px !important;
}
.active {
  color: #FF7D01;
  border: 1px solid #FF7D01;
}
</style>
<style>
.header {
  margin: 0 !important;
  padding: 20px 20px 0 !important;
}
</style>
