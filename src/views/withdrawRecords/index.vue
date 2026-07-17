<template>
  <div class="w-full min-h-[100vh] h-full withdraw bg-[#f3fdf4]" @scroll="handleScroll">
	<van-sticky type="primary" style="z-index: 999" v-show="navBarShow">
	  <van-nav-bar
	    :title="$t('提取')"
	    fixed
	    left-arrow
	    @click-left="onClickLeft"
	  >
		<template #left>
	  	  <img class="rotate-180" src="@/static/images/base/right.png" style="width:22px" />
	    </template>
	  </van-nav-bar>
	</van-sticky>
	<HeaderTop></HeaderTop>
	<van-nav-bar
	  class="pos"
	  :title="$t('提取')"
	  fixed
	  left-arrow
	  @click-left="onClickLeft"
	>
	  <template #left>
		<img class="rotate-180" src="@/static/images/base/right.png" style="width:22px" />
	  </template>
	</van-nav-bar>

    <div class="mt-2">
      <van-tabs
        v-model:active="orderActive"
        @change="changeOrder"
        color="#000"
        title-active-color="#000"
        type="card"
        class="m-6"
      >
        <van-tab :title="$t('待审核')"></van-tab>
        <van-tab :title="$t('审核成功')"></van-tab>
        <van-tab :title="$t('审核拒绝')"></van-tab>
      </van-tabs>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="$t('没有更多了')"
          @load="onLoad"
        >
          <van-cell v-for="item in list" :key="item" :title="item">
            <div
              class="item flex items-center justify-between mb-1 bg-[#f3fdf4]  p-4 border-b-[1px] border-[#000] mx-4 mb-1"
            >
              <div >
            	<div class="text-base font-bold text-[#000]">
            	    {{
            	      item.status == 0
            	        ? $t("通过")
            	        : item.status == 1
            	        ? $t("待审核")
            	        : $t("拒绝")
            	    }}
            	</div>
            	<div class="text-sm font-normal text-[#7b7b7b]">
            	    {{ $t('定金文案4') }} {{ item.code }}
            	</div>
            	<div class="text-sm font-normal text-[#7b7b7b]">
            	    {{ formatWithTimezone(item.applicationTime,userStore.zoneActive.tzName)  }}
            	</div>
              </div>
              
              <div
                class="flex text-base text-[#000] font-semibold items-center mt-3"
              >
                {{ item.amount }} {{ $t("美元") }}
              </div>
            </div>
			
			<!-- <div
              class=" border-b-[1px] border-[#000] text-[#000] p-4 box-border flex flex-col mx-4 mb-4 "
            >
              <div
                class="flex items-center justify-between font-medium pb-2 text-base"
              >
                {{ item.code }}
              </div>
              <div class="w-full h-[1px] bg-[#EBEBEB]"></div>
              <div class="flex flex-col text-sm font-medium mt-0">
                
				<div class="flex mt-1">
                  <div class="w-[50%]">{{ $t("姓名") }}</div>
                  <div class="w-[50%] break-words">
                    ：{{ item.username }}
                  </div>
                </div>
                <div class="flex mt-1">
                  <div class="w-[50%]">{{ $t("钱包地址") }}</div>
                  <div class="w-[50%] break-words">
                    ：{{ item.withdrawAddress }}
                  </div>
                </div>
                <div class="flex mt-1">
                  <div class="w-[50%]">{{ $t("钱包名称") }}</div>
                  <div class="w-[50%] break-words">
                    ：{{ item.withdrawType }}
                  </div>
                </div>
                <div class="flex mt-1">
                  <div class="w-[50%]">{{ $t("提现金额") }}</div>
                  <div class="w-[50%] break-words">：{{ item.amount }}</div>
                </div>
                <div class="flex mt-1">
                  <div class="w-[50%]">{{ $t("到账金额") }}</div>
                  <div class="w-[50%] break-words">
                    ：{{ item.creditedAmount }}
                  </div>
                </div>
                <div class="flex mt-1">
                  <div class="w-[50%]">{{ $t("费率") }}</div>
                  <div class="w-[50%] break-words">：{{ item.fee }}</div>
                </div>
                <div class="flex mt-1">
                  <div class="w-[50%]">{{ $t("手续费") }}</div>
                  <div class="w-[50%] break-words">
                    ：
                    {{
                      (
                        (item.amount * item.withdrawFee) /
                        100
                      ).toFixed(2)
                    }}
                  </div>
                </div>
                <div class="flex mt-1">
                  <div class="w-[50%]">{{ $t("状态") }}</div>
                  <div class="w-[50%] break-words">
                    ：{{
                      item.status == 0
                        ? $t("通过")
                        : item.status == 1
                        ? $t("待审核")
                        : $t("拒绝")
                    }}
                  </div>
                </div>
                <div class="flex mt-1">
                  <div class="w-[50%]">{{ $t("创建时间") }}</div>
                  <div class="w-[50%] break-words">
                    ：{{ formatWithTimezone(item.applicationTime,userStore.zoneActive.tzName)  }}
                  </div>
                </div>
              </div>
            </div> -->
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script setup>
const bgImage = new URL("@/static/images/bg-3.png", import.meta.url).href;
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { getWithdrawals, withdrawal, getTradeConfig,userGetInfo } from "../../api/apis";
import { useUserStore } from "@/store/modules/user";
import {formatWithTimezone} from '../../util/utils'
import {
  showLoadingToast,
  closeToast,
  showFailToast,
  showSuccessToast,
  showToast
} from "vant";
import { useI18n } from "vue-i18n";
const orderActive = ref(0);
const active = ref(0);
const list = ref([]);
const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);
const amount = ref("");
const userStore = useUserStore();
const { t } = useI18n();
const navBarShow = ref(false);
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  status: "1",
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
const ruleForm = reactive({
  amount: "",
  tradePassword: "",
});

const All = () => {
  console.log(amount.value);
  ruleForm.amount = amount.value;
};
const getWithdrawal = () => {
  if (!ruleForm.amount) return showToast(t('请输入金额'));
  if (!ruleForm.tradePassword) return showToast(t('请输入交易密码'));
  withdrawal(ruleForm).then((res) => {
    showSuccessToast(t("提现成功"));
    router.push({ path: "/my" });
  });
};
const changeOrder = () => {
  if (orderActive.value == 0) {
    query.status = "1";
  } else if (orderActive.value == 1) {
    query.status = "0";
  } else {
    query.status = "2";
  }
  onRefresh();
};

onMounted( () => {
  onRefresh();
});

function handleScroll(e) { 
  const scrollTop = e.target.scrollTop
  if(scrollTop> 90){
	  navBarShow.value = true
  }else{
	  navBarShow.value = false
  }
}
</script>
<style>
.withdraw .el-input__wrapper {
  border: 1px solid #005713;
}
:deep(.van-tab){
	margin: 0px 10px !important;
}
.withdraw .van-tabs__nav--card{
	border: 0px !important;
	margin: 0 0 !important;
	background-color: transparent !important;
}
.withdraw .van-tab--card{
	border: 0px !important;
	margin: 0 10px !important;
	background-color: #bcd7bc !important;
}
.withdraw .van-tab--card:first-child{
	margin-left: 0 !important;
}
.withdraw .van-tab--card:last-child{
	margin-left: 0 !important;
}
.withdraw .van-tab--card.van-tab--active{
	background-color: #5d9c5d !important;
}
</style>
