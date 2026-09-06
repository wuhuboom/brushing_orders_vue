<template>
  <footer class="nsg-footer">
    <div class="nsg-footer-grid">
      <div class="nsg-footer-brand">
        <img src="/nsg16/logo.png" alt="" />
        <p>{{ $t("das.dmk.footerCopy") }}</p>
      </div>
      <nav v-if="isAuthenticated" class="nsg-footer-navigation">
        <div>
          <button v-for="item in navigation" :key="item.path" type="button" @click="safePush(router, item.path)">{{ $t(item.labelKey) }}</button>
        </div>
        <div>
          <button v-for="item in links" :key="item.labelKey" type="button" @click="openLink(item)">{{ $t(item.labelKey) }}<span aria-hidden="true">↗</span></button>
        </div>
      </nav>
      <section v-else class="nsg-footer-contact" :aria-label="publicContact.title">
        <h2>{{ publicContact.title }}</h2>
        <div v-for="item in publicContact.items" :key="item.label"><p>{{ item.label }}</p><p>{{ item.value }}</p></div>
      </section>
      <div class="nsg-footer-countries">
        <img src="/nsg16/flags.png" alt="" />
        <p v-if="isAuthenticated">{{ supportEmail }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { safePush } from "@/utils/navigation";
import { openCustomerServiceDialog } from "@/utils/customerServiceDialog";

const router = useRouter();
const userStore = useUserStore();
const isAuthenticated = computed(() => Boolean(userStore.token));
const supportEmail = computed(() => window.g?.PUBLIC_CONTACT?.email || "");
const publicContact = computed(() => {
  const config = window.g?.PUBLIC_CONTACT || {};
  return {
    title: config.title || "Contact Us",
    items: [
      // {
      //   label: config.whatsappLabel || "WhatsApp",
      //   value: config.whatsapp || "+1 111 111 1111",
      // },
      {
        label: config.telLabel,
        value: config.tel ,
      },
      {
        label: config.emailLabel,
        value: config.email ,
      },
      {
        label: config.headOfficeLabel ,
        value:
          config.headOffice,
      },
    ],
  };
});
const navigation = [
  { labelKey: "das.nav.home", path: "/" },
  { labelKey: "das.dmk.payPerClick", path: "/ppc" },
  { labelKey: "das.dmk.webDesign", path: "/web" },
  { labelKey: "das.dmk.seo", path: "/seo" },
];
const links = [
  { labelKey: "das.dmk.about", path: "/about" },
  { labelKey: "das.home.terms", path: "/clause" },
  { labelKey: "das.home.faqs", path: "/faqs" },
  { labelKey: "das.dmk.customerSupport", action: "support" },
];
const openLink = (item) => {
  if (item.action === "support") {
    openCustomerServiceDialog();
    return;
  }
  safePush(router, item.path);
};
</script>

<style>
html #app .nsg-footer { border-top: 1px solid #303033; background: #000; color: #b9b6d0; }
html #app .nsg-footer-grid { box-sizing: border-box; display: grid; grid-template-columns: 220px minmax(0, 1fr) 270px; gap: 50px; width: min(1216px, calc(100% - 48px)); margin: 0 auto; padding: 70px 0 55px; font: 16px/1.35 "DM Sans", Arial, sans-serif; }
html #app .nsg-footer-brand > img { display: block; width: 114px; height: auto; margin-bottom: 35px; }
html #app .nsg-footer-brand > p { margin: 0; color: #a09caf; }
html #app .nsg-footer-navigation { padding-top: 20px; min-width: 0; }
html #app .nsg-footer-navigation > div { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 22px; align-items: start; }
html #app .nsg-footer-navigation > div + div { margin-top: 38px; }
html #app .nsg-footer-navigation button { padding: 0; border: 0; background: none; color: #d2cfe5; font: inherit; text-align: left; cursor: pointer; overflow-wrap: anywhere; }
html #app .nsg-footer-navigation > div + div button { color: #aea7cc; }
html #app .nsg-footer-navigation button > span { margin-left: 12px; font-size: 14px; }
html #app .nsg-footer-countries { min-width: 0; padding-top: 18px; }
html #app .nsg-footer-countries img { display: block; width: 100%; height: auto; }
html #app .nsg-footer-countries p { margin: 20px 0 0; color: #9993aa; font-size: 14px; text-align: right; overflow-wrap: anywhere; }
html #app .nsg-footer-contact { min-width: 0; }
html #app .nsg-footer-contact h2 { margin: 18px 0 20px; font-size: 20px; }
html #app .nsg-footer-contact p { margin: 4px 0; overflow-wrap: anywhere; }
html #app .nsg-footer-contact > div { display: grid; grid-template-columns: 94px minmax(0, 1fr); gap: 14px; margin-top: 16px; align-items: baseline; }
html #app .nsg-footer-contact > div > p:first-child { color: #8e95b0; font-size: 14px; }
html #app .nsg-footer-contact > div > p:last-child { margin: 0; line-height: 1.6; }
html #app .nsg-footer { height: auto; overflow: visible; }
@media (max-width: 1200px) and (min-width: 1024px) {
  html #app .nsg-footer-grid { grid-template-columns: 180px minmax(0, 1fr) 220px; gap: 28px; font-size: 14px; }
  html #app .nsg-footer-navigation > div { gap: 12px; }
}
@media (max-width: 1023px) {
  html #app .nsg-footer-grid { grid-template-columns: 1fr; width: calc(100% - 40px); padding: 32px 0; gap: 28px; font-size: 14px; }
  html #app .nsg-footer-brand > img { width: 90px; margin-bottom: 20px; }
  html #app .nsg-footer-navigation { padding: 0; }
  html #app .nsg-footer-navigation > div { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
  html #app .nsg-footer-navigation > div + div { margin-top: 20px; }
  html #app .nsg-footer-countries { width: 240px; max-width: 100%; margin: auto; padding: 0; }
  html #app .nsg-footer-countries p { text-align: center; }
}
</style>
