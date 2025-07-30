<template>
  <div class="container w-full min-h-[100vh] bg-white">
    <van-sticky type="primary">
      <van-nav-bar
        :title="$t('更新密码')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>
    <div class="w-full pl-6 mt-6 pr-6 box-border flex flex-col">
      <div class="w-full mt-12 flex flex-col">
        <div class="w-full overflow-hidden bg-[#e8f7ec] py-2">
          <van-cell-group inset>
            <van-field
              label-width="150"
              v-model="value"
              :label="$t('旧密码')"
              placeholder="旧密码"
              input-align="right"
            />
          </van-cell-group>
        </div>
        <div class="w-full mt-2 overflow-hidden bg-[#e8f7ec] py-2">
          <van-cell-group inset>
            <van-field
              label-width="150"
              v-model="value"
              :label="$t('新密码')"
              placeholder="新密码"
              input-align="right"
            />
          </van-cell-group>
        </div>
        <div class="w-full mt-2 overflow-hidden bg-[#e8f7ec] py-2">
          <van-cell-group inset>
            <van-field
              label-width="150"
              v-model="value"
              :label="$t('确认密码')"
              placeholder="确认密码"
              input-align="right"
            />
          </van-cell-group>
        </div>
      </div>
      <div class="w-full mt-4">
        <van-button color="#007513" class="w-full">{{ $t("更新") }}</van-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
const onClickLeft = () => history.back();
</script>
