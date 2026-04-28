<template>
  <div class="flex flex-col bg-[#f8f8f8] h-[100vh]">
    <div class="relative flex items-center justify-center h-[56px] px-[16px] bg-[#fff]">
      <div class="absolute left-[16px]">
        <van-icon
          name="arrow-left"
          color="#000"
          size="22px"
          @click="onClickLeft"
        />
      </div>
      <div class="text-base text-[#000000] font-medium">
        {{ $t("setting") }}
      </div>
    </div>
    <div class="pt-[10px] pb-[20px]">
         <div
          @click="change"
          class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0] bg-[#fff]"
        >
          <div class="flex items-center">
            <!-- <img
              src="@/static/images/ContactUs.png"
              class="w-6 h-6 mr-3"
              alt=""
            /> -->
            <div class="text-[#1a1a1a] text-sm">{{ $t("change_language") }}</div>
          </div>
          <van-icon name="arrow" color="#999" size="18px" />
        </div>
    </div>
    <div
        @click="logout"
        class="w-full h-[50px] flex items-center justify-center bg-[#fff] bold text-[#eb5641] text-[16px]"
      >
        {{ $t("log_out") }}
    </div>
    <Lang ref="langRef"></Lang>

      
  </div>
</template>
<script setup>
import Header from "@/components/Header.vue";
import Lang from "@/components/Lang.vue";
import { getStaticImageUrl } from "@/util/utils.js";
import { useI18n } from "vue-i18n";
import { useCommonStore } from "@/store/modules/common";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { showConfirmDialog } from "vant";
import { showToast } from "@/util/message";
const { t } = useI18n();
const userStore = useUserStore();
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
const { locale } = useI18n();
const router = useRouter();
const langRef = ref(null);
const langs = [
  { title: "中文", code: "zh" },
  { title: "English", code: "en" },
];
const commonStore = useCommonStore();
const langCode = computed(() => commonStore.lang);

function onClickLang(val) {
  commonStore.updateLang(val);
  locale.value = val;
}
const onClickLeft = () => {
  router.replace({
    path: "/my",
  });
};

const logout = () => {
  showConfirmDialog({
    title: t("exit"),
    message: t("are_you_sure_you_want_to_logout"),
    confirmButtonColor: "var(--theme-primary)", // 确认按钮颜色使用公共主题色
  })
    .then(() => {
      userStore.logout();
    })
    .catch(() => {
      // on cancel
    });
};

const change = () =>{
langRef.value.open();
}
</script>
