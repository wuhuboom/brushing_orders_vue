<template>
  <DmkPcLayout :authenticated="authenticated">
    <main class="nsg-document-page">
      <nav v-if="title" class="nsg-document-breadcrumb" :class="{ 'is-registration': registration }">
        <template v-if="registration"><span>{{ $t("das.nav.home") }}</span><b>/</b></template>
        <span>{{ $t("das.dmk.profile") }}</span><b>/</b>
        <template v-if="registration"><span>{{ $t("das.auth.login") }}</span><b>/</b></template>
        <strong>{{ title }}</strong>
      </nav>
      <h1>{{ title }}</h1>
      <div v-if="loading" class="nsg-document-loading" role="status">{{ $t("das.common.loading") }}</div>
      <NsgRichDocument v-else :content="content" :registration="registration" />
    </main>
  </DmkPcLayout>
  <DmkH5Layout class="dmk-mobile-current" :authenticated="authenticated" :footer="false">
    <main class="nsg-document-mobile">
      <div class="nsg-mobile-section-bar">
        <NsgBackButton type="button" :aria-label="$t('das.common.back')" @click="safeBack(router, backFallback)" />
        <strong>{{ title }}</strong>
        <i aria-hidden="true"></i>
      </div>
      <div v-if="loading" class="nsg-document-loading" role="status">{{ $t("das.common.loading") }}</div>
      <NsgRichDocument v-else :content="content" :registration="registration || terms" />
    </main>
  </DmkH5Layout>
</template>
<script setup>
import NsgBackButton from "@/components/dmk/NsgBackButton.vue";
import { useRouter } from "vue-router";
import DmkPcLayout from "@/components/dmkPc/DmkPcLayout.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import NsgRichDocument from "./NsgRichDocument.vue";
import { safeBack } from "@/utils/navigation";
defineProps({
  content: { type: String, default: "" },
  loading: Boolean,
  authenticated: { type: Boolean, default: undefined },
  title: { type: String, default: "" },
  backFallback: { type: String, default: "/" },
  registration: Boolean,
  terms: Boolean,
});
const router = useRouter();
</script>
<style>
html #app .nsg-document-page {
  box-sizing: border-box;
  width: min(1216px, calc(100% - 48px));
  min-height: 65vh;
  margin: 0 auto;
  padding-bottom: 48px;
  background: #000;
}
html #app .nsg-document-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  min-height: 58px;
  padding: 12px 10px;
  background: #000;
  color: #8894ad;
  font: 13px/1.5 "DM Sans", Arial, sans-serif;
}
html #app .nsg-document-breadcrumb strong { color: #d0d1df; font-weight: 500; }
html #app .nsg-document-breadcrumb.is-registration { background: #070d19; }
html #app .nsg-document-page > h1 {
  margin: 34px 0;
  color: #d5d6ee;
  font: 600 24px/1.3 "DM Sans", Arial, sans-serif;
}
html #app .nsg-document-loading { padding: 48px 20px; text-align: center; color: #b6b4c7; }
html #app .nsg-document-mobile { background: #000; padding-bottom: 32px; }
html #app .nsg-document-mobile .nsg-rich-document { margin: 0 18px; }
html #app .nsg-document-mobile .nsg-mobile-section-bar { margin: 0 18px 18px; }
html #app .nsg-document-mobile .nsg-mobile-section-bar { display: grid; grid-template-columns: 40px minmax(0, 1fr) 40px; gap: 8px; min-height: 66px; padding: 6px 0; border: 0; }
html #app .nsg-document-mobile .nsg-mobile-section-bar strong { font-size: 16px; line-height: 1.3; text-align: center; }
html #app .nsg-document-mobile .nsg-mobile-section-bar button { display: grid; place-items: center; width: 40px; height: 40px; padding: 0; border: 1px solid #202329; border-radius: 12px; background: #0d0f10; color: #b6c0ce; }
</style>
