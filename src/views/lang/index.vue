<template>
  <div class="container w-full min-h-[100vh] bg-[#ecf7ff]" @scroll="handleScroll">
	<van-sticky type="primary" style="z-index: 999" v-show="navBarShow">
	  <van-nav-bar
	    :title="$t('语言')"
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
	  :title="$t('语言')"
	  fixed
	  left-arrow
	  @click-left="onClickLeft"
	>
	  <template #left>
		<img class="rotate-180" src="@/static/images/base/right.png" style="width:22px" />
	  </template>
	</van-nav-bar>
    <div class="w-full p-6 box-border flex flex-col ">
      <div class=" flex flex-col mt-4">
        <div
		  v-for="item in LANGS"
		  @click="handleChangeLang(item)"
          class="text-center p-[20px] my-1.5 box-border border-[1px] border-[#000] bg-[#fff]"
		  :class="commonStore.clientLang === item.code?'current':''"
        >
          <div 
		    v-if="commonStore.clientLang === item.code"
			class="text-center text-white text-base font-medium"
		  >
            {{ item.name }}
          </div>
		  <div 
		    v-else
			class="text-center text-black text-base font-medium"
		  >
		    {{ item.name }}
		  </div>
		</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useUserStore } from '../../store/modules/user';
import { computed, onMounted, ref } from 'vue';
import { LANGS } from "@/config/lang";
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useCommonStore } from "../../store/modules/common";
import { useI18n } from "vue-i18n";
import { getStaticImageUrl } from "../../util/utils";
import { useLocale } from "../../util/useLocale";
const userStore = useUserStore()
const { locale } = useI18n();
const router = useRouter();
const commonStore = useCommonStore();
const { setLocale } = useLocale();
const navBarShow = ref(false);
const customerList = ref([])
const toPage = (path) => {
  router.push({
    path: path,
  });
};
onMounted(() => {
  userStore.getUserInfo()
  // getCustomer()
})
const getCustomer = async() =>{
  let res = await getCustomerService();
  customerList.value = res.data
  console.log(customerList.value)
}

function handleChangeLang(item) {
  if (commonStore.clientLang === item.code) return;
  commonStore.updateLang(item.code);
  locale.value = item.code;
  setLocale(locale.value);
  close();
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
  // const onClickLeft = () => router.back();
  
</script>

<style scoped>
.current{
	background-color: #000;
}
</style>