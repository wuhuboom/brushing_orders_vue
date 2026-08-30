<template>
  <main class="das-page info-page account-info-page">
    <DasPageHeader title-key="das.page.accountInfo" />
    <section class="account-info-body">
      <section class="account-info-panel account-info-panel--profile">
        <h2 class="account-info-panel__title">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="7" r="4" />
            <path d="M4.5 20v-1.4a7.5 7.5 0 0 1 15 0V20z" />
          </svg>
          <span>{{ $t("das.profile.myProfile") }}</span>
        </h2>

        <div class="account-info-fields">
          <div class="account-info-field">
            <b>{{ $t("das.profile.username") }}</b>
            <span>{{ user.username || "—" }}</span>
          </div>
          <div class="account-info-field">
            <b>{{ $t("das.profile.mobileNo") }}</b>
            <span>{{ user.phoneNumber || user.phone || "—" }}</span>
          </div>
          <div class="account-info-field">
            <b>{{ $t("das.profile.gender") }}</b>
            <span>{{ gender }}</span>
          </div>
        </div>
      </section>

      <section class="account-info-panel account-info-panel--security">
        <h2 class="account-info-panel__title">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3 5.5 5.5v5.9c0 4.3 2.7 7.6 6.5 9.6 3.8-2 6.5-5.3 6.5-9.6V5.5z"
            />
          </svg>
          <span>{{ $t("das.page.security") }}</span>
        </h2>

        <div class="account-info-fields account-info-fields--security">
          <button
            class="account-info-field account-info-security-field"
            type="button"
            @click="safePush(router, '/updatePassword')"
          >
            <b>{{ $t("das.page.loginPassword") }}</b>
            <span>••••••••</span>
            <span class="account-info-eye" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 9.5c1.9 2.2 4.6 3.4 8 3.4s6.1-1.2 8-3.4" />
                <path
                  d="m7.2 12.1-1.4 2.1M10.2 12.8l-.5 2.4M13.8 12.8l.5 2.4M16.8 12.1l1.4 2.1"
                />
              </svg>
            </span>
          </button>
          <button
            class="account-info-field account-info-security-field"
            type="button"
            @click="safePush(router, '/updateTransactionPassword')"
          >
            <b>{{ $t("das.page.fundPassword") }}</b>
            <span>••••••••</span>
            <span class="account-info-eye" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 9.5c1.9 2.2 4.6 3.4 8 3.4s6.1-1.2 8-3.4" />
                <path
                  d="m7.2 12.1-1.4 2.1M10.2 12.8l-.5 2.4M13.8 12.8l.5 2.4M16.8 12.1l1.4 2.1"
                />
              </svg>
            </span>
          </button>
        </div>
      </section>
    </section>
    <p class="account-info-footer">{{ $t("das.common.copyright") }}</p>
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
.account-info-page {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(
      ellipse at 24% 100%,
      rgba(0, 158, 255, 0.2),
      transparent 17%
    ),
    #040713 !important;
  color: #f1f2f6;
}

.account-info-body {
  width: min(100%, 760px);
  margin: 0 auto;
  padding: 15px 16px 21px;
  flex: 1;
}

.account-info-panel {
  width: 100%;
  overflow: hidden;
  border: 1px solid #343743;
  border-left-width: 4px;
  border-radius: 7px;
  background: #11141f;
}

.account-info-panel--profile {
  min-height: 317px;
  border-left-color: #13ccd5;
}

.account-info-panel--security {
  min-height: 237px;
  margin-top: 28px;
  border-left-color: #ffb52e;
}

.account-info-panel__title {
  height: 72px;
  margin: 0;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 7px;
  color: #12ced8;
  font-size: 14px;
  line-height: 1;
  font-weight: 500;
}

.account-info-panel--security .account-info-panel__title {
  color: #ffb52e;
}

.account-info-panel__title svg {
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.account-info-fields {
  padding: 0 20px;
}

.account-info-field {
  width: 100%;
  min-height: 79px;
  padding: 24px 0 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  border: 0;
  border-bottom: 1px solid #1d202a;
  border-radius: 0;
  background: transparent;
  color: #eff0f4;
  text-align: left;
}

.account-info-field:last-child {
  border-bottom: 0;
}

.account-info-field b {
  color: #c8c9d2;
  font-size: 12px;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}

.account-info-field > span:not(.account-info-eye) {
  color: #e8e9ed;
  font-size: 16px;
  line-height: 1.25;
  font-weight: 400;
}

.account-info-panel--profile .account-info-field:first-child {
  min-height: 65px;
  padding-top: 11px;
  padding-bottom: 10px;
}

.account-info-panel--profile .account-info-field:last-child {
  min-height: 99px;
}

.account-info-fields--security {
  padding-top: 0;
}

.account-info-security-field {
  position: relative;
  min-height: 98px;
  padding: 24px 46px 10px 0;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.account-info-security-field:first-child {
  min-height: 65px;
  padding-top: 8px;
  padding-bottom: 8px;
}

.account-info-security-field:focus-visible {
  outline: 1px solid #1ba7ff;
  outline-offset: -1px;
}

.account-info-security-field .account-info-eye {
  position: absolute;
  right: 2px;
  top: 50%;
  width: 22px;
  height: 22px;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
}

.account-info-eye svg {
  width: 21px;
  height: 21px;
  stroke: #777e8e;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.account-info-footer {
  min-height: 83px;
  margin: 0;
  padding: 0 16px;
  display: grid;
  place-items: center;
  background: rgba(8, 11, 28, 0.84);
  color: #8b93a5;
  text-align: center;
  font-size: 10px;
  line-height: 1.2;
}

.account-info-page :deep(.das-page-head__title) {
  background: #040713;
}

@media (min-width: 760px) {
  .account-info-body {
    padding-left: 24px;
    padding-right: 24px;
  }
}

@media (max-width: 359px) {
  .account-info-body {
    padding-left: 12px;
    padding-right: 12px;
  }

  .account-info-panel__title,
  .account-info-fields {
    padding-left: 17px;
    padding-right: 17px;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .account-info-security-field {
    transition: background-color 0.16s ease;
  }

  .account-info-security-field:active {
    background: rgba(12, 101, 213, 0.09);
  }
}

.account-info-fields,
.account-info-field {
  box-shadow: none;
}
</style>
