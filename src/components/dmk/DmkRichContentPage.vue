<template>
  <DmkPcLayout>
    <div class="dmk-site-scope">
      <div class="w-full dmk-rich-content-scope">
        <div class="w-full lg:bg-[#f0f0f0]">
          <div
            class="w-[95%] mx-auto pt-4 text-white lg:text-black cursor-pointer"
            @click="safeBack(router, '/')"
          >
            &lt;&lt; {{ $t("das.dmk.goBack") }}
          </div>
          <div
            class="w-full max-w-[1200px] mx-auto p-6 box-border flex flex-col font-montserrat text-[#fff] lg:text-black dmk-rich-content"
          >
            <div v-if="loading" class="py-20 text-center">
              {{ $t("das.common.loading") }}
            </div>
            <div v-else v-html="content"></div>
          </div>
        </div>
      </div>
    </div>
  </DmkPcLayout>
  <DmkH5Layout class="dmk-mobile-current" :authenticated="authenticated">
    <div class="w-full">
      <button
        type="button"
        class="w-[95%] block mx-auto pt-4 text-left text-white"
        @click="safeBack(router, '/')"
      >
        &lt;&lt; {{ $t("das.dmk.goBack") }}
      </button>
      <div v-if="loading" class="w-full p-6 text-white">
        {{ $t("das.common.loading") }}
      </div>
      <div
        v-else
        class="w-full p-6 box-border flex flex-col font-montserrat text-[#fff]"
        v-html="content"
      ></div>
    </div>
  </DmkH5Layout>
</template>
<script setup>
import { useRouter } from "vue-router";
import DmkPcLayout from "@/components/dmkPc/DmkPcLayout.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import { safeBack } from "@/utils/navigation";
defineProps({
  content: { type: String, default: "" },
  loading: Boolean,
  authenticated: { type: Boolean, default: undefined },
});
const router = useRouter();
</script>
<style scoped>
.dmk-rich-content :deep(h1) {
  font-size: 2em;
  font-weight: 700;
  margin: 0.67em 0;
}
.dmk-rich-content :deep(h2) {
  font-size: 1.5em;
  font-weight: 700;
  margin: 0.83em 0;
}
.dmk-rich-content :deep(h3) {
  font-size: 1.17em;
  font-weight: 700;
  margin: 1em 0;
}
.dmk-rich-content :deep(p) {
  margin: 1em 0;
  line-height: 1.5;
}
.dmk-rich-content :deep(ul),
.dmk-rich-content :deep(ol) {
  margin: 1em 0;
  padding-left: 2.5rem;
}
.dmk-rich-content :deep(ul) {
  list-style: disc;
}
.dmk-rich-content :deep(ol) {
  list-style: decimal;
}
.dmk-rich-content :deep(hr) {
  margin: 0.8em 0;
  border-top: 1px solid #ccc;
}
.dmk-rich-content :deep(strong) {
  font-weight: 700;
}
</style>
