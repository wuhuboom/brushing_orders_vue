<template>
  <div class="w-full min-h-[100vh] bg-[#ffff]">
    <div class="container w-full min-h-[100vh] bg-white">
      <van-nav-bar
        :title="$t('常见问题解答')"
        fixed
        left-arrow
        class="shadow"
        @click-left="onClickLeft"
      />
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getConfigByLang} from "../../api/apis"
import { useCommonStore } from '@/store/modules/common';
const faqEn = ref('')
const commonStore = useCommonStore();
const parLang = computed(() => {
  const mapped = commonStore.getValueByKey(commonStore.lang);
  return mapped ?? commonStore.lang; 
});
onMounted(() =>{
})

const onClickLeft = () => history.back();
</script>
