<template>
  <img
    class="das-icon"
    :src="iconSource"
    alt=""
    aria-hidden="true"
    draggable="false"
  />
</template>

<script setup>
import { computed } from "vue";
import about from "@/static/das/icons/about.png";
import activity from "@/static/das/icons/activity.png";
import bell from "@/static/das/icons/bell.png";
import certificate from "@/static/das/icons/certificate.png";
import creative from "@/static/das/icons/creative.png";
import deposit from "@/static/das/icons/deposit.png";
import faq from "@/static/das/icons/faq.png";
import globe from "@/static/das/icons/globe.png";
import intelligence from "@/static/das/icons/intelligence.png";
import logout from "@/static/das/icons/logout.png";
import media from "@/static/das/icons/media.png";
import retention from "@/static/das/icons/retention.png";
import retention1 from "@/static/das/icons/retention1.png";
import terms from "@/static/das/icons/terms.png";
import user from "@/static/das/icons/user.png";
import vipAccent from "@/static/das/icons/vip-accent.png";
import vip from "@/static/das/icons/vip.png";
import wallet from "@/static/das/icons/wallet.png";
import withdraw from "@/static/das/icons/withdraw.png";

const props = defineProps({
  name: { type: String, required: true },
});

const iconMap = {
  about,
  activity,
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
