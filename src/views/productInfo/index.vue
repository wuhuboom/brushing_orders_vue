<template>
  <div class="w-full bg-[#fff4f3]">
	<van-sticky type="primary" style="z-index: 999" v-show="navBarShow">
	  <van-nav-bar
	    :title="$t('产品详情')"
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
	  :title="$t('产品详情')"
	  fixed
	  left-arrow
	  @click-left="onClickLeft"
	>
	  <template #left>
		<img class="rotate-180" src="@/static/images/base/right.png" style="width:22px" />
	  </template>
	</van-nav-bar>
    <div class=" bg-[#ffffff] relative border-[1px] border-[#e6e6e6] m-2 rounded-[10px]">
      <div class="w-[50%] mx-auto mt-6 box-shadow border-[4px] border-[#c2c2c2] rounded-[10px]">
        <van-image
          width="100%"
		  radius="20"
          fit="contain"
          :src="url+goods.coverUrl"
        />
      </div>
      <div class="w-full mt-[-3rem] text-center pt-[4rem] text-[#000] p-4 rounded-lg">
      <!--  <div class="w-[100%] mx-auto text-center text-sm font-semibold">
          {{goods.product.goodsName}}
        </div> -->
		<div class="w-[70%] mx-auto">
			<p class="w-[100%] mx-auto text-center title text-[#000] text-base font-semibold whitespace-nowrap  text-ellipsis overflow-hidden">
			  {{ goods.name }}
			</p>
			<div class="">
			  <van-icon name="star" color="#f99d25"></van-icon>
				4.9
			</div>
			<p class="price text-xl">
				<span class="text-base mr-2">
					{{ $t("当前价格") }}
				</span>
				<span class="text-xl font-bold mr-2">
					{{ goods.price }}
				</span>
				<span class="text-sm">
					{{ $t("美元") }}
				</span>			  
			</p>
		</div>
        <div class="flex w-full items-center pt-4 pb-4 mt-4">
          <div
            class="w-[50%] mr-2 flex flex-col py-4 bg-[#fff4f3] border-[#000] border-[1px] rounded-[10px] justify-center items-center"
          >
            <div class="text-[#000] font-semibold">{{$t('价格')}}</div>
            <div class="text-xs text-[#000] mt-1">
              <span class="text-sm mr-1 text-[#000] font-semibold">{{order.price}}</span>
              USD
            </div>
          </div>
          <div
            class="w-[50%] mr-2 flex flex-col py-4 bg-[#fff4f3] border-[#000] border-[1px] rounded-[10px] justify-center items-center"
          >
            <div class="text-[#000] font-semibold">{{ $t('佣金') }}</div>
            <div class="text-xs text-[#000] mt-1">
              <span class="text-sm mr-1 text-[#000] font-semibold">{{order.commission}}</span>
              USD
            </div>
          </div>
        </div>
        <div class="bg-[#fff4f3] border-[#000] border-[1px] rounded-[10px] p-4">
          <div class="flex justify-between items-center box-border">
            <div class="text-[#000] text-sm">{{$t('创建时间')}}</div>
            <div class="text-[#000] text-sm font-bold" v-if="order.createTime">{{ formatWithTimezone(goods.createTime,userStore.zoneActive.tzName)  }}</div>
          </div>
          <div class="flex justify-between items-center box-border mt-2">
            <div class="whitespace-nowrap text-[#000] text-sm">
              {{$t('编号')}}
            </div>
            <div class="text-[#000] text-xs font-bold">
              {{order.orderNo}}
            </div>
          </div>
        </div>
		<div @click="submitForm" class="w-full mt-16 mb-6" size="large" round>
		  <div
		    class="w-full text-white text-xl font-semibold mx-auto py-4 rounded-lg flex items-center justify-center bg-[#000]"
		  >
		    <div>{{ $t("提交") }}</div>
		  </div>
		</div>
      </div>
    </div>
    <Footer name="/starting"></Footer>
   <!-- <van-popup
      v-model:show="showCenter"
      round
      closeable
      :style="{ width:'80%' }"
    >
      <div class="w-[5rem] mx-auto mt-6">
        <van-image
          width="6rem"
          height="6rem"
          fit="contain"
          :src="url+goods.coverUrl"
        />
      </div>
      <div class="w-full mt-[-3rem] pt-[4rem] text-[#000] p-4 rounded-lg">
        <div class="w-[100%] mx-auto text-center text-sm font-semibold">
          {{goods.goodsName}}
        </div>
        <div class="flex w-full items-center pt-4 pb-4 mt-4">
          <div
            class="w-[50%] mr-2 flex flex-col py-4 bg-[#d8d8d8] justify-center items-center"
          >
            <div class="text-[#000] font-semibold">{{$t('价格')}}</div>
            <div class="text-xs text-[#000] mt-1">
              <span class="text-sm mr-1 text-[#000] font-semibold">{{goods.price}}</span>
              USD
            </div>
          </div>
          <div
            class="w-[50%] mr-2 flex flex-col py-4 bg-[#d8d8d8] justify-center items-center"
          >
            <div class="text-[#000] font-semibold">{{ $t('佣金') }}</div>
            <div class="text-xs text-[#000] mt-1">
              <span class="text-sm mr-1 text-[#000] font-semibold">{{goods.commission}}</span>
              USD
            </div>
          </div>
        </div>
        <div class="bg-[#d8d8d8] p-4">
          <div class="flex justify-between items-center box-border">
            <div class="text-[#000] text-sm">{{$t('创建时间')}}</div>
            <div class="text-[#000] text-sm font-bold">{{ formatWithTimezone(goods.createTime,userStore.zoneActive.tzName)  }}</div>
          </div>
          <div class="flex justify-between items-center box-border mt-2">
            <div class="whitespace-nowrap text-[#000] text-sm">
              {{$t('编号')}}
            </div>
            <div class="text-[#000] text-xs font-bold">
              {{goods.orderNo}}
            </div>
          </div>
        </div>
        <div class="w-full mt-4">
          <van-button color="#007513" class="w-full" @click="submitForm">{{
            $t("提交")
          }}</van-button>
        </div>
      </div>
    </van-popup> -->
   <!-- <van-popup
      v-model:show="showImg"
      round
      :style="{ width:'80%',background: 'transparent' }"
    >
      <img class="w-[100%]" src="../../static/images/super.png" alt="">
    </van-popup> -->
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import HeaderTop from "@/components/HeaderTop.vue";
import Footer from "@/components/Footer.vue";
import { showLoadingToast,closeToast,showFailToast,showSuccessToast,showToast } from 'vant';
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import {formatWithTimezone}  from '../../util/utils'
import { useUserStore } from "@/store/modules/user";
import {
  userGetInfo,
  getGoodsInfo,
  createOrder,
  submitOrder,
} from "../../api/apis";
const userStore = useUserStore();
const url = window.g.VITE_API_IMG_URL;
const { t } = useI18n();
const avatarUrl = ref("");
const router = useRouter();
const route = useRoute()

const navBarShow = ref(false);

const goods = ref({
	coverUrl: '',
	name:''
});
const order = ref({});
const getList =  () => {
  let id = route.query.id;
  getGoodsInfo(id).then((res) => {
    goods.value = res.data.product;
    order.value = res.data;
  });
};


const submitForm = () => {
  submitOrder(order.value.id).then((res)=>{
        showSuccessToast(t("提交成功"));
        if(res.code == 201) {
           // goods.value =  res.data
        } else {
			onClickLeft()
        }
    })
};
onMounted(() => {
  getList();
});
const toPage = (path) => {
  router.push({
    path: path,
  });
};

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
</style>