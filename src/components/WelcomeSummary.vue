<template>
  <div>
    <van-dialog
    class="welcome-dialog"
    v-model:show="showCenter"
    :showConfirmButton="false"
	close-on-click-overlay
  >
	<div class="welcome-dialog-header">
		<van-icon name="close" class="close" size="22px" @click="close"/>
	</div>
    <div class="welcome-dialog-image-wrap">
      <img class="welcome-dialog-image" :src="url + info" alt="Welcome"/>
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

:deep(.welcome-dialog.van-dialog){
  display: flex;
  flex-direction: column;
  width: min(90vw, 560px);
  max-width: 560px;
  max-height: calc(100dvh - 32px);
  background-color: transparent;
  overflow: hidden;
}

.welcome-dialog-header {
  display: flex;
  flex: 0 0 auto;
  justify-content: flex-end;
  align-items: center;
  min-height: 36px;
  padding: 6px 10px;
  background: #fff;
  border-radius: 14px 14px 0 0;
}

.welcome-dialog-image-wrap {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  min-height: 0;
  overflow: hidden;
  background: #fff;
  border-radius: 0 0 14px 14px;
}

.welcome-dialog-image {
  display: block;
  width: 100%;
  height: auto;
  max-height: calc(100dvh - 68px);
  object-fit: contain;
}
</style>
