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
import about from "/westermedia/about-shortcut.png";
import activity from "/westermedia/activity-shortcut.png";
import ai from "@/static/brain/ai.png";
import bell from "/westermedia/notices.png";
import certificate from "/westermedia/certificate-shortcut.png";
import creative from "@/static/brain/creative.png";
import deposit from "/westermedia/deposit.png";
import faq from "/westermedia/faq-shortcut.png";
import globe from "/westermedia/language.png";
import intelligence from "@/static/brain/intelligence.png";
import income from "@/static/brain/income-guide.png";
import vipcenter from "/westermedia/vip-shortcut.png";
import logout from "/westermedia/logout.png";
import media from "@/static/brain/media.png";
import retention from "@/static/brain/retention.png";
import retention1 from "@/static/brain/retention-alt.png";
import terms from "/westermedia/terms-shortcut.png";
import user from "/westermedia/account.png";
import vipAccent from "@/static/brain/vip-accent.png";
import vip from "@/static/brain/vip.png";
import wallet from "/westermedia/wallet.png";
import withdraw from "/westermedia/withdraw.png";
import profileDeposit from "/westermedia/deposit.png";
import profileWithdraw from "/westermedia/withdraw.png";

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
  "wester-support": "/westermedia/support-shortcut.png",
  "profile-deposit": profileDeposit,
  "profile-withdraw": profileWithdraw,
};

const iconSource = computed(() => iconMap[props.name] || iconMap.about || "");
</script>
