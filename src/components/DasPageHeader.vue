<template>
  <div class="das-page-head">
    <HeaderTop />
    <div class="das-page-head__title">
      <button type="button" :aria-label="$t('das.common.back')" @click="goBack">
        <svg
          v-if="titleKey === 'das.page.terms'"
          class="reference-terms-back"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M2.1 8l5.4 5.4c.1.1.1.3 0 .5l-.5.5c-.1.1-.3.1-.5 0L.7 8.5c-.3-.3-.3-.7 0-.9l5.9-5.9c.1-.1.3-.1.5 0l.5.5c.1.1.1.3 0 .5L2.1 8z"
          />
        </svg>
        <svg
          v-else
          class="reference-back-arrow"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      <h1>{{ $t(titleKey) }}</h1>
      <span aria-hidden="true"></span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import HeaderTop from "@/components/HeaderTop.vue";
import { safeBack } from "@/utils/navigation";
const props = defineProps({
  titleKey: { type: String, required: true },
  backTo: { type: String, default: "/my" },
  backHandler: { type: Function, default: null },
});
const router = useRouter();
const goBack = () =>
  props.backHandler ? props.backHandler() : safeBack(router, props.backTo);
</script>

<style scoped>
.das-page-head {
  background: #eef2ea;
  color: #fff;
}
.das-page-head__title {
  min-height: 55px;
  padding: 5px 16px;
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  border-bottom: 1px solid rgba(42, 69, 112, 0.38);
  background: #eef2ea;
  color: #fff;
}
.das-page-head__title button {
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  border: 1px solid rgba(34, 82, 157, 0.42);
  border-radius: 50%;
  background: #ffffff;
  color: #6e817d;
  font-size: 30px;
  font-weight: 300;
  line-height: 1;
  cursor: pointer;
}
.das-page-head__title button img {
  width: 40px;
  height: 40px;
  display: block;
  object-fit: contain;
}
.das-page-head__title h1 {
  margin: 0;
  text-align: center;
  font-size: 18px;
  line-height: 1.15;
  font-weight: 750;
}
.das-page-head__title span {
  display: block;
}
</style>
