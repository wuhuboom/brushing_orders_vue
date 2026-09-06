<template>
  <DmkPcAccountShell
    active="edit"
    :breadcrumb-key="sectionKey"
    breadcrumb-parent-key="das.dmk.editProfile"
  >
    <DmkPcEditTabs :active="pcActive">
      <form class="nsg-password-editor w-full lg:w-[80%] mx-auto dmk-fund-password-scope" novalidate @invalid.capture.prevent @submit.prevent="submit">
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
              <button class="nsg-password-submit van-button van-button--default van-button--large" :class="{ 'is-ready': passwordReady }" style="color: white; background: var(--main-color); border-color: var(--main-color)" type="submit">
                <div class="van-button__content"><span class="van-button__text"><span class="text-black">{{ $t("das.dmk.update") }}</span></span></div>
              </button>
            </div>
          </div>
        </div>
      </form>
    </DmkPcEditTabs>
  </DmkPcAccountShell>
  <DmkH5Layout class="dmk-mobile-current">
    <div class="nsg-mobile-section-bar nsg-password-mobile-title">
      <NsgBackButton type="button" :aria-label="$t('das.common.back')" @click="safePush(router, '/profileItem')" />
      <strong>{{ $t(sectionKey) }}</strong>
      <i aria-hidden="true"></i>
    </div>
    <section class="nsg-password-mobile">
      <form novalidate @invalid.capture.prevent @submit.prevent="submit">
        <label v-for="field in fields" :key="field.key">
          <span>{{ $t(field.label) }}</span>
          <span class="nsg-password-mobile__field">
            <input
              v-model="field.model.value"
              :placeholder="$t(field.label)"
              type="password"
            />
            <img src="/nsg16/password-hidden.png" class="nsg-password-eye" alt="" />
          </span>
        </label>
        <p v-if="noteKey" class="nsg-password-mobile__note">
          {{ $t(noteKey) }}
        </p>
        <button class="nsg-password-mobile__submit nsg-password-submit" :class="{ 'is-ready': passwordReady }" type="submit">
          {{ $t("das.dmk.save") }}
        </button>
      </form>
    </section>
  </DmkH5Layout>
</template>
<script setup>
import NsgBackButton from "@/components/dmk/NsgBackButton.vue";
import DmkPcAccountShell from "@/components/dmkPc/DmkPcAccountShell.vue";
import DmkPcEditTabs from "@/components/dmkPc/DmkPcEditTabs.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import { computed, ref } from "vue";
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
const passwordReady = computed(() => Boolean(
  oldValue.value && newValue.value && confirmation.value && newValue.value === confirmation.value,
));
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
