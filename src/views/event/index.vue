<template>
  <div class="w-full min-h-[100vh] bg-[#f4f4f5]">
     <van-nav-bar
        :title="$t('收入指南')"
        fixed
        left-arrow
        @click-left="onClickLeft"
    />
    <div class="w-full p-6 box-border flex flex-col font-montserrat text-[#333]">
        <img src="https://bigwnew.oss-ap-northeast-1.aliyuncs.com/msr/175173037522231456.jpg" alt="">
    </div>
  </div>
</template>
<script setup>

const onClickLeft = () => history.back();
</script>
