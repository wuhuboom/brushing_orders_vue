<template>
  <div>
    <van-nav-bar
      :title="$t('更改语言')"
      fixed
      left-arrow
      class="shadow"
      @click-left="onClickLeft"
    />
    <!-- <div>
      <div
        class="bg-gray w-8 h-8 flex items-center justify-center rounded-2.5"
        @click="close"
      >
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <p class="text-[25px] mt-5 text-black">{{ $t("选择语言") }}</p>
    </div> -->
    <!-- </template> -->
    <div class="flex flex-col gap-4 mt-20 px-[20px]">
      <div
        v-for="item in LANGS"
        :key="item.code"
        class="flex items-center gap-4 border border-[#F3F4F6] rounded-[12px]"
        @click="handleChangeLang(item)"
      >
        <div class=" w-full h-full flex flex-col box-border">
          <div
            class="w-full h-16 flex items-center justify-between pl-[17px]  text-[#000] text-lg uppercase"
          >
            <div>{{ item.name }}</div>
            <img v-if="item.code ===commonStore.clientLang" src="../../static/images/dui.png" class="w-[24px] h-[24px]" alt="">
          </div>
          
        </div>
      </div>
    </div>
    <!-- </van-popup> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import { LANGS } from "@/config/lang";
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useCommonStore } from "../../store/modules/common";
import { useI18n } from "vue-i18n";
import { getStaticImageUrl } from "../../util/utils";
import { useLocale } from "../../util/useLocale";
const { locale } = useI18n();
const dialogVisible = ref(false);
const router = useRouter();
const commonStore = useCommonStore();
const { setLocale } = useLocale();

const onClickLeft = () =>{
    router.go(-1)

}

// 更符合Vue3习惯的暴露方式
const open = () => (dialogVisible.value = true);
const close = () => (dialogVisible.value = false);

defineExpose({
  open,
  close, // 新增关闭方法
});

function handleChangeLang(item) {
  console.log(item.code);
  if (commonStore.clientLang === item.code) return;
  commonStore.updateLang(item.code);
  locale.value = item.code;
  setLocale(locale.value);
  onClickLeft()
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
