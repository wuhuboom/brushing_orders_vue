<template>
  <div class="w-full bg-white min-h-[100vh] h-full withdraw">
    <van-sticky type="primary">
      <van-nav-bar
        :title="$t('提取')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>

    <div class="mt-10">
      <van-tabs
        color="#007513"
        title-active-color="#007513"
        v-model:active="active"
      >
        <van-tab :title="$t('提取')">
          <div class="p-4 box-border flex flex-col">
            <div
              class="flex flex-col justify-between p-4 box-border"
              :style="{
                background: `url(${bgImage}) 0 0 / 100% 100% no-repeat`,
              }"
            >
              <div class="text-white opacity-70 text-sm font-semibold">
                {{ $t("账户金额") }}
              </div>
              <div class="flex mt-4">
                <div class="text-white text-3xl font-bold flex items-center">
                  {{ balance }}
                </div>
                <div
                  class="text-white text-sm font-bold flex items-center ml-2 pt-[12px]"
                >
                  {{ $t("美元") }}
                </div>
              </div>
              <div
                class="text-white opacity-70 text-sm font-semibold pt-4 pb-2"
              >
                {{ $t("您将在一小时内收到提款") }}
              </div>
            </div>
          </div>

          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            status-icon
            :rules="rules"
            label-width="auto"
            class="w-full mt-4 p-4"
          >
            <el-form-item
              :label="$t('提款金额')"
              prop="money"
              label-position="top"
            >
              <el-input
                v-model="ruleForm.money"
                type="text"
                :placeholder="$t('提款金额')"
                autocomplete="off"
                size="large"
              >
                <template #suffix>
                  <el-button
                    type="primary"
                    style="background: #005713"
                    @click="All"
                    size="default"
                    >全部</el-button
                  >
                </template>
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('交易密码')" label-position="top">
              <el-input
                v-model="ruleForm.password"
                :placeholder="$t('交易密码')"
                type="password"
                autocomplete="off"
                size="large"
                show-password
              />
            </el-form-item>
          </el-form>

          <div class="w-full mt-6 p-5">
            <van-button color="#007513" class="w-full">{{
              $t("提取")
            }}</van-button>
          </div>
        </van-tab>
        <van-tab :title="$t('历史')">
            <van-tabs
              v-model:active="active"
              color="#005713"
              title-active-color="#fff"
              type="card"
              class="m-6"
            >
              <van-tab :title="$t('审阅')"></van-tab>
              <van-tab :title="$t('成功')"></van-tab>
              <van-tab :title="$t('拒绝')"></van-tab>
            </van-tabs>
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
              v-model:loading="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell v-for="item in list" :key="item" :title="item">
                <div
                  class="shadow rounded-xl bg-[#e8f7ec] text-[#666] p-3 box-border flex flex-col m-2"
                >
                  <div
                    class="flex items-center justify-between font-medium pb-2 text-sm"
                  >
                    2222222222
                  </div>
                  <div class="w-full h-[1px] bg-[#EBEBEB]"></div>
                  <div class="flex flex-col text-sm font-medium mt-2">
                    <div class="flex mt-1">
                      <div class="w-[50%]">{{ $t("姓名") }}</div>
                      <div class="w-[50%] break-words">：123123</div>
                    </div>
                    <div class="flex mt-1">
                      <div class="w-[50%]">{{ $t("钱包地址") }}</div>
                      <div class="w-[50%] break-words">：123123</div>
                    </div>
                    <div class="flex mt-1">
                      <div class="w-[50%]">{{ $t("加密钱包") }}</div>
                      <div class="w-[50%] break-words">：123123</div>
                    </div>
                    <div class="flex mt-1">
                      <div class="w-[50%]">{{ $t("提现费用") }}</div>
                      <div class="w-[50%] break-words">：123123</div>
                    </div>
                    <div class="flex mt-1">
                      <div class="w-[50%]">{{ $t("实际费用") }}</div>
                      <div class="w-[50%] break-words">：123123</div>
                    </div>
                    <div class="flex mt-1">
                      <div class="w-[50%]">{{ $t("佣金") }}</div>
                      <div class="w-[50%] break-words">：123123</div>
                    </div>
                    <div class="flex mt-1">
                      <div class="w-[50%]">{{ $t("佣金费率") }}</div>
                      <div class="w-[50%] break-words">：123123</div>
                    </div>
                    <div class="flex mt-1">
                      <div class="w-[50%]">{{ $t("地位") }}</div>
                      <div class="w-[50%] break-words">：123123</div>
                    </div>
                    <div class="flex mt-1">
                      <div class="w-[50%]">{{ $t("创建于") }}</div>
                      <div class="w-[50%] break-words">：123123</div>
                    </div>
                  </div>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script setup>
const bgImage = new URL("@/static/images/bg-3.png", import.meta.url).href;
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
const active = ref(0);
const balance = ref(32);
const list = 5;
const onClickLeft = () => history.back();
const ruleForm = reactive({
  money: "",
  password: "",
});

const All = () => {
  ruleForm.money = balance.value;
};
</script>
<style>
.withdraw .el-input__wrapper {
  border: 1px solid #005713;
}
</style>
