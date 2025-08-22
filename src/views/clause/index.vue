<template>
  <div class="term w-full min-h-[100vh] bg-[#f3f3f3]">
    <div class="container w-full min-h-[100vh] ">
      <van-nav-bar
        :title="$t('条款')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
      <!-- <div class="w-full mt-10 p-6 box-border flex flex-col font-montserrat text-[#333]"> -->
        <div class="mt-10" v-html="termsEn"></div>
      <!-- </div> -->
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getGlobalConfig} from "../../api/apis"
const termsEn = ref('')
const getGetGlobalConfig = async() =>{
    let res = await getGlobalConfig();
    // termsEn.value = res.data.termsEn
    let html = res.data.termsEn || ""
    // 1. 分组：把一级标题及其子条目包进 block
    html = html.replace(/(<p>\d+\)[\s\S]*?)(?=<p>\d+\)|$)/g, '<div class="block">$1</div>')

    // 2. 给一级标题 <p> 加 class
    html = html.replace(/<p>(\d+\))/g, '<p class="titles">$1')

    // 3. 去掉空段落（<p>&nbsp;</p> 或 <p><br></p> 之类）
    html = html.replace(/<p>(?:&nbsp;|<br\s*\/?>|\s)*<\/p>/g, '')
      termsEn.value = html
}
onMounted(() =>{
    getGetGlobalConfig();
})

const onClickLeft = () => history.back();
</script>
<style>
.term p{
  padding: 10px;

}
.titles {
  color: #206645;       /* 一级标题的颜色 */
}
.block {
  background: #fff;
  margin-bottom: 10px;
  border-left: 4px solid #206645;
  font-family: AppleSystemUIFont;
  font-size: 15px;
  padding: 15px 0;
}
.block p {
  padding: 0 5px 5px; 
  line-height: 25px;
}
</style>
