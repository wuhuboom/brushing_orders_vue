<template>
  <div class="w-full h-[100vh] overflow-y-scroll bg-[#ecf7ff] flex flex-col pb-6" @scroll="handleScroll">
    <van-sticky type="primary" style="z-index: 999" v-show="navBarShow">
      <van-nav-bar
        :title="$t('我的')"
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
	  :title="$t('我的')"
	  fixed
	  left-arrow
	  @click-left="onClickLeft"
	>
	  <template #left>
		<img class="rotate-180" src="@/static/images/base/right.png" style="width:22px" />
	  </template>
	</van-nav-bar>
    <div class="w-full py-3">
      <div class="w-[90%] mx-auto">
        <div class="w-[12rem] mx-auto relative" style="z-index: 19">
          <img
            :src="userInfo.avatar ==null?userImg:userInfo.avatar"
            class="w-[6rem] h-[6rem] mx-auto rounded-full border-[2px] border-[#000]"
            alt=""
          />
        </div>
		<div class="text-[#000] w-full text-center text-sm mt-2" @click="toPage('/profile')">
		  <van-icon name="edit" /> 
		  <span class="mr-1">&nbsp;{{$t('点击更改')}}</span>
		</div>
        <div
          class="w-full p-4 mt-[1rem] pb-10 relative"
          style="background: #1d6cfd"
        >
          <div class="text-black text-center absolute top-5 right-5">
            <!-- <img :src="bgMapStart[userInfo.levelId-1]" class="w-12" alt="" /> -->
			<img :src="avatarUrl" class="w-12" alt="" />
            <p class="text-[#000] text-sm font-semibold">
              VIP{{ userInfo.levelId }}
            </p>
          </div>
          <div class="w-full  mt-[1rem]">
            <div class="flex text-black text-lg flex-col">
				<p class="text-xl  text-black">
				  {{ $t("你好") }}
				</p>
              <p class="text-2xl font-bold text-black">
                {{ userInfo.username }}
              </p>
            </div>
          </div>
          
          <div
            class="w-full flex items-center pt-4 pb-4 text-center box-border overflow-hidden mt-4"
          >
			<div class="w-[50%] flex flex-col justify-center items-center">
			  <div class="text-[#000] text-[12px]">
			    {{ $t("邀请码") }}
			  </div>
			  <div class="text-xs text-[#000] mt-1">
			    <span class="text-base font-semibold">{{
			      userInfo.inviteCode
			    }}</span>
				<img
				  src="@/static/images/copy.png"
				  class="w-4 h-4 ml-2"
				  alt=""
				  @click="copyContent(userInfo.inviteCode)"
				/>
			  </div>
			</div>
			<div class="w-[1px] h-8 bg-[#000]"></div>
            <div class="w-[50%] flex flex-col justify-center items-center">
              <div class="text-[#000] text-[12px]">
                {{ $t("钱包余额") }}
                <div>(USD)</div>
              </div>
              <div class="text-xs text-[#000] mt-1">
                <span class="text-base font-semibold">{{
                  userInfo.totalBalance
                }}</span>
              </div>
            </div>
            <div class="w-[1px] h-8 bg-[#000]"></div>
            <div class="w-[50%] flex flex-col justify-center items-center">
              <div class="text-[#000] text-[12px]">
                {{ $t("当日佣金") }}
                <div>(USD)</div>
              </div>
              <div class="text-xs text-[#000] mt-1">
                <span class="text-base font-semibold">{{
                  userInfo.commission
                }}</span>
              </div>
            </div>
          </div>
		  <div
		    class="w-full mt-3 flex justify-start items-center pl-1 pr-1 text-black"
		  >
		    <div class="text-[10px] mr-2">{{ $t("信用评分") }}:</div>
		    <div class="flex-auto">
		      <van-progress
		        color="rgb(0, 0, 0)"
		        :percentage="userInfo.creditScore"
		        :show-pivot="false"
		        stroke-width="8"
		      />
		    </div>
		    <div class="text-black text-[10px] ml-1">
		      {{ userInfo.creditScore }}%
		    </div>
		  </div>
        </div>
      </div>
    </div>

    <!-- 我的详细信息 -->
    <div class="flex flex-col w-[90%] mx-auto mt-2">
      <div class="mt-4 mb-4 text-black text-lg font-bold text-base ">
        {{ $t("我的详细信息") }}
      </div>
      <div class="flex flex-col rounded-xl bg-[#fff]">
        <div
          class="flex items-center justify-between p-4 pl-2 bg-[#1d6cfd] rounded-2.5"
          @click="toPage('/profileItem')"
        >
          <div class=" w-full flex items-center justify-between">
            <div class="flex items-center justify-between">
				<img class="w-8 mr-2" style="float: left;" src="@/static/images/my/icon-1.png"/>
				<div class="text-[#000] text-base font-bold" style="float: left;">
				  {{ $t("个人信息") }}
				</div>
			</div>
			<img style="float: right;" class="w-[20px]" src="@/static/images/base/right.png"/>
          </div>
        </div>
        <div
          class="flex items-center justify-between p-4 pl-2 bg-[#1d6cfd] rounded-2.5 mt-2"
          @click="payMethod"
        >
          <div class=" w-full flex items-center justify-between">
            <div class="flex items-center justify-between">
				<img class="w-8 mr-2" style="float: left;" src="@/static/images/my/icon-2.png"/>
				<div class="text-[#000] text-base font-bold text-left" style="float: left;">
				  {{ $t("付款方式") }}
				</div>
			</div>
            <img style="float: right;" class="w-[20px]" src="@/static/images/base/right.png"/>
          </div>
        </div>
      </div>
    </div>
	
    <!-- 我的财务 -->
    <div class="flex flex-col w-[90%] mx-auto mt-2">
      <div class="mt-4 mb-4 text-black text-lg font-bold">
        {{ $t("我的财务") }}
      </div>
      <div class="flex flex-col rounded-xl bg-[#fff]">
		<div
		  class="flex items-center justify-between p-4 pl-2 bg-[#1d6cfd] rounded-2.5"
		  @click="toPage('/deposit')"
		>
		  <div class=" w-full flex items-center justify-between">
		    <div class="flex items-center justify-between">
				<img class="w-8 mr-2" style="float: left;" src="@/static/images/my/icon-3.png"/>
				<div class="text-[#000] text-base font-bold" style="float: left;">
				  {{ $t("定金") }}
				</div>
			</div>
			<img style="float: right;" class="w-[20px]" src="@/static/images/base/right.png"/>
		  </div>
		</div>
		<div
		  class="flex items-center justify-between p-4 pl-2 bg-[#1d6cfd] rounded-2.5 mt-2"
		  @click="toPage('/withdraw')"
		>
		  <div class=" w-full flex items-center justify-between">
		    <div class="flex items-center justify-between">
				<img class="w-8 mr-2" style="float: left;" src="@/static/images/my/icon-4.png"/>
				<div class="text-[#000] text-base font-bold" style="float: left;">
				  {{ $t("提取") }}
				</div>
			</div>
			<img style="float: right;" class="w-[20px]" src="@/static/images/base/right.png"/>
		  </div>
		</div>
      </div>
    </div>


    <!-- 其他 -->
    <div class="flex flex-col w-[90%] mx-auto mt-2">
      <div class="mt-4 mb-4 text-black text-lg font-bold">
        {{ $t("其他") }}
      </div>
      <div class="flex flex-col rounded-xl bg-[#fff]">
		<div
		  class="flex items-center justify-between p-4 pl-2 bg-[#1d6cfd] rounded-2.5"
		  @click="toPage('/contact')"
		>
		  <div class=" w-full flex items-center justify-between">
		    <div class="flex items-center justify-between">
				<img class="w-8 mr-2" style="float: left;" src="@/static/images/my/icon-8.png"/>
				<div class="text-[#000] text-base font-bold" style="float: left;">
				  {{ $t("联系我们") }}
				</div>
			</div>
			<img style="float: right;" class="w-[20px]" src="@/static/images/base/right.png"/>
		  </div>
		</div>
		<div
		  class="flex items-center justify-between p-4 pl-2 bg-[#1d6cfd] rounded-2.5 mt-2"
		  @click="toPage('/notice')"
		>
		  <div class=" w-full flex items-center justify-between">
		    <div class="flex items-center justify-between">
				<img class="w-8 mr-2" style="float: left;" src="@/static/images/my/icon-5.png"/>
				<div class="text-[#000] text-base font-bold" style="float: left;">
				  {{ $t("通知") }}
				</div>
			</div>
			<img style="float: right;" class="w-[20px]" src="@/static/images/base/right.png"/>
		  </div>
		</div>
		<div
		  class="flex items-center justify-between p-4 pl-2 bg-[#1d6cfd] rounded-2.5 mt-2"
		  @click="toPage('/lang')"
		>
		  <div class=" w-full flex items-center justify-between">
		    <div class="flex items-center justify-between">
				<img class="w-8 mr-2" style="float: left;" src="@/static/images/my/icon-6.png"/>
				<div class="text-[#000] text-base font-bold" style="float: left;">
				  {{ $t("更改语言") }}
				</div>
			</div>
			<img style="float: right;" class="w-[20px]" src="@/static/images/base/right.png"/>
		  </div>
		</div>
		
		<div
		  class="flex items-center justify-between p-4 pl-2 bg-[#1d6cfd] rounded-2.5 mt-2"
		  @click="toPage('/account/logout')"
		>
		  <div class=" w-full flex items-center justify-between">
		    <div class="flex items-center justify-between">
				<img class="w-8 mr-2" style="float: left;" src="@/static/images/my/icon-7.png"/>
				<div class="text-[#000] text-base font-bold" style="float: left;">
				  {{ $t("登出") }}
				</div>
			</div>
			<img style="float: right;" class="w-[20px]" src="@/static/images/base/right.png"/>
		  </div>
		</div>
      </div>
    </div>
    <ContactUs ref="ContactUsRef"></ContactUs>
    <tradePassword ref="tradePasswordRef"></tradePassword>
    <Lang ref="langRef"></Lang>
    <!-- <van-popup
      v-model:show="show"
      closeable
      position="bottom"
      class="p-5"
      :style="{ height: '30%' }"
    >
      <div class="text-[#666] font-semibold text-base pl-4 mt-10">
        {{ $t("交易密码") }}
      </div>
      <div class="w-full mt-2 overflow-hidden shadow">
        <van-field
          v-model="tradePassword"
          label=""
          placeholder="交易密码"
          label-align="top"
        />
      </div>
      <div class="w-full mt-4">
        <van-button color="#007513" class="w-full" @click="submitTradePassword">{{ $t("提交") }}</van-button>
      </div>

    </van-popup> -->
  </div>
</template>
<script setup>
import ContactUs from "@/components/ContactUs.vue";
import tradePassword from "@/components/tradePassword.vue";
import HeaderTop from "@/components/HeaderTop.vue";
import { userGetInfo, checkTradePassword } from "../../api/apis";
import { useUserStore } from "@/store/modules/user";
import { useI18n } from "vue-i18n";
import { showConfirmDialog } from "vant";
const langRef = ref(null);
const { t } = useI18n();
const ContactUsRef = ref(null);
const tradePasswordRef = ref(null);
const userImg = new URL("@/static/images/userImg.png", import.meta.url)
  .href;
const bgImage = new URL("@/static/images/bg-3.png", import.meta.url)
  .href;
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { copyContent } from '../../util/utils';
const userStore = useUserStore();
const url = window.g.VITE_API_IMG_URL;
const router = useRouter();
const userInfo = ref({});
const avatarUrl = ref("");
const navBarShow = ref(false);

const bgMapStart = [
  "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/172232700615694005.png",
  "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/1722327038574353214.png",
   "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/172232706362679225.png",
   "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/1722327102801555071.png",
 "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/1722342635975654072.png",
]
const toPage = (path) => {
  router.push({
    path: path,
  });
};
const customer = () => {
  ContactUsRef.value.open();
};
const logout = () => {
  showConfirmDialog({
    title: t('退出'),
    message: t("确定要退出?"),
    confirmButtonColor: '#007513', // 确认按钮颜色（红色示例）
  })
    .then(() => {
      userStore.logout();
    })
    .catch(() => {
      // on cancel
    });
};

const payMethod = () => {
  // show.value = true;
  if(userInfo.value.tradePassword){
    router.push({
      path: "/paymentMethods",
    });
  }else{
    tradePasswordRef.value.open(1);
  }
};
const submitTradePassword = async () => {
  if (!tradePassword.value) return ElMessage.error(t("请输入交易密码"));
  console.log(tradePassword.value);
  let ruleForm = {
    tradePassword: tradePassword.value,
  };
  let res = await checkTradePassword(ruleForm);
  router.push({
    path: "/paymentMethods",
  });
};

function handleChangeLang() {
  langRef.value.open();
}

const copy = (text) => {

}
const onClickLeft = () => history.back();
function handleScroll(e) { 
  const scrollTop = e.target.scrollTop
  if(scrollTop> 90){
	  navBarShow.value = true
  }else{
	  navBarShow.value = false
  }
}
onMounted(() => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
    avatarUrl.value = `${url}${res.data.userLevel.icon}`;
    // console.log(userInfo.value);
  });
});
</script>

<style scoped>
</style>
