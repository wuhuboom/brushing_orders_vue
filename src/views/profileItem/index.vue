<template>
  <main class="das-page info-page">
    <DasPageHeader title-key="das.page.accountInfo" />
    <section class="info-body">
      <h2>{{ $t("das.profile.myProfile") }}</h2>
      <div class="field-card">
        <b>{{ $t("das.profile.username") }}</b
        ><span>{{ user.username || "—" }}</span>
      </div>
      <div class="field-card">
        <b>{{ $t("das.profile.mobileNo") }}</b
        ><span>{{ user.phoneNumber || user.phone || "—" }}</span>
      </div>
      <div class="field-card">
        <b>{{ $t("das.profile.gender") }}</b>
        <span>{{ gender }}</span>
      </div>
      <h2 class="security-title">{{ $t("das.page.security") }}</h2>
      <button
        class="field-card security-card"
        type="button"
        @click="safePush(router, '/updatePassword')"
      >
        <b>{{ $t("das.page.loginPassword") }}</b>
        <span>••••••••••••</span>
        <span class="security-eye" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M3 3l18 18" />
            <path d="M10.6 10.7a2.1 2.1 0 0 0 2.8 2.8" />
            <path d="M9.9 5.2A10.9 10.9 0 0 1 12 5c5.2 0 8.5 4.5 9.3 5.8a2.2 2.2 0 0 1 0 2.4 13.8 13.8 0 0 1-2.4 2.9" />
            <path d="M6.6 6.6a15 15 0 0 0-3.9 4.2 2.2 2.2 0 0 0 0 2.4C3.5 14.5 6.8 19 12 19c1 0 2-.2 2.9-.5" />
          </svg>
        </span>
      </button
      ><button
        class="field-card security-card"
        type="button"
        @click="safePush(router, '/updateTransactionPassword')"
      >
        <b>{{ $t("das.page.fundPassword") }}</b>
        <span>••••••••••••</span>
        <span class="security-eye" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M3 3l18 18" />
            <path d="M10.6 10.7a2.1 2.1 0 0 0 2.8 2.8" />
            <path d="M9.9 5.2A10.9 10.9 0 0 1 12 5c5.2 0 8.5 4.5 9.3 5.8a2.2 2.2 0 0 1 0 2.4 13.8 13.8 0 0 1-2.4 2.9" />
            <path d="M6.6 6.6a15 15 0 0 0-3.9 4.2 2.2 2.2 0 0 0 0 2.4C3.5 14.5 6.8 19 12 19c1 0 2-.2 2.9-.5" />
          </svg>
        </span>
      </button>
    </section>
    <p class="info-footer">{{ $t("das.common.copyright") }}</p>
  </main>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { userGetInfo } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
import { genderForUser } from "@/utils/avatar";
import { safePush } from "@/utils/navigation";
const router = useRouter(),
  { t } = useI18n(),
  user = ref({});
const gender = computed(() => {
  const normalized = genderForUser(user.value);
  if (normalized === "male") return t("das.auth.male");
  if (normalized === "female") return t("das.auth.female");
  return "—";
});
onMounted(async () => (user.value = (await userGetInfo()).data || {}));
</script>
<style scoped>
.info-page {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #edf3e7;
  color: #17382d;
}
.info-body {
  width: min(100%, 760px);
  margin: auto;
  padding: 28px 28px 72px;
  flex: 1;
}
.info-body h2 {
  margin: 0 0 14px;
  font-size: 20px;
}
.field-card {
  position: relative;
  width: 100%;
  min-height: 100px;
  margin: 12px 0;
  padding: 23px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.95);
  border-radius: 23px;
  background: rgba(255, 255, 255, 0.68);
  box-shadow: 0 10px 24px rgba(20, 57, 44, 0.05);
  color: #17382d;
}
.field-card b {
  font-size: 16px;
}
.field-card span {
  color: #89918b;
  font-size: 15px;
}
.security-title {
  margin-top: 32px !important;
}
.security-card {
  border: 0;
  text-align: left;
}
.security-eye {
  position: absolute;
  right: 24px;
  top: 50%;
  width: 24px;
  height: 24px;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
}
.security-eye svg {
  width: 24px;
  height: 24px;
  stroke: #718078;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.info-footer {
  margin: 0;
  padding: 23px;
  text-align: center;
  background: #14392c;
  color: rgba(247, 245, 236, 0.58);
  font-size: 10px;
}
.info-page :deep(.das-page-head__title) {
  background: #edf3e7;
}
.info-page :deep(.das-page-head__title button) {
  border-radius: 50%;
  background: #e1e9df;
  font-size: 30px;
}
</style>
