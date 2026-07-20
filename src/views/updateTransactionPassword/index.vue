<template>
  <div class="container w-full min-h-[100vh] bg-[#ecf7ff]" @scroll="handleScroll">
    <van-sticky type="primary" style="z-index: 999" v-show="navBarShow">
      <van-nav-bar
        :title="$t('更新交易密码')"
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
      :title="$t('更新交易密码')"
      fixed
      left-arrow
      @click-left="onClickLeft"
    >
      <template #left>
    	<img class="rotate-180" src="@/static/images/base/right.png" style="width:22px" />
      </template>
    </van-nav-bar>
    <div class="w-full pl-6 mt-6 pr-6 box-border flex flex-col">
	  <div class="font-bold text-base text-black py-3">
	    {{ $t("基金密码") }}  
	  </div>
      <div class="w-full mt-2 flex flex-col">
        <div class="w-full overflow-hidden bg-[#f9f9f9] border-[1px] border-[#e6e6e6] py-1 pt-4">
		  <div class="ml-7.5 font-bold text-base">
		  	{{$t('旧密码') }}<span class="text-red ml-1">*</span>
		  </div>
          <van-cell-group inset>
            <van-field
              v-model="ruleForm.oldTradePassword"
              :type="isPwd1 ? 'password' : 'text'"
              :placeholder="$t('旧密码')"
            >
              <template #right-icon>
                  <van-icon
            	    size = "28px"
                    :name="isPwd1 ? 'eye' : 'eye-o'"
                    @click="isPwd1 = !isPwd1"
                  />
              </template>
            </van-field>
          </van-cell-group>
        </div>
        <div class="w-full mt-2 overflow-hidden bg-[#f9f9f9] border-[1px] border-[#e6e6e6] py-1 pt-4">
	      <div class="ml-7.5 font-bold text-base">
	        {{$t('新密码') }}<span class="text-red ml-1">*</span>
	      </div>
          <van-cell-group inset>
            <van-field
              :type="isPwd2 ? 'password' : 'text'"
              v-model="ruleForm.newTradePassword"
              :placeholder="$t('新密码')"
            >
              <template #right-icon>
                  <van-icon
            	    size = "28px"
                    :name="isPwd2 ? 'eye' : 'eye-o'"
                    @click="isPwd2 = !isPwd2"
                  />
              </template>
            </van-field>
          </van-cell-group>
        </div>
        <div class="w-full mt-2 overflow-hidden bg-[#f9f9f9]  border-[1px] border-[#e6e6e6] py-1 pt-4">
		  <div class="ml-7.5 font-bold text-base">
		  	{{$t('确认密码') }}<span class="text-red ml-1">*</span>
		  </div>
          <van-cell-group inset>
            <van-field
              :type="isPwd3 ? 'password' : 'text'"
              v-model="agentNewPassword"
              :placeholder="$t('确认密码')"
            >
              <template #right-icon>
                  <van-icon
            	    size = "28px"
                    :name="isPwd3 ? 'eye' : 'eye-o'"
                    @click="isPwd3 = !isPwd3"
                  />
              </template>
            </van-field>
          </van-cell-group>
        </div>
      </div>
	  <div class="text-xs text-[#4b4c5a] mt-1">
	  		{{ $t("修改密码说明") }}  
	  </div>
	  <div class="w-full mt-6">
	    <div @click="submitForm()" class="w-full" size="large" round>
	      <div
	        class="w-full text-white text-xl font-semibold mx-auto py-4 rounded-lg flex items-center justify-center my-4 bg-black border border-[#000]"
	      >
	        <div>{{ $t("更新") }}</div>
	      </div>
	    </div>
	  </div>
    <!--  <div class="w-full mt-4">
        <van-button color="#007513" class="w-full" @click="submitForm">{{ $t("更新") }}</van-button>
      </div> -->
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref,reactive } from "vue";
import { editTradePassword } from "../../api/apis";
import { showLoadingToast,closeToast,showFailToast,showSuccessToast   } from 'vant';
import { useRouter } from "vue-router";
const router = useRouter();
const agentNewPassword = ref('');
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const navBarShow = ref(false);
const isPwd1 = ref(true)
const isPwd2 = ref(true)
const isPwd3 = ref(true)
const ruleForm = reactive({
  oldTradePassword: "",
  newTradePassword: "",
});
const onClickLeft = () => router.replace('/profileItem');
const submitForm = async () => {
  if (!ruleForm.oldTradePassword) return showFailToast(t("请输入旧密码"));
  if (!ruleForm.newTradePassword) return showFailToast(t("请输入新密码"));

  // 校验密码长度 6-18 位
  if (ruleForm.newTradePassword.length < 6 || ruleForm.newTradePassword.length > 18) {
    return showFailToast(t("密码长度需为 6-18 位"));
  }

  if (ruleForm.newTradePassword !== agentNewPassword.value) {
    return showFailToast(t("两次密码不一致"));
  }

  let res = await editTradePassword(ruleForm);
  showSuccessToast(t("修改成功"));
  router.push({ path: "/profileItem" });
};
function handleScroll(e) { 
  const scrollTop = e.target.scrollTop
  if(scrollTop> 90){
	  navBarShow.value = true
  }else{
	  navBarShow.value = false
  }
}
</script>
