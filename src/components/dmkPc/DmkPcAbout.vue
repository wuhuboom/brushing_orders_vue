<template>
  <DmkPcLayout>
    <div class="dmk-site-scope">
      <div class="w-full">
        <div class="w-full max-w-[1200px] mx-auto py-10">
          <div class="w-full text-white grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="col-span-1 hidden lg:block">
              <div class="text-left text-lg pt-10">
                {{ $t("das.dmk.aboutEyebrow") }}
              </div>
              <div class="mt-10">
                <img src="/dmk/assets/a2.png" alt="" />
              </div>
              <div class="mt-10 text-lg">
                {{ $t("das.dmk.aboutLead") }}
              </div>
              <div
                class="w-full rounded-full mt-10 py-3 cursor-pointer bg-[var(--main-color)] text-black text-base text-center"
                @click="startWork"
              >
                {{ $t("das.dmk.startWork") }}
              </div>
            </div>
            <div class="col-span-1">
              <div class="w-[90%] mx-auto">
                <img
                  class="w-full lg:w-[420px] mx-auto"
                  src="/dmk/assets/a1.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div class="w-full text-black bg-white py-10 hidden lg:block">
          <div class="w-full max-w-[1200px] mx-auto">
            <div
              class="pt-10 pb-5 leading-tight w-[638px] mx-auto text-[44px] font-medium"
            >
              {{ $t("das.dmk.aboutHeadline") }}
            </div>
            <div class="text-lg w-[638px] mx-auto">
              {{ $t("das.dmk.aboutBody") }}
            </div>
            <div class="w-full mt-8 flex justify-between items-center">
              <img src="/dmk/assets/a3.png" alt="" /><img
                src="/dmk/assets/a4.png"
                alt=""
              /><img src="/dmk/assets/a5.png" alt="" />
            </div>
          </div>
        </div>
        <div
          class="w-full text-black bg-[var(--main-color)] py-10 hidden lg:block"
        >
          <div class="w-full max-w-[1200px] mx-auto">
            <img src="/dmk/assets/a8.png" alt="" /><img
              class="w-full mt-20"
              src="/dmk/assets/a7.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  </DmkPcLayout>
</template>
<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import DmkPcLayout from "./DmkPcLayout.vue";
import { safePush } from "@/utils/navigation";
const router = useRouter();
const store = useUserStore();
const startWork = () =>
  safePush(router, store.token ? "/starting" : "/account/login");
</script>
