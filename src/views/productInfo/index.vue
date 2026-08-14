<template>
  <div class="w-full bg-[#fff]">
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
    <div class="product-content bg-[#e6e6e6]  pt-6 pl-4 pr-4">
      <div class=" bg-[#e6e6e6] product-image-frame w-[50%] h-[213px] mx-auto ">
        <van-image
          class="product-image"
		  radius="20"
          fit="contain"
          :src="getImageUrl(goods.coverUrl)"
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
            class="w-[50%] mr-2 flex flex-col py-4 bg-[#11284e] border-[#000] border-[1px] justify-center items-center"
          >
            <div class="text-[#fff] font-semibold">{{$t('价格')}}</div>
            <div class="text-xs text-[#fff] mt-1">
              <span class="text-sm mr-1 text-[#fff] font-semibold">{{order.price}}</span>
            </div>
			<div class="text-sm mr-1 text-[#fff] font-semibold">
			  {{ $t("美元") }}
			</div>
          </div>
          <div
            class="w-[50%] flex flex-col py-4 bg-[#11284e] border-[#000] border-[1px] justify-center items-center"
          >
            <div class="text-[#fff] font-semibold">{{ $t('佣金') }}</div>
            <div class="text-xs text-[#fff] mt-1">
              <span class="text-sm mr-1 text-[#fff] font-semibold">{{order.commission}}</span>
            </div>
			<div class="text-sm mr-1 text-[#fff] font-semibold">
			  {{ $t("美元") }}
			</div>
          </div>
        </div>
        <div class="bg-[#11284e] border-[#000] border-[1px] p-4">
          <div class="flex justify-between items-center box-border">
            <div class="text-[#fff] text-sm">{{$t('创建时间')}}</div>
            <div class="text-[#fff] text-sm font-bold" v-if="order.createTime">{{ formatWithTimezone(goods.createTime,userStore.zoneActive.tzName)  }}</div>
          </div>
          <div class="flex justify-between items-center box-border mt-2">
            <div class="whitespace-nowrap text-[#fff] text-sm">
              {{$t('编号')}}
            </div>
            <div class="text-[#fff] text-xs font-bold">
              {{order.orderNo}}
            </div>
          </div>
        </div>
		<div @click="submitForm" class="submit-dock" size="large" round>
		  <div
		    class="submit-button"
		  >
		    <div>{{ $t("提交") }}</div>
		  </div>
		</div>
      </div>
    </div>
    <Footer name="/starting"></Footer>
	<van-dialog
	  class="submit-dialog"
	  v-model:show="showCenter"
	  :showConfirmButton="false"
		close-on-click-overlay
	>
	  <div class="submit-animation">
	    <img class="submit-animation-image" src="@/static/images/base/submit.gif" alt="Submitting"/>
	  </div>
	</van-dialog>
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
import { getImageUrl } from "@/util/imageUrl";
import { errorMessages } from "../../api/errorCodeMap";
import {
  userGetInfo,
  getGoodsInfo,
  createOrder,
  submitOrder,
} from "../../api/apis";
const userStore = useUserStore();
const showCenter = ref(false);
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
  showCenter.value = true
  setTimeout(function() {
	  showCenter.value = false
	  submitOrder(order.value.id).then((res)=>{
	    showSuccessToast(t("提交成功"));
	    //   if(res.code == 201) {
	    //      goods.value =  res.data
	    //   } else {
	  		// onClickLeft()
	    //   }
		  toPage("/starting");
	  })
	  .catch((err) => {
	      if (err.code == 916) {
	          // showToast(t("insufficient_balance_please"));
			  toPage("/deposit");
	          return;
	      }
		  if (err.code == 918) {
		  	  toPage("/starting");
		      return;
		  }
	      if (err.code == 906) {
	          if (userInfo.value.balance <= 0) {
	              // showToast(t("transaction_failed"));
	          } else {
	              // showToast(t(errorMessages[err.code] || "创建失败"));
	          }
	      } else {
	          // showToast(t(errorMessages[err.code] || "创建失败"));
	      }
	  })
	  .finally(() => {
	      isMissionSubmitting.value = false;
	  });
  }, 3000);
  
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
.product-content {
  padding-bottom: 82px;
}

.product-image-frame {
  overflow: hidden;
  border: 4px solid #c2c2c2;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.16);
}

.product-image {
  display: block;
  width: 100%;
  height: 100%;
}

:deep(.product-image .van-image__img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.submit-dock {
  position: fixed;
  right: auto;
  bottom: calc(112px + env(safe-area-inset-bottom));
  left: 50%;
  width: min(100%, var(--app-max-width));
  transform: translateX(-50%);
  z-index: 60;
  padding: 8px 20px;
  height: 80px;
/*  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08); */
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 58px;
  padding: 10px 16px;
  border-radius: 8px;
  background: #ff8100;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.25;
}

.submit-button:active {
  opacity: 0.85;
}

:deep(.submit-dialog.van-dialog) {
  width: min(68vw, 260px);
  max-width: 260px;
  border-radius: 18px;
  background: transparent;
  overflow: hidden;
}

.submit-animation {
  padding: 8px;
  background: #fff;
  border-radius: 18px;
}

.submit-animation-image {
  display: block;
  width: 100%;
  height: auto;
  max-height: 42vh;
  object-fit: contain;
  border-radius: 12px;
}
</style>
