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
        <div class="col-span-1">support@swcpartnership.online</div>
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
      <div class="mt-5 text-center lg:text-left">
        <div class="text-sm">
          {{ $t("das.dmk.madeWith") }} <span class="text-[red] ml-2">♥</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useRouter } from "vue-router";
import { safePush } from "@/utils/navigation";
import { openCustomerServiceDialog } from "@/utils/customerServiceDialog";
import DmkFlagCarousel from "./DmkFlagCarousel.vue";

const router = useRouter();
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
