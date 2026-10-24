<template>
  <div class="das-page-head">
    <HeaderTop />
    <div class="das-page-head__title">
      <button type="button" :aria-label="$t('das.common.back')" @click="goBack">
        <img class="psy-page-back" src="/psybir/back.png" alt="" />
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
