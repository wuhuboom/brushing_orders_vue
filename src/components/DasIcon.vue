<template>
  <img
    class="das-icon"
    :data-icon="name"
    :src="iconSource"
    alt=""
    aria-hidden="true"
    draggable="false"
  />
</template>

<script setup>
import { computed } from "vue";
import about from "@/static/amplava/quick-support.png";
import activity from "@/static/amplava/quick-activity.png";
import ai from "@/static/das/icons/ai.png";
import bell from "@/static/amplava/bell.png";
import certificate from "@/static/amplava/quick-certificate.png";
import creative from "@/static/das/icons/creative.png";
import deposit from "@/static/amplava/deposit.png";
import faq from "@/static/amplava/quick-faq.png";
import globe from "@/static/amplava/globe.png";
import intelligence from "@/static/das/icons/intelligence.png";
import logout from "@/static/amplava/logout.png";
import media from "@/static/das/icons/media.png";
import retention from "@/static/amplava/task-commission.png";
import retention1 from "@/static/amplava/task-frozen.png";
import terms from "@/static/amplava/quick-terms.png";
import user from "@/static/amplava/user.png";
import vipAccent from "@/static/das/icons/vip-accent.png";
import vip from "@/static/amplava/quick-vip.png";
import wallet from "@/static/amplava/wallet.png";
import withdraw from "@/static/amplava/withdraw.png";

const props = defineProps({
  name: { type: String, required: true },
});

const iconMap = {
  about,
  activity,
  ai,
  bell,
  certificate,
  creative,
  deposit,
  faq,
  globe,
  intelligence,
  logout,
  media,
  retention,
  retention1,
  terms,
  user,
  "vip-accent": vipAccent,
  vip,
  wallet,
  withdraw,
};

const iconSource = computed(() => iconMap[props.name] || iconMap.about || "");
</script>

<style scoped>
.das-icon {
  width: 34px;
  height: 34px;
  display: block;
  object-fit: contain;
  object-position: center;
  user-select: none;
  pointer-events: none;
}
</style>
