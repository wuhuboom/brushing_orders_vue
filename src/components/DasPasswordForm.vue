<template>
  <DmkPcAccountShell active="edit">
    <DmkPcEditTabs :active="pcActive">
      <form class="w-full lg:w-[80%] mx-auto dmk-fund-password-scope" novalidate @invalid.capture.prevent @submit.prevent="submit">
        <div class="w-full box-border flex flex-col">
          <div class="w-full flex flex-col mt-6">
            <div v-for="field in pcFields" :key="field.key" class="w-full flex flex-col" :class="field.key === 'old' ? '' : 'mt-4'">
              <div class="text-[#fff] text-base">{{ field.label }}</div>
              <div class="w-full mt-2 overflow-hidden rounded-md bg-[#1a1a1a] border border-[#393939] lg:bg-[#fff] lg:border-[#fff]">
                <div class="van-cell van-field">
                  <div class="van-cell__value van-field__value"><div class="van-field__body"><input v-model="field.model.value" class="van-field__control" :placeholder="field.label" type="password" /></div></div>
                </div>
              </div>
            </div>
            <div class="w-full mt-6">
              <button class="van-button van-button--default van-button--large" style="color: white; background: var(--main-color); border-color: var(--main-color)" type="submit">
                <div class="van-button__content"><span class="van-button__text"><span class="text-black">{{ $t("das.dmk.update") }}</span></span></div>
              </button>
            </div>
          </div>
        </div>
      </form>
    </DmkPcEditTabs>
  </DmkPcAccountShell>
  <DmkH5Layout class="dmk-mobile-current">
    <div class="w-full p-4 text-white dmk-profile-info-scope">
      <div class="text-3xl">{{ $t("das.dmk.editProfile") }}</div>
      <div class="mt-4">
        <div class="text-base">{{ $t("das.dmk.profileImage") }}</div>
        <div class="border-[1px] border-[var(--main-color)] p-2 rounded-md flex justify-between items-center mt-2">
          <div class="w-12 h-12"><img :src="h5Avatar" class="w-full h-full rounded-full object-cover" alt="" /></div>
          <button type="button" class="bg-[var(--main-color)] px-4 py-2 rounded-md text-black text-base" @click="safePush(router, '/profile')">{{ $t("das.dmk.save") }}</button>
        </div>
      </div>

      <div class="box w-full mt-4 p-4 py-3">
        <div class="w-full flex justify-between items-center text-lg cursor-pointer" @click="pcActive === 'transaction' ? null : safePush(router, '/updateTransactionPassword')">
          <div>{{ $t("das.dmk.updateTransactionPassword") }}</div><i class="van-badge__wrapper van-icon" :class="pcActive === 'transaction' ? 'van-icon-arrow-up' : 'van-icon-arrow-down'" style="color:#fff;font-size:24px"></i>
        </div>
        <form v-if="pcActive === 'transaction'" class="w-full mx-auto dmk-login-password-scope" novalidate @invalid.capture.prevent @submit.prevent="submit">
          <div class="w-full box-border flex flex-col"><div class="w-full flex flex-col mt-6">
            <div v-for="field in pcFields" :key="field.key" class="w-full flex flex-col" :class="field.key === 'old' ? '' : 'mt-4'">
              <div class="text-[#fff] text-base">{{ field.label }}</div>
              <div class="w-full mt-2 overflow-hidden rounded-md bg-[#1a1a1a] border border-[#393939]">
                <div class="van-cell van-field"><div class="van-cell__value van-field__value"><div class="van-field__body"><input v-model="field.model.value" class="van-field__control" :placeholder="field.label" type="password" /></div></div></div>
              </div>
            </div>
            <div class="w-full mt-6"><button class="van-button van-button--default van-button--large" style="color:white;background:var(--main-color);border-color:var(--main-color)" type="submit"><div class="van-button__content"><span class="van-button__text"><span class="text-black">{{ $t("das.dmk.update") }}</span></span></div></button></div>
          </div></div>
        </form>
      </div>

      <div class="box w-full mt-4 p-4 py-3">
        <div class="w-full flex justify-between items-center text-lg cursor-pointer" @click="pcActive === 'login' ? null : safePush(router, '/updatePassword')">
          <div>{{ $t("das.dmk.updateLoginPassword") }}</div><i class="van-badge__wrapper van-icon" :class="pcActive === 'login' ? 'van-icon-arrow-up' : 'van-icon-arrow-down'" style="color:#fff;font-size:24px"></i>
        </div>
        <form v-if="pcActive === 'login'" class="w-full mx-auto dmk-fund-password-scope" novalidate @invalid.capture.prevent @submit.prevent="submit">
          <div class="w-full box-border flex flex-col"><div class="w-full flex flex-col mt-6">
            <div v-for="field in pcFields" :key="field.key" class="w-full flex flex-col" :class="field.key === 'old' ? '' : 'mt-4'">
              <div class="text-[#fff] text-base">{{ field.label }}</div>
              <div class="w-full mt-2 overflow-hidden rounded-md bg-[#1a1a1a] border border-[#393939]">
                <div class="van-cell van-field"><div class="van-cell__value van-field__value"><div class="van-field__body"><input v-model="field.model.value" class="van-field__control" :placeholder="field.label" type="password" /></div></div></div>
              </div>
            </div>
            <div class="w-full mt-6"><button class="van-button van-button--default van-button--large" style="color:white;background:var(--main-color);border-color:var(--main-color)" type="submit"><div class="van-button__content"><span class="van-button__text"><span class="text-black">{{ $t("das.dmk.update") }}</span></span></div></button></div>
          </div></div>
        </form>
      </div>
    </div>
  </DmkH5Layout>
</template>
<script setup>
import DmkPcAccountShell from "@/components/dmkPc/DmkPcAccountShell.vue";
import DmkPcEditTabs from "@/components/dmkPc/DmkPcEditTabs.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import { computed, ref } from "vue";
import { useUserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showSuccessToast, showToast } from "vant";
import { safePush, safeReplace } from "@/utils/navigation";
const props = defineProps({
    sectionKey: String,
    oldKey: String,
    newKey: String,
    confirmKey: String,
    noteKey: String,
    submitter: Function,
    oldField: String,
    newField: String,
    pcActive: { type: String, default: "login" },
  }),
  router = useRouter(),
  { t } = useI18n(),
  oldValue = ref(""),
  newValue = ref(""),
  confirmation = ref(""),
  oldVisible = ref(false),
  newVisible = ref(false),
  confirmVisible = ref(false);
const userStore = useUserStore();
const h5Avatar = computed(() => {
  const path = String(userStore.userInfo?.avatar || "").trim();
  if (!path) return "/dmk/assets/avatar.png";
  const base = window.g?.VITE_API_IMG_URL || import.meta.env.VITE_API_IMG_URL || "";
  return /^https?:/i.test(path) ? path : `${base}${path}`;
});
const fields = computed(() => [
  { key: "old", label: props.oldKey, model: oldValue, visible: oldVisible },
  { key: "new", label: props.newKey, model: newValue, visible: newVisible },
  {
    key: "confirm",
    label: props.confirmKey,
    model: confirmation,
    visible: confirmVisible,
  },
]);
const pcFields = computed(() => [
  { key: "old", label: t("das.dmk.oldPassword"), model: oldValue },
  { key: "new", label: t("das.dmk.newPassword"), model: newValue },
  { key: "confirm", label: t("das.dmk.confirmNewPassword"), model: confirmation },
]);
const submit = async () => {
  if (!oldValue.value || !newValue.value || !confirmation.value)
    return showToast(t("das.auth.required"));
  if (newValue.value !== confirmation.value)
    return showToast(t("das.auth.passwordMismatch"));
  await props.submitter({
    [props.oldField]: oldValue.value,
    [props.newField]: newValue.value,
  });
  showSuccessToast(t("das.common.success"));
  safeReplace(router, "/profileItem");
};
</script>
<style scoped>
.password-page {
  min-height: 100%;
  background: #f7f5ec;
  color: #17382d;
}
.password-page form {
  max-width: 760px;
  margin: auto;
  padding: 30px 28px 80px;
}
.password-page h2 {
  margin: 0 0 14px;
  font-size: 18px;
}
.password-page label {
  display: block;
  margin: 12px 0;
  padding: 17px 22px;
  border-radius: 20px;
  background: #fff;
}
.password-page label b {
  font-size: 15px;
}
.password-page label div {
  display: grid;
  grid-template-columns: 1fr 34px;
  align-items: center;
}
.password-page input {
  height: 35px;
  border: 0;
  outline: 0;
  background: transparent;
  color: #17382d;
}
.password-page label button {
  position: relative;
  width: 34px;
  height: 34px;
  padding: 0;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
}
.password-page label button svg {
  width: 24px;
  height: 24px;
  stroke: #53675e;
  stroke-width: 2.1;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.password-page form > p {
  margin: 21px 6px;
  color: #929892;
  font-size: 13px;
  line-height: 1.5;
}
.save-button {
  width: 100%;
  height: 56px;
  margin-top: 18px;
  border: 0;
  border-radius: 999px;
  background: #14392c;
  color: #fff;
  font-size: 17px;
  font-weight: 800;
}
.password-page small {
  display: block;
  margin-top: 27px;
  text-align: center;
  color: #9da39e;
  font-size: 10px;
}
</style>
