<template>
  <footer class="w-full bg-black text-white">
    <div class="w-full px-4 lg:px-0 lg:max-w-[1200px] py-10 mx-auto">
      <div class="w-full lg:flex lg:justify-between lg:items-center">
        <div class="w-full lg:w-[660px]">
          <img class="w-20" src="/dmk/assets/logo.png" alt="" />
          <div class="mt-2 text-base text-[#979797]">
            {{ $t("das.dmk.footerCopy") }}
          </div>
        </div>
        <div class="w-full mt-4 lg:mt-0 lg:w-[480px] overflow-hidden">
          <div class="w-[95%] mx-auto">
            <DmkFlagCarousel
              asset-base="/dmk/assets"
              :image-width="150"
              :mobile-image-width="104"
            />
          </div>
        </div>
      </div>
      <div v-if="isAuthenticated">
        <div
          class="w-full px-4 lg:px-0 grid grid-cols-2 lg:grid-cols-5 gap-4 lg:mt-10 text-lg"
        >
          <button
            v-for="item in navigation"
            :key="item.path"
            type="button"
            class="col-span-1 text-left cursor-pointer"
            @click="safePush(router, item.path)"
          >
            {{ $t(item.labelKey) }}
          </button>
          <div class="col-span-1">{{ supportEmail }}</div>
        </div>
        <div
          class="w-full px-4 lg:px-0 grid grid-cols-2 lg:grid-cols-5 gap-4 mt-10 text-lg text-[var(--main-color)]"
        >
          <button
            v-for="item in links"
            :key="item.labelKey"
            type="button"
            class="col-span-1 cursor-pointer flex justify-start items-center text-left"
            @click="openLink(item)"
          >
            <span>{{ $t(item.labelKey) }}</span>
            <img class="w-5 ml-6" src="/dmk/assets/lv_xie.png" alt="" />
          </button>
        </div>
      </div>
      <section
        v-else
        class="dmk-public-contact"
        :aria-label="publicContact.title"
      >
        <h2>{{ publicContact.title }}</h2>
        <div class="dmk-public-contact-grid">
          <div v-for="item in publicContact.items" :key="item.label">
            <p class="dmk-public-contact-label">{{ item.label }}</p>
            <p class="dmk-public-contact-value">{{ item.value }}</p>
          </div>
        </div>
      </section>
      <div class="mt-5 text-center lg:text-left">
        <div class="text-sm">
          {{ $t("das.dmk.madeWith") }} <span class="text-[red] ml-2">♥</span>
        </div>
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
import DmkFlagCarousel from "./DmkFlagCarousel.vue";

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

<style scoped>
.dmk-public-contact {
  margin-top: 36px;
  /*padding: 30px 28px 34px;
  border: 1px solid #262626;
  background: #151515;*/
}

.dmk-public-contact h2 {
  margin: 0 0 28px;
  color: #fff;
  font-size: 24px;
  font-weight: 600;
}

.dmk-public-contact-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 42px;
}

.dmk-public-contact-label {
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #292929;
  color: var(--main-color);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.dmk-public-contact-value {
  margin: 25px 0 0;
  color: #e7e7e7;
  font-size: 18px;
  line-height: 1.55;
  overflow-wrap: anywhere;
}

@media (max-width: 1023px) {
  .dmk-public-contact {
    margin: 28px 16px 0;
    padding: 24px 20px 28px;
  }

  .dmk-public-contact h2 {
    margin-bottom: 22px;
    font-size: 22px;
  }

  .dmk-public-contact-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .dmk-public-contact-value {
    margin-top: 14px;
    font-size: 16px;
  }
}
</style>
