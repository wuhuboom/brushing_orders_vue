<template>
  <div class="language-page min-h-screen bg-[#eef2fb]">
    <PageTopBar :title="$t('change_language')" show-back @click-left="onClickLeft" />

    <div class="language-page__body">
      <div
        v-for="item in LANGS"
        :key="item.code"
        class="language-page__row"
        :class="{ 'language-page__row--active': item.code === commonStore.clientLang }"
        @click="handleChangeLang(item)"
      >
        <div class="language-page__name">{{ item.name }}</div>
        <img
          v-if="item.code === commonStore.clientLang"
          src="../../static/images/dui.png"
          class="language-page__check"
          alt=""
        />
      </div>
    </div>
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
.language-page__body {
  padding: 92px 20px 36px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.language-page__row {
  min-height: 78px;
  padding: 0 20px;
  border: 1px solid #edf0f8;
  border-radius: 18px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 8px 22px rgba(18, 25, 38, 0.03);
}

.language-page__row--active {
  border-color: #cfd8ff;
  background: #f7f9ff;
}

.language-page__name {
  color: #111827;
  font-size: 18px;
  font-weight: 500;
  text-transform: uppercase;
}

.language-page__check {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
</style>
