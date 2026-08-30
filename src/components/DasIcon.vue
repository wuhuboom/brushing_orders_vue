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
import about from "@/static/brain/about.png";
import activity from "@/static/brain/activity.png";
import ai from "@/static/brain/ai.png";
import bell from "@/static/brain/bell.png";
import certificate from "@/static/brain/certificate.png";
import creative from "@/static/brain/creative.png";
import deposit from "@/static/brain/deposit.png";
import faq from "@/static/brain/faq.png";
import globe from "@/static/brain/globe.png";
import intelligence from "@/static/brain/intelligence.png";
import income from "@/static/brain/income-guide.png";
import vipcenter from "@/static/brain/vipcenter.png";
import logout from "@/static/brain/logout.png";
import media from "@/static/brain/media.png";
import retention from "@/static/brain/retention.png";
import retention1 from "@/static/brain/retention-alt.png";
import terms from "@/static/brain/terms.png";
import user from "@/static/brain/user.png";
import vipAccent from "@/static/brain/vip-accent.png";
import vip from "@/static/brain/vip.png";
import wallet from "@/static/brain/wallet.png";
import withdraw from "@/static/brain/withdraw.png";
import profileDeposit from "@/static/brain/profile-deposit.png";
import profileWithdraw from "@/static/brain/profile-withdraw.png";

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
  vipcenter,
  income,
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
  "profile-deposit": profileDeposit,
  "profile-withdraw": profileWithdraw,
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
