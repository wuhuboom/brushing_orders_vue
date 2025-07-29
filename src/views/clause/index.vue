<template>
  <div class="w-full min-h-[100vh] bg-[#f4f4f5]">
    <div class="container w-full min-h-[100vh] bg-white">
      <van-nav-bar
        :title="$t('条款')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="w-full p-6 box-border flex flex-col font-montserrat text-[#333]">
        <p>条款和条件</p>
        <p>1）要优化和重置您的账户，您必须先完成所有评级，最低金额为50美元，最低账户重置金额为100美元。</p>
      </div>
    </div>
  </div>
</template>
<script setup>

const onClickLeft = () => history.back();
</script>
