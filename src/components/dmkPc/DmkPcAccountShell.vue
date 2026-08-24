<template>
  <DmkPcLayout>
    <div class="dmk-site-scope">
      <div class="w-full max-w-[1200px] mx-auto flex flex-col pb-6">
        <div
          class="w-full mx-auto my-8 border-[1px] border-[#5f5f5f]"
          style="box-shadow: rgba(255, 255, 255, 0.2) 0px 2px 15px 2px"
        >
          <div class="w-full grid grid-cols-3 gap-0 text-white">
            <div
              class="col-span-1 text-center text-base border py-2 cursor-pointer"
              :class="active === 'personal' ? activeClass : inactiveClass"
              @click="safePush(router, '/my')"
            >
              {{ $t("das.dmk.personalProfile") }}
            </div>
            <div
              class="col-span-1 text-center text-base border py-2 cursor-pointer"
              :class="active === 'edit' ? activeClass : inactiveClass"
              @click="safePush(router, '/profile')"
            >
              {{ $t("das.dmk.editProfile") }}
            </div>
            <div
              class="col-span-1 text-center text-base border py-2 cursor-pointer"
              :class="active === 'deposit' ? activeClass : inactiveClass"
              @click="safePush(router, '/deposit')"
            >
              {{ $t("das.dmk.depositHistory") }}
            </div>
          </div>
          <div class="min-h-[300px] p-10 text-white">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </DmkPcLayout>
</template>

<script setup>
import { useRouter } from "vue-router";
import DmkPcLayout from "./DmkPcLayout.vue";
import { safePush } from "@/utils/navigation";

defineProps({
  active: { type: String, default: "" },
});

const router = useRouter();
const activeClass = "bg-[var(--main-color)] border-[var(--main-color)] text-black";
const inactiveClass = "border-[#858585]";
</script>
