<template>
  <div class="das-page-head">
    <div class="das-page-head__toolbar">
      <HeaderTop />
      <div class="das-page-head__title">
        <button type="button" :aria-label="$t('das.common.back')" @click="goBack">
          <WesterIcon class="wester-back-icon" name="back" />
        </button>
        <h1>{{ $t(titleKey) }}</h1>
        <span aria-hidden="true"></span>
      </div>
      <div v-if="$slots.actions" class="poetic-head-actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import HeaderTop from "@/components/HeaderTop.vue";
import WesterIcon from "@/components/WesterIcon.vue";
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
