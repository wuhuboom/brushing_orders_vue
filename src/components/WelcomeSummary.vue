<template>
  <div>
    <van-dialog
    v-model:show="showCenter"
    :showConfirmButton="false"
	close-on-click-overlay
  >
	<div class="flex justify-end mr-2 head">
		<van-icon name="close" class="close" size="22px" @click="close"/>
	</div>
    <div class="flex flex-col rounded-xl overflow-hidden bg-white">
      <img :src="url + info"/>
    </div>
  </van-dialog>
  </div>
</template>
<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import { tr } from "element-plus/es/locales.mjs";
import { getSplashAdImage } from '../api/apis';
const url = window.g.VITE_API_IMG_URL;
const showCenter = ref(false);
const info = ref([])
// 更符合Vue3习惯的暴露方式
const open = async() =>{
  showCenter.value = true
  let res = await getSplashAdImage();
  info.value = res.data
}
const close = () => (showCenter.value = false);


defineExpose({
  open,
  close // 新增关闭方法
});
</script>

<style scoped>
.close{
	  color: #808080;
  }
:deep(.van-dialog){
  width: 90%;
  background-color: transparent;
}
</style>
