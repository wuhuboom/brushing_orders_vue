<template>
  <DmkPcLayout>
    <section class="nsg-salary-page nsg-salary-page--pc">
      <p class="salary-breadcrumb">
        {{ $t("das.dmk.profile") }} <span>›</span>
        <strong>{{ $t("das.dmk.salary") }}</strong>
      </p>
      <NsgSalaryContent :working-days="workingDays" :member-level="memberLevel" :milestones="milestones" />
    </section>
  </DmkPcLayout>

  <DmkH5Layout class="dmk-mobile-current">
    <div class="nsg-mobile-section-bar">
      <NsgBackButton decorative />
      <strong>{{ $t("das.dmk.salary") }}</strong>
      <i aria-hidden="true"></i>
    </div>
    <section class="nsg-salary-page nsg-salary-page--h5">
      <NsgSalaryContent mobile :working-days="workingDays" :member-level="memberLevel" :milestones="milestones" />
    </section>
  </DmkH5Layout>
</template>

<script setup>
import NsgBackButton from "@/components/dmk/NsgBackButton.vue";
import { computed, onMounted, ref } from "vue";
import { userGetInfo } from "@/api/apis";
import { useUserStore } from "@/store/modules/user";
import DmkPcLayout from "@/components/dmkPc/DmkPcLayout.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import NsgSalaryContent from "@/components/dmk/NsgSalaryContent.vue";

const store = useUserStore();
const user = ref(store.userInfo || {});

const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");
const numberValue = (...values) => {
  const value = Number(firstValue(...values));
  return Number.isFinite(value) ? value : 0;
};

const workingDays = computed(() =>
  numberValue(
    user.value.workingDays,
    user.value.workingDay,
    user.value.workDays,
    user.value.checkInDays,
    user.value.attendanceDays,
  ),
);
const memberLevel = computed(() =>
  Math.max(
    1,
    numberValue(
      user.value.level,
      user.value.levelId,
      user.value.vipId,
      user.value.userLevel?.level,
      user.value.memberLevel?.level,
    ),
  ),
);
const milestones = [
  { day: 2, amount: 120 },
  { day: 5, amount: 1300 },
  { day: 10, amount: 1600 },
  { day: 15, amount: 1900 },
  { day: 30, amount: 2500 },
];

onMounted(async () => {
  try {
    const response = await userGetInfo();
    const latest = response.data || {};
    user.value = latest;
    store.setUserInfo(latest);
  } catch (_) {}
});
</script>

<style scoped>
.nsg-salary-page { box-sizing: border-box; width: 100%; margin: 0 auto; background: #000; }
.nsg-salary-page--pc { max-width: 1280px; padding: 22px 32px 140px; }
.nsg-salary-page--h5 { padding: 12px 20px 140px; }
@media (max-width: 380px) {
  .nsg-salary-page--h5 { padding-inline: 16px; }
}
</style>
