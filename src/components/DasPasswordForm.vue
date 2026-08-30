<template>
  <main class="das-page security-form-page">
    <DasPageHeader title-key="das.page.security" back-to="/profileItem" />
    <form
      class="security-form"
      novalidate
      @invalid.capture.prevent
      @submit.prevent="submit"
    >
      <h2 class="security-form__section-title">{{ $t(sectionKey) }}</h2>
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
              <svg
                v-if="field.visible.value"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                />
                <circle cx="12" cy="12" r="2.8" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3.5 9.5c2.4 2.8 5.2 4.1 8.5 4.1s6.1-1.3 8.5-4.1" />
                <path
                  d="m6.8 13-1.3 2.4M10.4 14l-.4 2.7M13.6 14l.4 2.7M17.2 13l1.3 2.4"
                />
              </svg>
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
<style scoped>
.das-page.security-form-page {
  min-height: 100%;
  background-color: #020717;
  background-image: radial-gradient(
    ellipse at 50% 100%,
    rgba(0, 151, 255, 0.15),
    transparent 22%
  );
  color: #f4f6fb;
}
.security-form {
  width: 100%;
  max-width: 860px;
  min-height: calc(100svh - 111px);
  margin: 0 auto;
  padding: 31px clamp(23px, 6vw, 58px) 0;
  display: flex;
  flex-direction: column;
}
.security-form__section-title {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
.security-form__fields {
  width: 100%;
}
.security-form__field {
  display: block;
  margin: 0;
  padding: 0;
}
.security-form__field + .security-form__field {
  margin-top: 17px;
}
.security-form__field > b {
  display: block;
  margin: 0 0 9px;
  color: #d1d5df;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
}
.security-form__field sup {
  position: relative;
  top: -0.12em;
  margin-left: 2px;
  color: #747d90;
  font-size: 14px;
  line-height: 0;
}
.security-form__input {
  height: 44px;
  padding: 0 4px 0 11px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 38px;
  align-items: center;
  border: 1px solid #343947;
  border-radius: 7px;
  background: #111522;
}
.security-form__input input {
  width: 100%;
  height: 42px;
  padding: 0 0 1px;
  border: 0;
  outline: 0;
  background: transparent;
  color: #f4f5f8;
  font-size: 16px;
  letter-spacing: 0.5px;
}
.security-form__input input::placeholder {
  color: #f4f5f8;
  opacity: 1;
  letter-spacing: 0;
}
.security-form__input button {
  position: relative;
  width: 38px;
  height: 42px;
  padding: 0;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
}
.security-form__input button svg {
  width: 22px;
  height: 22px;
  stroke: #777f90;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.security-form__note {
  width: 100%;
  max-width: 340px;
  margin: 30px auto 0;
  color: #929bad;
  font-size: 13px;
  line-height: 22px;
  text-align: center;
}
.security-form__note button {
  display: inline;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: #ff9800;
  font: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.security-form__save {
  width: 100%;
  height: 60px;
  margin-top: 30px;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(100deg, #08baff, #0878ff 48%, #4e22cf);
  color: #fff;
  font-size: 20px;
  font-weight: 700;
}
.security-form__copyright {
  display: block;
  margin-top: auto;
  padding: 48px 0 28px;
  text-align: center;
  color: #8f99ad;
  font-size: 10px;
  line-height: 16px;
}
@media (max-width: 350px) {
  .security-form {
    padding-right: 18px;
    padding-left: 18px;
  }
  .security-form__field + .security-form__field {
    margin-top: 14px;
  }
  .security-form__note {
    margin-top: 23px;
  }
  .security-form__save {
    margin-top: 22px;
  }
}
</style>
