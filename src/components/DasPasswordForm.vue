<template>
  <main class="das-page password-page">
    <DasPageHeader title-key="das.page.security" back-to="/profileItem" />
    <form novalidate @invalid.capture.prevent @submit.prevent="submit">
      <h2>{{ $t(sectionKey) }}</h2>
      <label v-for="field in fields" :key="field.key"
        ><b>{{ $t(field.label) }}</b>
        <div>
          <input
            v-model="field.model.value"
            :type="field.visible.value ? 'text' : 'password'"
            placeholder="••••••••••••"
          /><button
            type="button"
            :class="{ 'is-hidden': !field.visible.value }"
            :aria-pressed="field.visible.value"
            @click="field.visible.value = !field.visible.value"
          >
            <svg
              v-if="field.visible.value"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
              <circle cx="12" cy="12" r="2.8" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 3l18 18" />
              <path d="M10.6 6.1A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-2.5 3.2" />
              <path d="M6.2 7.2C3.8 9 2.5 12 2.5 12s3.5 6 9.5 6a10 10 0 0 0 3.1-.5" />
              <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
            </svg>
          </button></div
      ></label>
      <p>{{ $t(noteKey) }}</p>
      <button class="save-button">{{ $t("das.common.save") }}</button
      ><small>{{ $t("das.common.copyright") }}</small>
    </form>
  </main>
</template>
<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showSuccessToast, showToast } from "vant";
import DasPageHeader from "@/components/DasPageHeader.vue";
import { safeReplace } from "@/utils/navigation";
const props = defineProps({
    sectionKey: String,
    oldKey: String,
    newKey: String,
    confirmKey: String,
    noteKey: String,
    submitter: Function,
    oldField: String,
    newField: String,
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
