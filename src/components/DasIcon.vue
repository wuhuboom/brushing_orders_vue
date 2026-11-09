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
import about from "/design500/support.png";
import activity from "/design500/activity.png";
import ai from "@/static/brain/ai.png";
import bell from "/design500/bell.png";
import certificate from "/design500/certificate.png";
import creative from "@/static/brain/creative.png";
import deposit from "/design500/deposit.png";
import faq from "/design500/faq.png";
import globe from "/design500/globe.png";
import intelligence from "@/static/brain/intelligence.png";
import income from "@/static/brain/income-guide.png";
import vipcenter from "/design500/vipcenter.png";
import logout from "/design500/logout.png";
import media from "@/static/brain/media.png";
import retention from "@/static/brain/retention.png";
import retention1 from "@/static/brain/retention-alt.png";
import terms from "/design500/terms.png";
import user from "/design500/user.png";
import vipAccent from "@/static/brain/vip-accent.png";
import vip from "@/static/brain/vip.png";
import wallet from "/design500/wallet.png";
import withdraw from "/design500/withdraw.png";
import profileDeposit from "/design500/plus.png";
import profileWithdraw from "/design500/exit.png";

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
