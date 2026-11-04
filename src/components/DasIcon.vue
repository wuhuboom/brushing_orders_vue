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
import about from "/poetic/about.png";
import activity from "/poetic/activity.png";
import ai from "@/static/brain/ai.png";
import bell from "/poetic/bell.png";
import certificate from "/poetic/certificate.png";
import creative from "@/static/brain/creative.png";
import deposit from "@/static/psybir/deposit.png";
import faq from "/poetic/faq.png";
import globe from "/poetic/globe.png";
import intelligence from "@/static/brain/intelligence.png";
import income from "@/static/brain/income-guide.png";
import vipcenter from "/poetic/vipcenter.png";
import logout from "/poetic/logout.png";
import media from "@/static/brain/media.png";
import retention from "@/static/brain/retention.png";
import retention1 from "@/static/brain/retention-alt.png";
import terms from "/poetic/terms.png";
import user from "/poetic/user.png";
import vipAccent from "@/static/brain/vip-accent.png";
import vip from "@/static/brain/vip.png";
import wallet from "/poetic/wallet.png";
import withdraw from "@/static/psybir/withdraw.png";
import profileDeposit from "@/static/psybir/withdraw.png";
import profileWithdraw from "@/static/psybir/deposit.png";

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
