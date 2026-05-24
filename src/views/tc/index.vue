<template>
  <div class="terms-page">
    <PageTopBar :title="$t('terms_and_conditions')" show-back @click-left="onClickLeft" />

    <main class="terms-content">
      <p v-for="item in termsItems" :key="item">{{ item }}</p>
    </main>
  </div>
</template>

<script setup>
import PageTopBar from "@/components/PageTopBar.vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const termsItems = computed(() => Array.from({ length: 10 }, (_, index) => t(`terms_p${index + 1}`)));
const onClickLeft = () => {
  history.back();
};
</script>

<style scoped>
.terms-page {
  min-height: 100vh;
  background: #eef2f8;
  color: #050505;
  font-family: inherit;
}

.terms-content {
  padding: 20px 20px 30px;
}

.terms-content p {
  margin: 0 0 30px;
  font-size: 15px;
  line-height: 1.27;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.terms-content p:nth-child(1) { margin-bottom: 24px; }
.terms-content p:nth-child(2) { margin-bottom: 52px; }
.terms-content p:nth-child(3) { margin-bottom: 34px; }
.terms-content p:nth-child(4) { margin-bottom: 34px; }
.terms-content p:nth-child(5) { margin-bottom: 34px; }
.terms-content p:nth-child(6) { margin-bottom: 34px; }
.terms-content p:nth-child(7) { margin-bottom: 34px; }
.terms-content p:nth-child(8) { margin-bottom: 34px; }
.terms-content p:nth-child(9) { margin-bottom: 34px; }
</style>
