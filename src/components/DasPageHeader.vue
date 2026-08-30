<template>
  <div class="das-page-head">
    <HeaderTop />
    <div class="das-page-head__title">
      <button
        type="button"
        :aria-label="$t('das.common.back')"
        @click="goBack"
      >
        <img :src="backIcon" alt="" />
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
import backIcon from "@/static/brain/back.png";
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
  background: #020717;
  color: #fff;
}
.das-page-head__title {
  min-height: 55px;
  padding: 5px 16px;
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  border-bottom: 1px solid rgba(42, 69, 112, 0.38);
  background: #030817;
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
  background: #081226;
  color: #0aa9ff;
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
