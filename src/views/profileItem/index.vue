<template>
  <div class="container w-full min-h-[100vh] bg-[#fff]" @scroll="handleScroll">
	<van-sticky type="primary" style="z-index: 999" v-show="navBarShow">
	  <van-nav-bar
	    :title="$t('修改信息')"
	    fixed
	    left-arrow
	    @click-left="onClickLeft"
	  >
	  </van-nav-bar>
	</van-sticky>
	<HeaderTop></HeaderTop>
	<van-nav-bar
	  class="pos"
	  :title="$t('修改信息')"
	  fixed
	  left-arrow
	  @click-left="onClickLeft"
	>
	</van-nav-bar>
    <div class="w-full p-6 box-border flex flex-col ">
	  <div class="py-4 text-base font-bold text-black">
	  	{{ $t("我的信息") }}
	  </div>
      <div class="flex flex-col">
        <!-- <div
          class="flex items-center justify-between p-4 box-border border-b-[2px] border-[#fff]"
          @click="toPage('/profile')"
        >
          <div class="flex items-center text-black text-sm font-medium">
            {{ $t("修改个人信息") }}
          </div>
          <van-icon name="arrow" size="22px" />
        </div> -->
        <div
          class=" bg-[#f9f9f9]  p-4 box-border border-[1px] border-[#e6e6e6]"
        >
          <div class="flex items-center text-black text-base font-bold">
            {{ $t("用户名") }}
          </div>
          <div class="text-[#666] text-sm font-medium">{{userStore.userInfo.username}}</div>
        </div>
        <div
          class=" bg-[#f9f9f9] mt-4  p-4 box-border border-[1px] border-[#e6e6e6]"
        >
          <div class="flex items-center text-black text-base font-bold">
            {{ $t("电话") }}
          </div>
          <div class="text-[#666] text-sm font-medium">{{userStore.userInfo.phone}}</div>
        </div>
		<div
		  class=" bg-[#f9f9f9] mt-4  p-4 box-border border-[1px] border-[#e6e6e6]"
		>
		  <div class="flex items-center text-black text-base font-bold">
		    {{ $t("性别") }}
		  </div>
		  <div class="text-[#666] text-sm font-medium">
			  {{userStore.userInfo.sex == 1? $t("女"): $t("男")}}
		  </div>
		</div>
      </div>
	  <div class="py-4 mt-4 text-base font-bold text-black">
		  {{ $t("安全") }}
	  </div>
      <div class=" flex flex-col">
        <div
          class="flex items-center justify-between p-4 box-border border-[1px] border-[#e6e6e6] bg-[#f9f9f9]"
          @click="toPage('/updatePassword')"
        >
          <div class="flex items-center text-black text-base font-medium">
            {{ $t("更新密码") }}
          </div>
		  <!-- <img class="" src="@/static/images/base/right.png" style="width:22px" /> -->
			<van-icon class="w-[20px]" style="float: left;" name="arrow" size='22'></van-icon>
        </div>
        <div
          class="flex items-center justify-between p-4 mt-4 box-border border-[1px] border-[#e6e6e6] bg-[#f9f9f9]"
          @click="toPage('/updateTransactionPassword')"
          >
          <div class="flex items-center text-black text-base font-medium">
            {{ $t("更新交易密码") }}
          </div>
		  <!-- <img class="" src="@/static/images/base/right.png" style="width:22px" /> -->
			<van-icon class="w-[20px]" style="float: left;" name="arrow" size='22'></van-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from '../../store/modules/user';
import { computed, onMounted, ref } from 'vue';
const userStore = useUserStore()
const router = useRouter();
const navBarShow = ref(false);
const toPage = (path) => {
  router.push({
    path: path,
  });
};
onMounted(() => {
  userStore.getUserInfo()
})

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
