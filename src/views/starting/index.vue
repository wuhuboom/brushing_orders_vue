<template>
  <div>
    <HeaderTop></HeaderTop>
    <div class="w-full bg-[#fff4f3] relative">
      <div class="w-full h-full pt-5">
        <div
          class="flex w-[90%] mx-auto justify-between mt-4 items-center"
        >
          <div class="flex">
            <img
              style="width: 50px; height: 50px; border-radius: 50%"
              src="@/static/images/user2.png"
              alt=""
            />
            <div class=" pl-2">
              <div class="text-black text-base font-semibold">
                {{ $t("hi") }}, 
              </div>
			  <div class="text-black text-xl font-bold">
			    {{ userInfo.username }}
			  </div>
            </div>
          </div>
		  <div class="text-black text-center flex justify-between items-end top-5 right-5">
		    <p class="text-[#000] text-xl font-semibold">
		      VIP{{ userInfo.levelId }}
		    </p>
			<img :src="avatarUrl" class="w-12" alt="" />
		  </div>
        </div>
      </div>
      <div class="w-[100%] px-2 mx-auto">
		<div class="page mx-auto p-2 h-[420px]">
		  <!-- 轮播可视容器 -->
		  <div
		    ref="carouselRef"
		    class="carousel-wrap"
		    @touchstart="onTouchStart"
		    @touchmove="onTouchMove"
		    @touchend="onTouchEnd"
		  >
		    <div
		      class="card-box"
		      :style="{
		        transform: `translateX(${translateX + dragX}px)`,
		        transition: dragging ? 'none' : 'transform 0.3s ease-out'
		      }"
		    >
		      <!-- 渲染5张卡片，保证前后永远有可露出项 -->
		      <div
		        class="card-item"
		        v-for="(item, idx) in goodsList"
		        :key="idx"
		        :class="{active: idx === current}"
		      >
		        <div class="card">
		          <div class="product-card">
		            <div class="img-box">
		              <img :src="url + item.coverUrl" alt="" />
		            </div>
		            <div v-if="idx == current">
						<p class="title text-[#000] text-sm font-semibold whitespace-nowrap  text-ellipsis overflow-hidden">{{ item.name }}</p>
						<div class="">
						    <div class="">
						        <van-icon name="star" color="#f99d25"></van-icon>
							  4.9
						    </div>
						</div>
						<p class="price text-xl">
						  <span class="text-base mr-2">
							{{ $t("当前价格") }}
						  </span>
						  <span class="text-xl font-bold mr-2">
						  	{{ item.price }}
						  </span>
						  <span class="text-sm">
						  	{{ $t("美元") }}
						  </span>
						</p>
					</div>
		          </div> 	
		        </div>
		      </div>
		    </div>
		  </div>
		
		</div>  
		  
		 
		 <div @click="handleClick" class="w-full" size="large" round>
		   <div
		     class="w-full text-white text-base font-semibold mx-auto py-4 rounded-lg flex items-center justify-center bg-[#fb001b]"
		   >
		     <div>{{ $t("现在开始") }} ({{ userInfo.dealCount }}/{{orderCount}})</div>
		   </div>
		 </div>
		  
      </div>
	  <div class="w-[100%] mx-auto p-2">
	    <div class="mt-4 p-8 rounded-lg bg-[#ffffff] border-[#eaeaea] border-[1px]">
	      <div class="flex flex-col box-border text-center relative rounded-xl">
	        <div class="mb-2 text-base font-bold  mx-auto relative" style="color: black;">
				<img 
				  class="w-[4rem] h-[4rem] mx-auto "
				  src="@/static/images/base/icon-32.png"/>
				<div class=" mt-3 text-[16px] font-bold" style="color: black;">
					{{ $t("当日佣金") }}
				</div>
				<div class="text-[#000] text-[18px] font-bold ">
				  {{ userInfo.commission }} {{ $t("美元") }}
				</div>
				<div class="text-[#000] mt-2 text-[13px]">
				  {{ $t("每日赚取佣金") }}
				</div>
			</div>
			<div class="flex items-center justify-between mt-6 px-1">
				<div class="mb-2 text-base font-bold" style="color: black;">
					<img
					 class="w-[4rem] h-[4rem] mx-auto "
					 src="@/static/images/base/icon-33.png"/>
					<div class=" mt-3 text-[16px] font-bold" style="color: black;">
						{{ $t("钱包余额") }}
					</div>
					<div class="text-[#000] text-[18px] font-bold ">
					  {{ userInfo.balance }} {{ $t("美元") }}
					</div>
					<div class="text-[#000] mt-2 text-[13px]">
					  {{ $t("佣金将在此处添加") }}
					</div>
				</div>
				<div class="mb-2 text-base font-bold" style="color: black;">
					<img
					 class="w-[4rem] h-[4rem] mx-auto "
					 src="@/static/images/base/icon-34.png"/>
					<div class=" mt-3 text-[16px] font-bold" style="color: black;">
						{{ $t("持有金额") }}
					</div>
					<div class="text-[#000] text-[18px] font-bold ">
					  {{ userInfo.frozenBalance }} {{ $t("美元") }}
					</div>
					<div class="text-[#000] mt-2  text-[13px] ">
					  {{ $t("如有疑问，请联系客服") }}
					</div>
				</div>
			</div>
	      </div>
	    </div>
	  </div>
      <div class="w-[100%] mx-auto px-2">
        <div class="mb-8 rounded-lg bg-[#ffffff] border-[#eaeaea] border-[1px]">
          <div class="flex flex-col p-4 box-border text-center relative rounded-xl">
            <div class="mb-2  text-base font-bold" style="color: black;">{{ $t("staring3") }}</div>
            <div class="text-[#000] text-sm ">
              {{ $t("staring1") }}
              {{ TradeInfor?.workTimeStart || "10:00" }} -
              {{ TradeInfor?.workTimeEnd || "23:00" }}<br />
              {{ $t("staring2") }}
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 pb-4"></div>
    </div>
    <Footer name="/starting"></Footer>
    <van-dialog
      v-model:show="showImg"
      round
	  :showConfirmButton="false"
	  close-on-click-overlay
      :style="{ width:'90%',background: 'transparent' }"
    >
      <img class="w-[100%]" src="../../static/images/super.jpg" alt="">
	  <div @click="toPage('/contact')" class="w-full" size="large" round>
	    <div
	      class="w-full text-white text-2xl font-semibold mx-auto py-5  flex items-center justify-center bg-black"
	    >
	      <div>{{ $t("联系客服") }}</div>
	    </div>
	  </div>
    </van-dialog>
  </div>
</template>
<script setup>
import { onMounted, ref, onUnmounted, computed, nextTick, defineOptions } from "vue";
import HeaderTop from "@/components/HeaderTop.vue";
import Footer from "@/components/Footer.vue";
import { showLoadingToast,closeToast,showFailToast,showSuccessToast,showToast } from 'vant';
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {formatWithTimezone}  from '../../util/utils'
import { errorMessages } from "../../api/errorCodeMap";
import {
  userGetInfo,
  getGoodsList,
  createOrder,
  submitOrder,
  getTradeConfig
} from "../../api/apis";
import { useUserStore } from "@/store/modules/user";

defineOptions({
  name: 'Starting' 
})
const userStore = useUserStore();
const router = useRouter();
const url = window.g.VITE_API_IMG_URL;
const { t } = useI18n();
const userInfo = ref({});
const avatarUrl = ref("");
const showImg = ref(false);
let luckyDrawTimer = null;

// let timer = null;
const goodsList = ref([]);
const showCenter = ref(false);
const goods = ref({});
const totalCount = ref(0); // 插入一个“开始按钮”
const getList = async () => {
  // let res = await getGoodsList();
  // goodsList.value = res.data;
  try {
    const res = await getGoodsList();
    goodsList.value = res.data;
    totalCount.value = goodsList.value.length + 1; // 插入一个“开始按钮”
  } catch (e) {
    console.error("获取商品列表失败:", e);
  } finally {
    // 每次请求完成后再等 10 秒再发下一次，避免堆积
    // timer = setTimeout(getList, 10000);
  }
};

const getImageByIndex = (i) => {
  if (i === 4) return null; // 第 5 项是“开始按钮”，不用图
  const realIndex = i < 5 ? i : i - 1;
  console.log(goodsList.value[realIndex]?.coverUrl);
  return goodsList.value[realIndex]?.coverUrl || "";
};

// 抢单
const handleClick = () => {
 //  if(userInfo.value.cardNumber == userInfo.value.dealCount && userInfo.value.cardNumber !=0) {
 //    showImg.value = true;
 //    // 2. 延时 2 秒后关闭图片，并继续创建订单
 //    setTimeout(() => {
 //      showImg.value = false;
 //    }, 2000);
	// doCreateOrder()
 //    return;
 //  }
  // 不满足条件时，直接创建订单
  doCreateOrder()
};

const closeImg = () => {
    showImg.value = false;
    if (luckyDrawTimer) {
        clearTimeout(luckyDrawTimer);
        luckyDrawTimer = null;
    }
};

const doCreateOrder = () => {
  showLoadingToast({
    message: t("创建中..."),
    forbidClick: true,
    duration: 0,
  });
  createOrder()
    .then((res) => {
      closeToast();
      showToast(t("创建成功"));
      showCenter.value = true;
      goods.value = res.data;
	  toPage('/productInfo', {id: res.data.id})
    })
    .catch((err) => {
	  closeToast();
	  if (err.code == 2000) {
	      showImg.value = true;
	      // if (luckyDrawTimer) clearTimeout(luckyDrawTimer);
	      // luckyDrawTimer = setTimeout(() => {
	      //     showImg.value = false;
	      //     luckyDrawTimer = null;
	      // }, 15000);
	  } else if (err.code == 909) {
	      showToast(
	          `t("staring4") ${err.data} t("staring5")`,
	      );
	  } else if (err.code == 907) {
	      toPage('/productInfo', {id: err.data.id})
	  } else {
	      showToast(t(errorMessages[err.code] || "creation_failed"));
	  }
    });
};


const orderCount = ref(0)
onMounted(() => {
  getList();
  tradeConfig();
  startTimer();
  getContainerWidth();
  userGetInfo().then((res) => {
    userInfo.value = res.data;
    avatarUrl.value = `${url}${res.data.userLevel.icon}`;
    orderCount.value = res.data.userLevel.orderCount
  });
});

const toPage = (path, param) => {
  router.push({
    path: path,
	query: param
  });
};

// 基础配置
const innerWidth = window.innerWidth
// const cardW = 260
const cardW = innerWidth * 0.7
const gap = 0
// 容器左右留白，用来露出左右卡片
// const sidePad = 60* innerWidth / 390
const sidePad = 80
// 两侧卡片缩放比例
const smallScale = 0.8
// 滑动翻页阈值
const threshold = 50

// 渲染5张卡片，滑动前后都有相邻卡片
const cardList = ref([1,2,3,4,5,6,7])
// 默认选中第2项作为中间主卡片（索引从0开始：0 1 【2】 3 4）
const current = ref(2)
const carouselRef = ref(null)
const containerWidth = ref(0)

// 拖拽变量
const startX = ref(0)
const dragX = ref(0)
const dragging = ref(false)

const TradeInfor = ref({});
const tradeConfig = async () => {
    const res = await getTradeConfig();
    TradeInfor.value = res.data;
};

// 核心位移公式：强制让current卡片居中，左边露出前一张、右边露出后一张
const translateX = computed(()=>{
  // // 目标：让current卡片对齐容器可视中心
  // // 整体左移 = 当前索引 * (卡片宽+间距)
  // const moveLeft = current.value * (cardW + gap)
  // // 向右偏移容器左侧留白，实现左右双向露出
  // return sidePad - moveLeft 
  if(!containerWidth.value) return 0
  const baseMove = current.value * (cardW + gap)
    // 2. 居中偏移：容器一半宽度 - 半张卡片宽度，让卡片精准居中
    const centerOffset = containerWidth.value / 2 - cardW / 2
    // 3. 最终位移 = 居中位置 - 卡片整体左移量
    return centerOffset - baseMove + 10
})
// 读取容器宽度，窗口变化时重新赋值
const getContainerWidth = async ()=>{
  await nextTick()
  if(carouselRef.value){
    containerWidth.value = carouselRef.value.clientWidth
  }
}
// 触摸事件
const onTouchStart = e=>{
  dragging.value = true
  startX.value = e.touches[0].clientX
}
const onTouchMove = e=>{
  dragX.value = e.touches[0].clientX - startX.value
}
const onTouchEnd = ()=>{
  dragging.value = false
  const dis = dragX.value
  // 右滑 上一页
  if(dis > threshold && current.value > 0){
    current.value--
  }
  // 左滑 下一页
  else if(dis < -threshold && current.value < goodsList.value.length -1){
    current.value++
  }
  dragX.value = 0
}

let timer = null
const AUTO_DELAY = 3000
// 自动轮播逻辑
const autoPlay = () => {
  // 到达最后一项回到第二项，实现无缝循环
  if(current.value >= goodsList.value.length -1 ){
    current.value = 0
  }else{
    current.value++
  }
}
// 开启定时器
const startTimer = () => {
  clearInterval(timer)
  timer = setInterval(autoPlay, AUTO_DELAY)
}

// 页面销毁清除定时器，防止后台持续轮播
onUnmounted(()=>{
  clearInterval(timer)
  if (luckyDrawTimer) clearTimeout(luckyDrawTimer);
})

</script>

<style scoped>
.page{
  /* width:100vw; */
  /* min-height:100vh; */
  padding:0px 0;
  overflow-x:hidden;
}

.header{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  padding:0 24px;
  margin-bottom:40px;
}
.user p{
  font-size:30px;
}
.user h2{
  font-size:52px;
  line-height:1;
}
.vip{
  display:flex;
  align-items:center;
  gap:10px;
  margin-top:8px;
}
.vip span{
  font-size:34px;
  font-weight:bold;
}
.vip-circle{
  width:76px;
  height:76px;
  border-radius:50%;
  background:#FFD046;
  border:3px solid #fff;
}

/* 轮播容器：左右padding完全一致，两侧同时露出卡片 */
.carousel-wrap{
  width:100%;
  overflow:hidden;
  padding:20px var(--pad);
  --pad:0px;
}
.card-box{
  display:flex;
  align-items:center;
  gap:10px;
  will-change:transform;
}

/* 默认所有卡片缩小 */
.card-item{
  /* width:260px; */
  width:70%;
  flex-shrink:0;
  transform:scale(.9);
  transition:transform 0.3s ease;
}
/* 当前居中卡片还原原尺寸，层级置顶 */
.card-item.active{
  transform:scale(1);
  z-index:2;
}

.card{
  width:100%;
  height:380px;
  /* background:#fff; */
  border-radius:22px;
  display:flex;
  align-items:center;
  justify-content:center;
}

.card img{
  width:68%;
}

/* 商品文字左对齐 */
.info{
  padding:0 26px;
  margin-top:45px;
}
.title{
  font-size:30px;
  line-height:1.6;
}
.star{
  font-size:28px;
  margin:20px 0;
}
.price{
  font-size:32px;
}

/* 底部按钮 */
.btn{
  width:calc(100% - 48px);
  margin:60px auto 0;
  background:#000;
  color:#FFD046;
  text-align:center;
  font-size:38px;
  font-weight:bold;
  padding:26px 0;
  border-radius:10px;
}
.product-card {
  width: 100%; /* 调小这个值，左右露出更多 */
  margin: 0 auto;
  height: 100%;
  /* background-color: #ffd149; */
  border-radius: 14px;
  /* padding: 16px; */
  box-sizing: border-box;
  text-align: center;
}
.img-box {
  /* background: #ffffff; */
  border-radius: 8px;
  padding: 10px;
  /* height: 70%; */
  display: flex;
  align-items: center;
  justify-content: center;
}
.img-box img {
 /* width: 200px;
  height: 200px; */
  width: 100%; 
  aspect-ratio: 1 / 1; 
  object-fit: cover;
  border: 15px solid #eaeaea;
  border-radius: 10px;
}
.title {
  font-size: 18px;
  margin: 0px 0 6px;
}
.price {
  font-size: 22px;
  font-weight: bold;
}
</style>