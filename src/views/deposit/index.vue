<template>
  <div class="w-full  min-h-[100vh] h-full bg-[#f3fdf4]" @scroll="handleScroll">
	<van-sticky type="primary" style="z-index: 999" v-show="navBarShow">
	  <van-nav-bar
	    :title="$t('定金')"
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
	  :title="$t('定金')"
	  fixed
	  left-arrow
	  @click-left="onClickLeft"
	>
	  <template #left>
		<img class="rotate-180" src="@/static/images/base/right.png" style="width:22px" />
	  </template>
	</van-nav-bar>

    <div class="mt-2">
	  <div class="p-4 box-border flex flex-col">
	    <div
	      class="flex flex-col justify-between py-4 px-8  box-border bg-[#5d9c5d] rounded-2.5"
	    >
	      <div class="text-black text-base font-bold">
	        {{ $t("总余额") }}
	      </div>
	      <div class="flex mt-4">
	        <div class="text-black text-2xl  flex items-center">
	          {{userInfo.balance}}
	        </div>
	        <div
	          class="text-black text-2xl  flex items-center ml-2 "
	        >
	          {{ $t("美元") }}
	        </div>
	      </div>
		  <div class="w-full flex justify-end mt-6">
			  <div class="bg-black text-center text-white fl rounded-[6px] py-1 px-4" @click="customer">
				  {{ $t("定金文案1") }}
			  </div>
		  </div>
	    </div>
		<div class="text-black mt-10 text-base font-bold">
		  {{ $t("定金文案2") }}
		</div>
		<div class="w-full px-2 pt-6 box-border flex flex-col">
		  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
		   <van-list
		      v-model:loading="loading"
		      :finished="finished"
		      :finished-text="$t('没有更多了')"
		      @load="onLoad"
		    >
		      <van-cell v-for="item in list" :key="item" :title="item">
		        <div
		          class="item flex items-center justify-between  w-full mb-1 bg-[#f3fdf4]  p-3 border-b-[1px] border-[#000]"
		        >
				  <div >
					<div class="text-base font-bold text-[#000]">
					    {{ $t('定金文案3') }}
					</div>
					<div class="text-sm font-normal text-[#7b7b7b]">
					    {{ $t('定金文案4') }} {{ item.code }}
					</div>
					<div class="text-sm font-normal text-[#7b7b7b]">
						{{formatTargetDate(item.createTime)}}
					    <!-- {{ formatWithTimezone(item.createTime,userStore.zoneActive.tzName)  }} -->
					</div>
				  </div>
		          
		          <div
		            class="flex text-base text-[#000] font-semibold items-center mt-3"
		          >
		            {{ item.amout }} {{ $t("美元") }}
		          </div>
		        </div>
		      </van-cell>
		    </van-list>
		  </van-pull-refresh>
		</div>
	  </div>
		
    </div>
    <ContactUs ref="ContactUsRef"></ContactUs>
  </div>
</template>
<script setup>
const bgImage = new URL("@/static/images/bg-3.png", import.meta.url).href;
import { onMounted, reactive, ref } from "vue";
import { getDeposit,userGetInfo } from "../../api/apis";
const active = ref(0);
const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);
import {formatWithTimezone, formatTargetDate}  from '../../util/utils'
import { useUserStore } from "@/store/modules/user";
const userStore = useUserStore();
const ContactUsRef = ref(null);
const userInfo = ref({})
const navBarShow = ref(false);
const swichTab = () => {
  if (active.value == 1) {
    onRefresh();
  }
};
const list = ref([]);
const query = reactive({
  pageNum: 1,
  pageSize: 10,
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
    let res = await getDeposit(query);
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
const customer = () => {
  ContactUsRef.value.open();
};
onMounted(() => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
  });
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
const onClickLeft = () => history.back();
</script>
<style scoped>
	.item {
	  position: relative;
	  padding-left: 40px; /* 给黑点留出左侧空间 */
	}
	/* 左侧实心大圆黑点 */
	.item::before {
	  content: '';
	  position: absolute;
	  left: 0;
	  top: 50%;
	  transform: translateY(-50%);
	  width: 10px;   /* 黑点大小 */
	  height: 10px;
	  background: #000;
	  border-radius: 50%; /* 圆形 */
	}
</style>
