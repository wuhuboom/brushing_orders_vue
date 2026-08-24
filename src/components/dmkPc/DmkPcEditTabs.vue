<template>
  <div class="w-full max-w-[70%] mx-auto hidden lg:block">
    <div class="van-tabs van-tabs--line">
      <div class="van-tabs__wrap">
        <div
          class="van-tabs__nav van-tabs__nav--line"
          role="tablist"
          aria-orientation="horizontal"
          style="border-color: var(--main-color); background: transparent"
        >
          <div
            v-for="(tab, index) in tabs"
            :key="tab.key"
            :id="`dmk-edit-tab-${index}`"
            class="van-tab van-tab--line"
            :class="{ 'van-tab--active': active === tab.key }"
            role="tab"
            :aria-selected="active === tab.key"
            :tabindex="active === tab.key ? 0 : -1"
            :style="{ color: active === tab.key ? 'rgb(255, 255, 255)' : 'rgb(153, 153, 153)' }"
            @click="safePush(router, tab.path)"
          >
            <span class="van-tab__text van-tab__text--ellipsis">{{ $t(tab.label) }}</span>
          </div>
          <div
            class="van-tabs__line dmk-edit-tab-line"
            :style="{
              width: '50px',
              backgroundColor: 'var(--main-color)',
              left: `calc((100% / 3) * (${activeIndex} + 0.5))`,
              transform: 'translateX(-50%)',
              transitionDuration: '0.3s',
            }"
          ></div>
        </div>
      </div>
      <div class="van-tabs__content">
        <div class="van-tab__panel" role="tabpanel">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { safePush } from "@/utils/navigation";

const props = defineProps({
  active: { type: String, required: true },
});
const router = useRouter();
const tabs = [
  { key: "profile", label: "das.dmk.modifyPersonalInformation", path: "/profile" },
  { key: "transaction", label: "das.dmk.updateTransactionPassword", path: "/updateTransactionPassword" },
  { key: "login", label: "das.dmk.updateLoginPassword", path: "/updatePassword" },
];
const activeIndex = computed(() => Math.max(0, tabs.findIndex((tab) => tab.key === props.active)));
</script>

<style scoped>
.dmk-edit-tab-line {
  position: absolute;
  bottom: 15px;
}
</style>
