<template>
  <main class="das-page account-info-page">
    <DasPageHeader title-key="das.page.accountInfo" />
    <div class="account-info-page__scroll">
      <section class="account-info-section">
        <h2>{{ $t("das.profile.myProfile") }}</h2>
        <div class="account-info-field account-info-field--readonly">
          <strong>{{ $t("das.profile.mobileNo") }}</strong
          ><span>{{ user.phoneNumber || user.phone || "—" }}</span>
        </div>
        <div class="account-info-field account-info-field--readonly">
          <strong>{{ $t("das.profile.username") }}</strong
          ><span>{{ user.username || "—" }}</span>
        </div>
        <div class="account-info-field account-info-gender">
          <strong>{{ $t("das.profile.gender") }}</strong>
          <span class="account-info-gender-value">{{ gender }}</span>
        </div>
      </section>
      <section class="account-info-actions">
        <h2>{{ $t("das.page.security") }}</h2>
        <button
          class="account-info-action"
          type="button"
          @click="safePush(router, '/updatePassword')"
        >
          <span>{{ $t("das.page.loginPassword") }}<small>••••••••</small></span
          ><i aria-hidden="true"></i>
        </button>
        <button
          class="account-info-action"
          type="button"
          @click="safePush(router, '/updateTransactionPassword')"
        >
          <span>{{ $t("das.page.fundPassword") }}<small>••••••••</small></span
          ><i aria-hidden="true"></i>
        </button>
      </section>
    </div>
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
