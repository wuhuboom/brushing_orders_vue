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
	        {{ $t("available") }}
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
		
		<div
		  class="flex flex-col justify-between py-4 mt-6 px-8  box-border bg-[#5d9c5d] rounded-2.5"
		>
		  <div class="text-black text-base font-bold">
		    {{ $t("总余额") }}
		  </div>
		  <div class="flex mt-4">
		    <div class="text-black text-2xl  flex items-center">
		      {{userInfo.totalBalance}}
		    </div>
		    <div
		      class="text-black text-2xl  flex items-center ml-2 "
		    >
		      {{ $t("美元") }}
		    </div>
		  </div>
		  <div class="w-full flex justify-end mt-6">
			  <div class=" text-center text-white fl rounded-[6px] py-1 px-4" @click="customer">
			  </div>
		  </div>
		</div>
		
		<div class="mt-4 bg-white">
			<van-cell v-for="item in orderList" :key="item" :title="item">
			    <div class="w-full flex flex-col mb-2 bg-[#ffffff] border-[0px] border-[#eee] p-4 box-border rounded-[6px]">
			        <div class="w-full flex justify-between items-center mb-4">
			          <div class="text-[#666] text-sm font-medium">
						  <van-icon name="calendar" />
			              {{ formatWithTimezone(item.createTime,userStore.zoneActive.tzName)  }}
			          </div>
			          <div class="text-white text-xs p-1 px-3  font-medium " :class="item.status == '2'?'bg-[#fb001b]':item.status == '1'?'bg-[#fb001b]':'bg-[#006bdc]'">
			              {{item.status=='0'? $t('已完成'): item.status == '1'?$t('冻结'): $t('待提交')}}
			          </div>  
			        </div>   
					<div class="w-full flex h-[95px]">
					    <div class="  info-left" >
					        <img class="info-img" :src="VITE_API_IMG_URL+item.coverUrl" alt="">
					    </div>
					    <div class=" info-right flex flex-col h-[3rem] justify-between">
					        <div>
					            <div class="text-[#000] text-sm font-semibold whitespace-nowrap  text-ellipsis overflow-hidden">
					            {{item.goodsName}}
								</div>
								<div class=" mt-1">
								    <div class=" flex flex-col">
								       
								        <div class="mt-1 text-xl text-black font-semibold">
								            {{item.price}}
											<span class="text-sm">
												{{$t('美元')}}
											</span>
								        </div>
								    </div>
								</div>
								
								<div class="grid grid-cols-5 mt-2">
								    <div class="col-span-2 w-[80%] flex items-center justify-between">
								        <van-icon name="star" size='18' color="#f99d25"></van-icon>
								        <van-icon name="star" size='18' color="#f99d25"></van-icon>
								        <van-icon name="star" size='18' color="#f99d25"></van-icon>
								        <van-icon name="star" size='18' color="#f99d25"></van-icon>
								        <van-icon name="star" size='18' color="#f99d25"></van-icon>
								    </div>
								</div>
					        </div>
					    </div>
					</div>	
					<div>
					  <div class="flex items-center justify-between mt-4">
					  	<div class="flex items-center justify-between w-[60%]">
					  	    <div class="">
					  	        <div class="text-xs text-[#666] font-medium">
					  	            {{$t('总金额')}}
					  	        </div>
					  	        <div class="mt-1 text-sm text-black font-semibold">
					  	            {{item.balance}} {{$t('美元')}}
					  	        </div>
					  	    </div>
					  	    <div class="ml-8">
					  	        <div class="text-xs text-[#666] font-medium">
					  	            {{$t("佣金")}}
					  	        </div>
					  	        <div class="mt-1 text-sm text-black font-semibold">
					  	            {{item.commission}} {{$t('美元')}}
					  	        </div>
					  	    </div>						  
					  	</div>
						<div class="flex justify-end w-[40%]" v-if="item.status == '2'">
						  <van-button icon="arrow" icon-position="right" color="#000" @click="submit(item)" size="small">{{$t("提交订单")}}</van-button>
						</div>
					  </div>	
					</div>   
			    </div>
			</van-cell>
		</div>
		
		<div class="text-black mt-8 text-base font-bold">
		  {{ $t("定金文案2") }}
		</div>
		<div class="w-full px-2 pt-4 box-border flex flex-col">
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
import { getDeposit,userGetInfo, getOrderInfos } from "../../api/apis";
const active = ref(0);
const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);
import {formatWithTimezone, formatTargetDate}  from '../../util/utils'
import { useUserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
const router = useRouter();
const userStore = useUserStore();
const ContactUsRef = ref(null);
const userInfo = ref({})

const orderList =  ref([]);
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

const queryOrder = reactive({
  pageNum: 1,
  pageSize: 10,
  status: 2
});

const getOrderInfo = async() => {
	let res = await getOrderInfos(queryOrder);
	const data = res.rows;
	orderList.value = data
}

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
  getOrderInfo();
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

const submit = (item) => {
    // goodsData.value = item;
    // show.value = true
	toPage('/productInfo', {id: item.id})
}

const toPage = (path, param) => {
  router.push({
    path: path,
	query: param
  });
};
const onClickLeft = () => {
	toPage('/my')
}
</script>
<style scoped>
.info-left{
	float: left;
	width: 100px;
	height: 100px;
}
.info-img{
	width: 100%;
	height: 100px;
	/* aspect-ratio: 1 / 1; */
	/* object-fit: cover; */
}
.info-right{
	float: left;
	margin-left: 10px;
	width: calc(100% - 110px);
}
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
