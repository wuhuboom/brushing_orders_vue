<template>
  <div class="container w-full min-h-[100vh] bg-[#ecf7ff]" @scroll="handleScroll">
	<van-sticky type="primary" style="z-index: 999" v-show="navBarShow">
	  <van-nav-bar
	    :title="$t('客服')"
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
	  :title="$t('客服')"
	  fixed
	  left-arrow
	  @click-left="onClickLeft"
	>
	  <template #left>
		<img class="rotate-180" src="@/static/images/base/right.png" style="width:22px" />
	  </template>
	</van-nav-bar>
    <div class="w-full p-6 box-border flex flex-col ">
	  <div class="py-2 text-center text-xl font-bold text-black">
	  	 {{ $t("客服文案1") }}
	  </div>
	  <div class="text-xs text-center text-[#4b4c5a] mt-1">
		 {{ $t("客服文案2") }} 
	  </div>
      <div class=" flex flex-col mt-4">
        <div
		  v-for="item in customerList"
		  @click="jump(item.linkUrl)"
          class="flex items-center rounded-2.5 justify-between p-4 my-1 box-border border-[1px] border-[#e6e6e6] bg-[#000]"
        >
          <div class="flex items-center text-white text-base font-medium">
            {{ item.name }}
          </div>
		  <img class="" src="@/static/images/base/right-white.png" style="width:22px" />
        </div>
      </div>
	  <div class="py-1 mt-6 text-xl font-bold text-black ">
	  	 {{ $t("客服文案3") }}
	  </div>
	  
	  <div class="text-xs text-[#4b4c5a] mt-1">
	    {{ $t("客服文案4") }} 
	  </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from '../../store/modules/user';
import { computed, onMounted, ref } from 'vue';
import { getCustomerService } from '../../api/apis';
import { useCommonStore } from "../../store/modules/common";
const commonStore = useCommonStore();
const userStore = useUserStore()
const router = useRouter();
const navBarShow = ref(false);
const customerList = ref([])
const toPage = (path) => {
  router.push({
    path: path,
  });
};
onMounted(() => {
  userStore.getUserInfo()
  getCustomer()
})
const getCustomer = async() =>{
  let res = await getCustomerService({lang: commonStore.clientLang});
  customerList.value = res.data
  console.log(customerList.value)
}

const jump = (url) =>{
  window.open(url)
}

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
