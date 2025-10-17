<template>
    <van-sticky type="primary">
      <div
        class="w-full flex justify-between shadow-md items-center p-2 py-4 box-border bg-[#000]"
      >
        <div class="w-[60%]" @click="jump">
          <img class="w-full" src="@/static/images/logo1.png" alt="" />
        </div>
        <div class="flex justify-start items-center">
          <div
          @click="customer"
            class="text-white bg-[var(--main-color)] mr-2 text-xs px-3 py-1 rounded-full"
          >
            {{ $t("联系") }}
          </div>
          <!-- <img
            src="@/static/images/me.png"
            class="w-[2.4rem]"
            alt=""
            @click="toMy"
          /> -->
          <!-- 接口还没返回 avatar 字段（请求中） -->
              <div
                v-if="userStore.userInfo.avatar === undefined"
                 @click="toMy"
                class="w-[32px] h-[32px] mx-auto  rounded-full bg-gray-200 animate-pulse"
              ></div>

              <!-- 接口返回 null / 空字符串 → 直接显示默认头像（不会闪） -->
              <img
                v-else-if="!userStore.userInfo.avatar"
                :src="userImg"
                 @click="toMy"
                class="w-[32px] h-[32px] mx-auto  rounded-full object-cover"
                alt=""
              />

              <!-- 接口返回头像 URL → 直接渲染用户头像；加载失败再回退到默认头像 -->
              <img
                v-else
                :src="userStore.userInfo.avatar"
                class="w-[32px] h-[32px] mx-auto  rounded-full  object-cover"
                alt=""
                 @click="toMy"
                @error="e => e.target.src = userImg"
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
import { useUserStore } from "@/store/modules/user";
const userImg = new URL("@/static/images/userImg.png", import.meta.url).href;
const userStore = useUserStore();


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
onMounted(() => {
  // userStore.getUserInfo();
  console.log(userStore.userInfo)
})
</script>