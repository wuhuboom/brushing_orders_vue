<template>
  <DmkH5Layout class="dmk-mobile-current">
    <div class="w-full">
      <div class="w-full py-10">
        <div class="w-full text-white grid grid-cols-1 gap-4">
          <div class="col-span-1">
            <div class="w-[90%] mx-auto">
              <img class="w-full" src="/dmk/assets/a9.png" alt="" />
              <div class="w-full rounded-full cursor-pointer mt-8 py-3 bg-[var(--main-color)] text-black text-base text-center" @click="startWork">{{ $t("das.dmk.startWork") }}</div>
            </div>
          </div>
          <div class="col-span-1"><div class="w-[90%] mx-auto"><img class="w-full mx-auto" src="/dmk/assets/a1.png" alt="" /></div></div>
        </div>
        <div class="w-full bg-white text-black mt-4 p-10 px-4">
          <img class="w-full" src="/dmk/assets/a10.png" alt="" />
          <img class="w-full mt-4" src="/dmk/assets/a3.png" alt="" />
          <img class="w-full mt-4" src="/dmk/assets/a4.png" alt="" />
          <img class="w-full mt-4" src="/dmk/assets/a5.png" alt="" />
        </div>
        <div class="w-full bg-[var(--main-color)] text-black py-10 px-4">
          <img class="w-full" src="/dmk/assets/a11.png" alt="" />
          <img class="w-full mt-4" src="/dmk/assets/a12.png" alt="" />
          <img class="w-full mt-8" src="/dmk/assets/a7.png" alt="" />
        </div>
      </div>
    </div>
  </DmkH5Layout>
</template>
<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { safePush } from "@/utils/navigation";
import DmkH5Layout from "./DmkH5Layout.vue";
const router = useRouter();
const store = useUserStore();
const startWork = () => safePush(router, store.token ? "/starting" : "/account/login");
</script>
