<template>
  <div class="bg-[#ffffff]">
    <HeaderTop></HeaderTop>
    <div class="w-full relative h-[360px] headBg">
      <div class="pb-4 pt-4 absolute top-5 w-full" style="z-index: 2">
       
        <div class="mx-auto pt-5 text-center">
          <div
            class="px-4 text-2xl lg:text-5xl font-semibold text-white"
          >
          {{$t("home_company_1")}}
          </div>
        </div>
        <div class="flex justify-center items-center mt-5 text-center">
          <div
            class="text-white mr-1 px-4 py-1  text-xs "
          >
            {{ $t("home_company_2") }}
          </div>
        </div>
		<div class="w-full p-4 grid grid-cols-2 gap-2 text-center text-xs text-white mt-3">
			<div class="flex mb-2 flex-col w-[80%] ml-[20%] p-[10px]  justify-center rounded-lg bg-[#6e7482]">
				{{ $t("home_company_3") }}
			</div>
			<div class="flex mb-2 flex-col w-[80%] p-[10px] justify-center rounded-lg bg-[#ff8100]">
				{{ $t("home_company_4") }}
			</div>
		</div>
      </div>

      <!-- <img src="@/static/images/bg.jpg" alt="" /> -->
    </div>
	<div class="relative bg-[#f2f2f2] pt-4">
		<!-- 合作商列表 -->
		<div class="w-full rounded-xl mx-auto flex flex-col">
		  <div class="p-2.5 text-sm  text-[#7f8490] text-center">
		    {{ $t("home_clients") }}
		  </div>
		  <div class="w-full p-4 grid grid-cols-5 gap-5">
		    <div
		      class="flex mb-2 flex-col w-full justify-center rounded-lg items-start text-center box-border text-[#000]"
		      v-for="(item, index) in pics"
		      :key="index"
		    >
		      <div class="w-full">
		        <img class="mx-auto w-12 h-12" :src="item" alt="" />
		      </div>
		    </div>
		  </div>
		</div>
	</div>
    <div class="relative bg-[#f2f2f2] mt-10">
      <!-- 菜单列表 -->
      <div class="w-full rounded-xl mx-auto flex flex-col">
        <div class="pt-10 pb-4 text-sm  text-[#7f8490] text-center">
          {{ $t("home_menus") }}
        </div>
        <div class="w-full p-4 grid grid-cols-4 gap-4">
          <div
            class="flex mb-2 flex-col w-full justify-center rounded-lg items-start text-center box-border text-[#000]"
            v-for="(item, index) in items"
            :key="index"
            @click="goTo(item.route)"
          >
            <div class="w-full">
              <img class="mx-auto w-10 h-10 mb-1" :src="item.icon" alt="" />
            </div>
            <span class="mx-auto text-center text-sm font-bold mt-1 whitespace-nowrap">
              {{ $t(item.name) }}
            </span>
          </div>
        </div>
      </div>
     
    </div>
	
	<div class="m-4">
	  <div class="px-4 py-4 text-2xl lg:text-5xl font-semibold text-black">
	  	{{$t("home_label1")}}
	  </div>
	  <div class="px-4 mx-auto text-base mt-1 ml-2">
	  	<div
	  	  class="flex flex-col w-full justify-center rounded-lg items-start text-center box-border text-[#000] mt-2"
	  	  v-for="(item, index) in content"
	  	  :key="index"
	  	>
	  	  <div class=" w-full flex items-center justify-start">
	  		<!-- <img class="w-[25px] pl-2" src="../../static/images/home/close.png"/> -->
	  	    <div class=" text-left">
	  			<div class=" mx-auto text-xs mt-1 ">
	  				{{$t(item.name)}}
	  			</div> 
	  		</div>
	  	  </div>
	  	</div>
		<div class=" mx-auto text-xs mt-1 mt-4">
			{{$t("home_label7")}}
		</div>
		<div class=" mx-auto text-xs mt-1 mt-4">
			{{$t("home_label8")}}
		</div>
		<div class=" mx-auto text-xs mt-1 mt-4">
			{{$t("home_label9")}}
		</div>
		<div class=" mb-2 flex-col mt-6 text-xs p-[10px] inline-block text-center rounded-lg bg-[#ff8100] text-white">
			{{ $t("home_label10") }}
		</div>
	  </div> 
	</div>
	
	<div class="mt-10 company inline-block p-10 text-[#fff]">
	  <div class="p-3 border-[1px] w-[80%] inline-block border-[#fff] text-center text-sm rounded-full">
		 {{ $t("home_label11") }} 
	  </div>
	  <div class="text-[#ff8100] text-base font-bold mt-3">
		{{ $t("home_label12") }}  
	  </div>
	  
	  <div class="text-xl font-bold mt-4 mb-4">
	  		{{ $t("home_label13") }}  
	  </div>
	  <div class="text-xs font-bold mb-3">
	  		{{ $t("home_label14") }}  
	  </div>
	  <div class="text-xs font-bold mb-3">
	  		{{ $t("home_label15") }}  
	  </div>
	  <div class="text-xs font-bold mb-3">
	  		{{ $t("home_label16") }}  
	  </div>
	  <div class="text-xs font-bold mb-3">
	  		{{ $t("home_label17") }}  
	  </div>
	  <div class="text-xs font-bold mb-3">
	  		{{ $t("home_label18") }}  
	  </div>
	  <div class="text-xs font-bold mb-3">
	  		{{ $t("home_label19") }}  
	  </div>
	  
	  <div class="bg-white rounded-lg text-sm text-[#6e7482] p-4 mb-4">
	  		"{{ $t("home_label20") }}"  
			<!-- <div class="mt-4 text-[#6e7482] text-base">
				{{ $t("home_label21") }}
			</div>
			<div>
				{{ $t("home_label22") }}
			</div> -->
	  </div>
	</div>
	
	<WelcomeSummary ref="WelcomeSummaryRef"></WelcomeSummary>
    <!-- 行情结束 -->
    <Footer name="/"></Footer>
    <tradePassword ref="tradePasswordRef"></tradePassword>
  </div>
</template>
<script setup>
import Footer from "@/components/Footer.vue";
import HeaderTop from "@/components/HeaderTop.vue";
import tradePassword from "@/components/tradePassword.vue";
import { useCommonStore } from "../../store/modules/common";
import { onMounted, ref ,reactive,computed, defineOptions } from "vue";
import { getLevel,getNoticeList, userGetInfo } from "../../api/apis";

import { useRouter } from "vue-router";
import WelcomeSummary from "@/components/WelcomeSummary.vue";
defineOptions({
  name: 'Home' // 和 Layout keep-alive include 里名称完全一致
})
const WelcomeSummaryRef = ref(null);
const commonStore = useCommonStore();
const tradePasswordRef = ref(null);
const userInfo = ref({});


const bgMap = {
  VIP1: new URL("@/static/images/bg_vip1.png", import.meta.url).href,
  VIP2: new URL("@/static/images/bg_vip2.png", import.meta.url).href,
  VIP3: new URL("@/static/images/bg_vip3.png", import.meta.url).href,
  VIP4: new URL("@/static/images/bg_vip4.png", import.meta.url).href,
  VIP5: new URL("@/static/images/bg_vip5.png", import.meta.url).href,
};
const bgMapStart = {
  VIP1: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/172232700615694005.png",
  VIP2: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/1722327038574353214.png",
  VIP3: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/172232706362679225.png",
  VIP4: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/1722327102801555071.png",
  VIP5: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/1722342635975654072.png",
};

const router = useRouter();
const pics = [
	new URL("@/static/images/home/shark-tank-img.webp", import.meta.url).href,
	new URL("@/static/images/home/inc-5000-img.webp", import.meta.url).href,
	new URL("@/static/images/home/joe-rogan-img.webp", import.meta.url).href,
	new URL("@/static/images/home/target-img.webp", import.meta.url).href,
	new URL("@/static/images/home/good-morning-america-img.webp", import.meta.url).href,
]
const items = [
  // {
  //   name: "收入指南", // 用于 $t('收入指南')
  //   icon: new URL("@/static/images/icon-0.png", import.meta.url).href,
  //   route: "/guide",
  // },
  {
    name: "vip等级", // 用于 $t('收入指南')
    icon: new URL("@/static/images/home/icon-3.png", import.meta.url).href,
    route: "/vips",
  },
  {
    name: "事件",
    icon: new URL("@/static/images/home/icon-4.png", import.meta.url).href,
    route: "/event",
  },
  {
    name: "提款",
    icon: new URL("@/static/images/home/icon-5.png", import.meta.url).href,
    route: "/withdraw",
  },
  {
    name: "定金",
    icon: new URL("@/static/images/home/icon-6.png", import.meta.url).href,
    route: "/deposit",
  },
  {
    name: "条款及细则", // 用于 $t('收入指南')
    icon: new URL("@/static/images/home/icon-7.png", import.meta.url).href,
    route: "/clause",
  },
  {
    name: "证书",
    icon: new URL("@/static/images/home/icon-8.png", import.meta.url).href,
    route: "/cert",
  },
  {
    name: "常见问题解答",
    icon: new URL("@/static/images/home/icon-9.png", import.meta.url).href,
    route: "/faqs",
  },
  {
    name: "关于",
    icon: new URL("@/static/images/home/icon-10.png", import.meta.url).href,
    route: "/about",
  },
];

const content = [
	{
	  name: "home_label2",
	},
	{
	  name: "home_label3",
	},
	{
	  name: "home_label4",
	},
	{
	  name: "home_label5",
	},
	{
	  name: "home_label6",
	},
];

function goTo(path) {
	
  if (path == "/withdraw") {
	if(tradePassword.value){
	  router.push(path);	  
	}else{
	  tradePasswordRef.value.open(2);
	}  
  } else if (path == "/deposit") {
	if(tradePassword.value){
	  router.push(path);	  
	}else{
      tradePasswordRef.value.open(3);
	}
  } else {
    router.push(path);
  }
}
function toVips() {
  router.push("/vips");
}
const levelList = ref([]);
const level = async () => {
  let res = await getLevel();
  levelList.value = res.data;
  levelList.value.forEach(item => {
     if (item.descriptionEn) {
      // 把 ● 包到带 class 的 span 里（注意：这里保留了 ●）
      item.descriptionEn = item.descriptionEn.replace(/(●|•|&#8226;|&#9679;)/g, '<span class="small-dot">●</span>');
    }
  });
};

const query = reactive({
  pageNum: 1,
  pageSize: 10,
  lang: commonStore.clientLang
});
const noticeContent  = ref('')

const getData = async () => {
  const res = await getNoticeList(query); // 你自己的接口
  noticeContent.value = res.rows.length>0? res.rows[0].noticeContent :'';
  
}

// 计算属性，去除所有HTML标签
const pureNoticeContent = computed(() => {
  return noticeContent.value.replace(/<\/?[^>]+(>|$)/g, "")
})




onMounted(() => {
	console.log(8887)
  let round = localStorage.getItem('round')
  if(round == 0){
	WelcomeSummaryRef.value.open();
	localStorage.setItem('round', 1)
  }
  
  level();
  // getData();
  userGetInfo().then((res) => {
    tradePassword.value = res.data.tradePassword;
  });
});
</script>
<style>
.small-dot {
  font-size: 8px;       /* 调整大小 */
  line-height: 1;
  vertical-align: middle;
  display: inline-block; /* 保证可以控制尺寸/对齐 */
  /* 如需更细微缩放也可用 transform: scale(0.8); */
}
.headBg{
	/* background-image: linear-gradient(to right, #243c5e, #0d1f3b, #243c5e); */
	
  background-image: url(@/static/images/home/Frame-68.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.company{
  background-image: url(@/static/images/home/home-case-study-bg1.webp);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
