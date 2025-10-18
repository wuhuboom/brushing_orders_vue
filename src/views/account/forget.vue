<template>
    <div class="flex flex-col">
        <Header view="market" :label="$t('忘记密码')"></Header>
        <div class="flex flex-col items-center pb-3">
            <div class="mt-5 opacity-50 self-start" v-if="accountType === 1">{{ $t('请输入您的电子邮件以接收您的重置密码说明') }}</div>
            <div class="mt-5 opacity-50 self-start" v-else>{{ $t('请输入您的手机号以接收您的重置密码说明') }}</div>
            <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="auto"
                class="w-full mt-10">
                <el-form-item :label="$t('邮箱')" prop="email" label-position="top" v-if="accountType === 1">
                    <el-input v-model="ruleForm.email" type="text" autocomplete="off" size="large" />
                </el-form-item>
                <el-form-item :label="$t('手机号')" prop="email" label-position="top" v-else>
                    <el-input v-model="ruleForm.email" @input="onInput" type="text" autocomplete="off" size="large">
                        <template #prepend>
                            <el-select v-model="select" placeholder="Select" style="width: 115px">
                                <el-option :label="item.label" :value="item.label" v-for="item in areas" />
                            </el-select>
                        </template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div @click="sendCode" class="w-full relative -right-5" size="large" round>
                <div class=" text-base mt-10 bg-blue px-5 flex items-center h-12 rounded-l-2.5 text-white button-bg">
                    <div>{{ $t('发送验证码') }}</div>
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
import { reqSendCodeToEmail, reqSendCodeToPhone } from '../../api/apis';
import { areas } from "@/config/area";
import { useRoute } from 'vue-router';
import { formatPhoneNumber } from '../../util/utils';
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const ruleFormRef = ref(null)
const ruleForm = reactive({
    email: ''
})
const select = ref('US +1');
const accountType = ref(Number(route.query.type) || 1);
const rules = computed(() => {
    return {
    }

})
const onInput = () => {
  ruleForm.email = formatPhoneNumber(ruleForm.email)
}

function sendCode() {
    ruleForm.email = ruleForm.email.replace(/\s+/g, '')
    if (accountType.value === 1) {
        if (!ruleForm.email) return ElMessage.error(t('请输入邮箱'))
        // 增加验证是否是正确邮箱地址
        if (!ruleForm.email.includes('@')) return ElMessage.error(t('请输入正确的邮箱地址'))
        reqSendCodeToEmail({ email: ruleForm.email, biz: 'findpwd' }).then(res => {
            ElMessage({ message: t('验证码发送成功'), type: "success" })
            router.push({ path: '/account/forgetPassword', query: { email: ruleForm.email, type: 1 } })
        })
    } else {
        if (!ruleForm.email) return ElMessage.error(t('请输入手机号'))
        // 手机号码需要时纯数字
        if (!/^[0-9]*$/.test(ruleForm.email)) return ElMessage.error(t('请输入正确的手机号'))
        const country = areas.find(item => item.label === select.value)
        reqSendCodeToPhone(`${country.value}${ruleForm.email}`).then(res => {
            ElMessage({ message: t('验证码发送成功'), type: "success" })
            
            router.push({ path: '/account/forgetPassword', query: { phone: `${country.value}${ruleForm.email}`, type: 2, country: country.area } })
        })
    }
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

:deep(.el-input-group__prepend) {
    box-shadow: none !important;
    background-color: transparent !important;
    box-shadow: 0 0 0 2px #3d3d3d !important;

}

:deep(.el-select__wrapper) {
    box-shadow: none !important;
    background-color: transparent !important;
}
</style>