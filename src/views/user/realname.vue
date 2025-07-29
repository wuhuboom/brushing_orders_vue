<template>
    <div class="flex flex-col">
        <Header view="market" :label="$t('实名认证')"></Header>
        <div class="flex flex-col items-center pb-3">
            <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="auto"
                class="w-full mt-10 ">
                <el-form-item :label="$t('真实姓名')" prop="username" label-position="top">
                    <el-input v-model="ruleForm.realName" type="text" autocomplete="off" size="large" />
                </el-form-item>
                <el-form-item :label="$t('身份证')" prop="username" label-position="top">
                    <el-input v-model="ruleForm.identityCardNumber" type="text" autocomplete="off" size="large" />
                </el-form-item>
                <div class="flex items-center gap-6">
                    <el-form-item :label="$t('身份证正面')" prop="username" label-position="top" class="flex-1">
                        <el-upload class="avatar-uploader"
                            accept="image/*"
                            :action="$uploadUrl"
                            :headers="{ Authorization: userStore.token }" :show-file-list="false"
                            :on-success="handleFrontSuccess" :before-upload="beforeAvatarUpload">
                            <img v-if="ruleForm.identityCardFront" :src="ruleForm.identityCardFront" class="avatar" />
                            <el-icon v-else class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </el-form-item>

                    <el-form-item :label="$t('身份证背面')" prop="username" label-position="top" class="flex-1">
                        <el-upload class="avatar-uploader"
                            accept="image/*"
                            :action="$uploadUrl"
                            :headers="{ Authorization: userStore.token }" :show-file-list="false"
                            :on-success="handleBackSuccess" :before-upload="beforeAvatarUpload">
                            <img v-if="ruleForm.identityCardBack" :src="ruleForm.identityCardBack" class="avatar" />
                            <el-icon v-else class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </el-form-item>
                </div>

            </el-form>
            <div @click="submitForm" class="w-full relative -right-5">
                <div class=" text-base mt-10 bg-blue px-5 flex items-center h-12 rounded-l-2.5 text-white button-bg">
                    <div>{{ $t('完成') }}</div>
                    <el-icon class="ml-auto" size="20"><Select /></el-icon>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Header from '@/components/Header.vue'
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { reqRealNameAuth } from '../../api/apis';
import { useUserStore } from '@/store/modules/user';

const router = useRouter()
const { t } = useI18n()
const ruleFormRef = ref(null)
const userStore = useUserStore()
const ruleForm = reactive({
    realName: '',
    identityCardType: 'IDENTITY_CARD',
    identityCardFront: '',
    identityCardNumber: '',
    identityCardBack: '',
    country: 'USD'
})
const rules = computed(() => {
    return {
    }

})

function submitForm() {
    if(ruleForm.identityCardFront == '')return ElMessage.error(t('请上传身份证正面'))
    if(ruleForm.identityCardBack == '')return ElMessage.error(t('请上传身份证背面'))
    reqRealNameAuth(ruleForm).then(res => {
        ElMessage.success(t('提交成功'))
        router.back()
    })
}

function handleFrontSuccess(response, file, fileList) {
    ruleForm.identityCardFront = response.data
}
function handleBackSuccess(response, file, fileList) {
    ruleForm.identityCardBack = response.data
}
</script>

<style scoped>
.earn-bg {
    background-image: url(@/static/images/earn-bg.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

:deep(.el-input-group__append) {
    background-color: #3040F0 !important;
    color: #FFF !important;

}

.button-bg {
    background-image: url(@/static/images/block-bg.png);
    background-size: 100% auto;
    background-repeat: no-repeat;
}

.avatar-uploader .el-upload {

    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    width: 100%;
}

.el-form-item__content {
    width: 100%;
}

.avatar-uploader {
    width: 100% !important;
    height: 100%;
    border: 2px solid #3d3d3d !important;
    border-radius: 10px;
    max-height: 120px;
}

:deep(.el-upload) {
    width: 100% !important;
}


.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 116px;
    text-align: center;
}

.avatar{
    max-width: 100%;
    height: 116px;
    object-fit: contain;
}
</style>