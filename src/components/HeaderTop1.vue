<template>
    <van-sticky type="primary">
      <div
        class="w-full flex justify-between items-center py-5 px-5 box-border bg-white"
      >
        <div class="text-[22px] text-[#206645] font-bold" @click="jump">
            webworks
          <!-- <img class="w-full" src="@/static/images/logo.png" alt="" /> -->
        </div>
        <div class="flex justify-start items-center">
          <!-- <div
          @click="customer"
            class="text-white bg-[var(--main-color)] mr-2 text-xs px-3 py-1 rounded-full"
          >
            {{ $t("联系") }}
          </div> -->
          <img
            src="@/static/images/user2.png"
            class="w-[24px]"
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