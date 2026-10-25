<template>
  <div class="das-page-head">
    <HeaderTop />
    <div class="das-page-head__title">
      <button
        type="button"
        :aria-label="$t('das.common.back')"
        @click="goBack"
      >
        &lsaquo;
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
  background: #14392c;
  color: #f7f5ec;
}
.das-page-head__title {
  min-height: 76px;
  padding: 8px 30px;
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  background: #f7f5ec;
  color: #17382d;
}
.das-page-head__title button {
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 34px;
  font-weight: 300;
  line-height: 1;
}
.das-page-head__title h1 {
  margin: 0;
  text-align: center;
  font-size: 24px;
  line-height: 1.15;
  font-weight: 750;
}
.das-page-head__title span {
  display: block;
}
</style>
