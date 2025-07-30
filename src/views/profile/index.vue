<template>
  <div class="container w-full min-h-[100vh] bg-white">
    <van-sticky type="primary">
      <van-nav-bar
        :title="$t('修改信息')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>
    <div class="w-full pl-6 pr-6 mt-6 box-border flex flex-col">
      <div class="w-full flex flex-col">
        <div class="w-full flex flex-col items-center justify-center mt-20">
          <van-uploader v-model="fileList" reupload max-count="1" />
          <div class="text-[#666] text-sm mt-2 flex items-center">
            <div class="mr-1">点击更改</div>
            <van-icon name="edit" />
          </div>

           <div class="w-full mt-4">
                <van-button color="#007513" class="w-full">{{$t('更新')}}</van-button>
            </div>
        </div>
      </div>
    </div>
    
  </div>
</template>
<script setup>
import HeaderTop from "@/components/HeaderTop.vue";
import { onMounted, ref } from "vue";
const onClickLeft = () => history.back();
const fileList = ref([
  { url: "https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg" },
]);
</script>
