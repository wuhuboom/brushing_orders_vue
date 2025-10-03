<template>
  <van-popup
    v-model:show="dialogVisible"
    :style="{ width: '240px', height: '264px',background: '#fff',borderRadius: '12px' }"
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
    <div class="flex flex-col gap-4 mt-[30px]">
      <div
        v-for="item in LANGS"
        :key="item.code"
        class="flex items-center pb-[12px]"
        @click="handleChangeLang(item)"
      >
        <div class="w-full h-full flex items-center px-[19px]">
          <img :src="getStaticImageUrl(`${item.code}.png`)"
                    alt="" class="h-[32px] w-[32px]">
          <div class="text-[14px] text-black pl-[12px]">{{item.name}}</div>
          <img v-if="locale == item.code" src="../static/images/check.png" alt="" class="h-[20px] w-[20px] ml-auto">
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
import { getStaticImageUrl } from "../util/utils";
import { useLocale } from "../util/useLocale";
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

function handleChangeLang(item) {
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
</style>
<style>
.header {
  margin: 0 !important;
  padding: 20px 20px 0 !important;
}
</style>
