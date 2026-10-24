<template>
  <main class="das-page security-form-page">
    <DasPageHeader :title-key="sectionKey" back-to="/profileItem" />
    <form
      class="security-form"
      novalidate
      @invalid.capture.prevent
      @submit.prevent="submit"
    >
      <div class="security-form__fields">
        <label
          v-for="field in fields"
          :key="field.key"
          class="security-form__field"
        >
          <b
            ><span>{{ $t(field.label) }}</span
            ><sup v-if="field.required">*</sup></b
          >
          <div class="security-form__input">
            <input
              v-model="field.model.value"
              :type="field.visible.value ? 'text' : 'password'"
              placeholder="**********"
            />
            <button
              type="button"
              :class="{ 'is-hidden': !field.visible.value }"
              :aria-pressed="field.visible.value"
              @click="field.visible.value = !field.visible.value"
            >
              <ReferenceEye :visible="field.visible.value" />
            </button>
          </div>
        </label>
      </div>
      <p class="security-form__note">
        <span>{{ noteParts.prefix }}</span>
        <button
          v-if="noteParts.link"
          type="button"
          @click="safePush(router, '/contact')"
        >
          {{ noteParts.link }}
        </button>
      </p>
      <button class="security-form__save">{{ $t("das.common.save") }}</button>
      <small class="security-form__copyright">
        {{ $t("das.common.copyright") }}
      </small>
    </form>
  </main>
</template>

<script setup>
import ReferenceEye from "@/components/ReferenceEye.vue";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showSuccessToast, showToast } from "vant";
import DasPageHeader from "@/components/DasPageHeader.vue";
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
    oldRequired: { type: Boolean, default: true },
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
  {
    key: "old",
    label: props.oldKey,
    model: oldValue,
    visible: oldVisible,
    required: props.oldRequired,
  },
  {
    key: "new",
    label: props.newKey,
    model: newValue,
    visible: newVisible,
    required: true,
  },
  {
    key: "confirm",
    label: props.confirmKey,
    model: confirmation,
    visible: confirmVisible,
    required: true,
  },
]);
const noteParts = computed(() => {
  const text = t(props.noteKey);
  const match = text.match(
    /(Customer Support\.?|客户支持。?|カスタマーサポートにお問い合わせください。?|고객 지원에 문의하세요[。.]?)$/i,
  );
  if (!match || match.index === undefined) return { prefix: text, link: "" };
  return { prefix: text.slice(0, match.index), link: match[0] };
});
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
