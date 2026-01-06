<template>
  <div class="w-full bg-[#f9f9f9] min-h-[100vh] h-full withdraw">
    <div class="relative flex items-center justify-center h-[56px] px-[16px]">
      <div class="absolute left-[16px]">
        <van-icon
          name="arrow-left"
          color="#000"
          size="22px"
          @click="onClickLeft"
        />
      </div>
      <div class="text-base text-[#000000] font-medium">
        {{ $t("Withdrawal.title") }}
      </div>
      <!-- <div class="absolute right-[16px] text-base text-[#fff]">History</div> -->
    </div>
    <div class="mx-auto w-[90%]">
      <div class="flex justify-start mb-[16px] mt-[24px]">
        <div
          class="bg-[#F3F4F6] px-[16px] py-[6px] rounded-[15px] mr-[10px]"
          :class="orderActive == -1 ? 'bg-[#6a4d52] text-[#fff]' : ''"
          @click="changeOrder(-1)"
        >
          {{ $t("全部") }}
        </div>
        <div
          class="bg-[#F3F4F6] px-[16px] py-[6px] rounded-[15px] mr-[10px]"
          :class="orderActive == 0 ? 'bg-[#6a4d52] text-[#fff]' : ''"
          @click="changeOrder(0)"
        >
          {{ $t("待审核") }}
        </div>
        <div
          class="bg-[#F3F4F6] px-[16px] py-[6px] rounded-[15px] mr-[10px]"
          :class="orderActive == 1 ? 'bg-[#6a4d52] text-[#fff]' : ''"
          @click="changeOrder(1)"
        >
          {{ $t("审核成功") }}
        </div>
        <div
          class="bg-[#F3F4F6] px-[16px] py-[6px] rounded-[15px] mr-[10px]"
          :class="orderActive == 2 ? 'bg-[#6a4d52] text-[#fff]' : ''"
          @click="changeOrder(2)"
        >
          {{ $t("审核拒绝") }}
        </div>
      </div>
      <!-- <div
        class="flex justify-start mb-[16px] mt-[24px] bg-[#f4f4f5] leading-[40px] border text-[16px] border-[#ff497c]"
      >
        <div
          class="flex-1 flex items-center justify-center px-[16px]"
          :class="
            orderActive == 0 ? 'bg-[#ff497c] text-[#fff]' : 'text-[#ff497c]'
          "
          @click="changeOrder(0)"
        >
          {{ $t("待审核") }}
        </div>
        <div
          class="flex-1 flex items-center justify-center px-[16px]"
          :class="
            orderActive == 1 ? 'bg-[#ff497c] text-[#fff]' : 'text-[#ff497c]'
          "
          @click="changeOrder(1)"
        >
          {{ $t("审核成功") }}
        </div>
        <div
          class="flex-1 flex items-center justify-center px-[16px]"
          :class="
            orderActive == 2 ? 'bg-[#ff497c] text-[#fff]' : 'text-[#ff497c]'
          "
          @click="changeOrder(2)"
        >
          {{ $t("审核拒绝") }}
        </div>
      </div> -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="$t('没有更多了')"
          @load="onLoad"
        >
          <van-cell v-for="item in list" :key="item" :title="item">
            <div
              class="bg-[#fff] flex justify-between items-center px-[16px] py-[16px] rounded-[10px]"
              :class="
                item.status == 0
                  ? 'activetab'
                  : item.status == 1
                  ? 'activetab1'
                  : item.status == 2
                  ? 'activetab2'
                  : ''
              "
            >
              <div class="flex flex-col">
                <div class="text-[#002D72] font-bold text-[16px] pb-[6px]">
                  -{{ item.amount }}USD
                </div>
                <div class="text-[#6B7280] text-[12px]">
                  {{
                    formatWithTimezone(
                      item.applicationTime,
                      userStore.zoneActive.tzName
                    )
                  }}
                </div>
                <div class="text-[#9CA3AF] text-[12px]">ID:{{ item.orderNumber }}</div>
              </div>
              <div
                class="px-[12px] py-[4px] font-bold rounded-[20px] text-[12px]"
                :class="
                  item.status == 0
                    ? 'text-[#16A34A] bg-[#DCFCE7]'
                    : item.status == 1
                    ? 'text-[#EA580C] bg-[#FFEDD5]'
                    : 'text-[#DC2626] bg-[#FEE2E2]'
                "
              >
                {{
                  item.status == 0
                    ? $t("通过")
                    : item.status == 1
                    ? $t("待审核")
                    : $t("拒绝")
                }}
              </div>
            </div>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script setup>
const bgImage = new URL("@/static/images/bg-3.png", import.meta.url).href;
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {
  getWithdrawals,
  withdrawal,
  getTradeConfig,
  userGetInfo,
  getUserBankWallet,
} from "../../api/apis";
import { formatWithTimezone } from "../../util/utils";
import { useUserStore } from "@/store/modules/user";
import { showSuccessToast, showToast } from "vant";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const router = useRouter();
const orderActive = ref(-1);
const list = ref([]);
const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);
const amount = ref("");
const userStore = useUserStore();
const { t } = useI18n();
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  status: "",
});
const onRefresh = async () => {
  refreshing.value = true;
  finished.value = false;
  query.pageNum = 1;
  list.value = [];
  await loadData();
  refreshing.value = false;
};
const onLoad = async () => {
  if (finished.value || loading.value) return;
  loading.value = true;
  await loadData();
  loading.value = false;
};
const loadData = async () => {
  try {
    let res = await getWithdrawals(query);
    const data = res.rows;
    if (data.length < query.pageSize) {
      finished.value = true;
    } else {
      query.pageNum++;
    }

    list.value.push(...data);
  } catch (error) {
    console.error("加载失败", error);
    finished.value = true; // 避免无限加载
  }
};
const onClickLeft = () => history.back();

const changeOrder = (value) => {
  orderActive.value = value;
  if (orderActive.value == -1) {
    query.status = "";
  } else if (orderActive.value == 0) {
    query.status = "1";
  } else if (orderActive.value == 1) {
    query.status = "0";
  } else {
    query.status = "2";
  }
  onRefresh();
};

onMounted(() => {
  onRefresh();
});
</script>
<style>
.withdraw .el-input__wrapper {
  border: 1px solid #666;
}
</style>
<style scoped>
.router {
  border-top-right-radius: 8px; /* 右上角圆角 */
  border-bottom-right-radius: 8px; /* 右下角圆角 */
  border-top-left-radius: 0; /* 左上角不圆 */
  border-bottom-left-radius: 0; /* 左下角不圆 */
}
.tab {
  position: relative;
  padding-bottom: 5px; /* 给伪元素留点空间 */
  cursor: pointer;
}

.tab::after {
  content: "";
  position: absolute;
  left: 50%; /* 基准点放在中间 */
  bottom: 0;
  width: 80%; /* 下划线宽度 */
  height: 2px;
  background-color: transparent;
  transform: translateX(-50%); /* 往左移一半，居中 */
  transition: all 0.3s;
}

.tab.active {
  color: #206645;
}

.tab.active::after {
  background-color: #206645; /* 激活状态的下划线颜色 */
}
.activetab {
  box-shadow: 0px 1px 2px 0px #f3f4f6;
}
.activetab1 {
  box-shadow: 0px 1px 2px 0px #f3f4f6;
}
.activetab2 {
  box-shadow: 0px 1px 2px 0px #f3f4f6;
}
</style>
