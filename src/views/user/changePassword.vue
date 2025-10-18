<template>
    <div class="flex flex-col">
        <Header view="market" :label="$t('修改密码')"></Header>
        <div class="flex flex-col items-center pb-3">
            <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="auto"
                class="w-full mt-10">
                <el-form-item :label="$t('原密码')" prop="oldPassword" label-position="top">
                    <el-input v-model="ruleForm.oldPassword" type="password" autocomplete="off" size="large" />
                </el-form-item>
                <el-form-item :label="$t('新密码')" prop="newPassword" label-position="top">
                    <el-input v-model="ruleForm.newPassword" type="password" autocomplete="off" size="large" />
                </el-form-item>
                <el-form-item :label="$t('确认密码')" prop="verifyPassword" label-position="top">
                    <el-input v-model="ruleForm.verifyPassword" type="password" autocomplete="off" size="large" />
                </el-form-item>
            </el-form>
            <div @click="submitForm" class="w-full relative -right-5" size="large" round>
                <div
                    class=" text-base mt-10 bg-blue px-5 flex items-center h-12 rounded-l-2.5 text-white button-bg">
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
import { useI18n } from 'vue-i18n';
import { reqEditPassword } from '../../api/apis';
import { useUserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
const userStore = useUserStore()
const { t } = useI18n()
const router = useRouter();
const ruleFormRef = ref(null)
const ruleForm = reactive({
    oldPassword: '',
    newPassword: '',
    verifyPassword: ''
})
const rules = computed(() => {
    return {
    }
})

function submitForm() {
    if (!ruleForm.oldPassword) return ElMessage.error(t("请输入原密码"));
    if (!ruleForm.newPassword) return ElMessage.error(t("请输入新密码"));
    if (!ruleForm.verifyPassword) return ElMessage.error(t("请输入确认密码"));
    if (ruleForm.newPassword !=ruleForm.verifyPassword) return ElMessage.error(t("确认密码与登录密码不一致!"));
    reqEditPassword(ruleForm).then(res => {
        ElMessage({ message: t('修改成功'), type: "success" })
        // userStore.logout()
        router.push('/user')
    })
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
</style>