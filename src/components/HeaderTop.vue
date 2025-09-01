<template>
    <van-sticky type="primary">
      <div
        class="w-full flex justify-between shadow-md items-center px-4 py-2 box-border bg-white"
      >
        <div class="w-[var(--header-logo-width)]" @click="jump">
          <img class="w-[80px] h-[46px]" src="@/static/images/logo.png" alt="" />
        </div>
        <div class="flex justify-start items-center">
          <!-- <div
          @click="customer"
            class="text-white bg-[var(--main-color)] mr-2 text-xs px-3 py-1 rounded-full"
          >
            {{ $t("联系") }}
          </div> -->
          <img
            src="@/static/images/me.png"
            class="w-[32px]"
            alt=""
            @click="toMy"
          />
        </div>
      </div>
      <ContactUs ref="ContactUsRef"></ContactUs>
    </van-sticky>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import ContactUs from "@/components/ContactUs.vue";
const ContactUsRef = ref(null);

const customer = () => {
  ContactUsRef.value.open();
};
const router = useRouter();
const toMy = ()=>{
router.push({ path: "/my" });
}
const jump = () => {
  router.replace('/')
  
}
</script>