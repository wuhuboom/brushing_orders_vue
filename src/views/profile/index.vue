<template>
  <div class="container w-full min-h-[100vh] bg-white">
    <van-sticky type="primary">
      <van-nav-bar
        :title="$t('修改信息')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>
    <div class="w-full pl-6 pr-6 mt-6 box-border flex flex-col">
      <div class="w-full flex flex-col">
        <div class="w-full flex flex-col items-center justify-center mt-20">
          <van-uploader v-model="fileList" :after-read="afterRead" reupload max-count="1" />
          <div class="text-[#666] text-sm mt-2 flex items-center">
            <div class="mr-1">{{$t('点击更改')}}</div>
            <van-icon name="edit" />
          </div>

           <div class="w-full mt-4">
                <van-button color="#007513" class="w-full" @click="updateAvatarMethods">{{$t('更新')}}</van-button>
            </div>
        </div>
      </div>
    </div>
    
  </div>
</template>
<script setup>
import HeaderTop from "@/components/HeaderTop.vue";
import { onMounted, ref } from "vue";
import {updateAvatar,upload,userGetInfo} from "../../api/apis";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showLoadingToast,closeToast,showFailToast,showSuccessToast   } from 'vant';
const router = useRouter();
const onClickLeft = () => history.back();
const { t } = useI18n();
const userInfo = ref({})
const fileList = ref([]);
const avatarUrl = ref('')

const afterRead = async (file) => {
  try {
    // 1. 先上传文件
    const formData = new FormData()
    console.log(file.file)
    const uploadRes = await upload({file:file.file})
    if (uploadRes.code !== 200) {
      showSuccessToast(uploadRes.msg || t('图片上传失败'))
      return
    }
    avatarUrl.value = uploadRes.url
  } catch (error) {
    showSuccessToast(t('网络错误'))
  }
}

const updateAvatarMethods = async () => {
    const updateRes = await updateAvatar({ avatar: avatarUrl.value })
    if (updateRes.code === 200) {
      showSuccessToast(t('头像更新成功'))
      router.push({
        path: '/profileItem',
      });
    } else {
      showSuccessToast(updateRes.msg || t('头像更新失败'))
    }
}
onMounted(() => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
    console.log(userInfo.value.avatar)
    fileList.value.push({ url: userInfo.value.avatar });
    avatarUrl.value = userInfo.value.avatar;
    console.log(fileList.value)
  });
});
</script>
