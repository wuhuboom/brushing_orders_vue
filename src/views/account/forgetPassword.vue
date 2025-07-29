<template>
    <div class="flex flex-col">
        <Header view="market" :label="$t('输入您的密码')"></Header>
        <div class="flex flex-col items-center pb-3">
            <div class="mt-5 opacity-50 self-start">{{ $t('请输入我们发送给的代码') }}</div>
            <div class="mt-1.5 text-base opacity-50 text-blue self-start" v-if="accountType === 1">{{ ruleForm.email }}
            </div>
            <div class="mt-1.5 text-base opacity-50 text-blue self-start" v-else>{{ `+${ruleForm.phone}` }}</div>
            <div class="flex gap-x-2 px-5 mt-12">
                <input v-for="i in 6" :key="i" v-model="codeList[i - 1]" maxlength="1" type="text" inputmode="numeric"
                    autocomplete="one-time-code" class="w-12 h-12 text-center bg-gray rounded-2.5 code-input"
                    style="font-size: 25px;" @input="handleCodeInput(i)" @keydown="(e) => handleKeyDown(e, i)"
                    @click="handleInputClick(i)" @paste="handlePaste" :ref="el => inputRefs[i - 1] = el" />
            </div>
            <div class="text-blue opacity-50 underline mt-5" @click="sendCode" v-if="countdown <= 0">{{ $t('重新发送验证码') }}
            </div>
            <div class=" opacity-50  mt-5" v-else>{{ `${$t('重新发送验证码')}(${countdown}s)` }}</div>
            <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="auto"
                class="w-full mt-10">
                <el-form-item :label="$t('新密码')" prop="password" label-position="top">
                    <el-input v-model="ruleForm.password" type="password" autocomplete="off" size="large" />
                </el-form-item>
            </el-form>
            <div @click="submitForm(ruleFormRef)" class="w-full relative -right-5" size="large" round>
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
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { reqFindPasswordByEmail, reqSendCodeToEmail, reqSendCodeToPhone, reqFindPasswordByPhone } from '../../api/apis';
import { useRoute } from 'vue-router';

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const ruleFormRef = ref(null)
const codeList = ref([])
const inputRefs = ref([]);
const ruleForm = reactive({
    email: route.query.email || '',
    vcode: '', // 修改为数组形式存储6位验证码
    password: '',
    phone: route.query.phone || '',
})
const accountType = ref(Number(route.query.type) || 1);
const rules = computed(() => {
    return {
    }

})
// 倒计时时间
const countdown = ref(60)

onMounted(() => {
    startCountdown()
})

function submitForm(formEl) {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            console.log('submit!')
            ruleForm.vcode = codeList.value.join('')
            if (!ruleForm.vcode) return ElMessage.error(t('请输入验证码'))
            if (!ruleForm.password) return ElMessage.error(t('请输入密码'))
            if (accountType.value === 1) {
                reqFindPasswordByEmail(ruleForm).then(res => {
                    ElMessage({ message: t('修改成功'), type: "success" })
                    router.push('/account/login')
                })
            } else {
                reqFindPasswordByPhone(ruleForm).then(res => {
                    ElMessage({ message: t('修改成功'), type: "success" })
                    router.push('/account/login')
                })
            }

        } else {
            console.log('error submit!')
        }
    })
}

// 输入单个数字时，自动跳到下一位
const handleCodeInput = (index) => {
  const value = codeList.value[index - 1];
  if (/^[0-9]$/.test(value)) {
    if (index < 6) {
      inputRefs.value[index]?.focus();
    } else {
      inputRefs.value[index - 1]?.blur();
    }
  } else {
    codeList.value[index - 1] = '';
  }
};

// 选中当前输入框
const handleInputClick = (index) => {
  inputRefs.value[index - 1]?.select();
};

// 粘贴 6 位验证码时自动填入
const handlePaste = (event) => {
  const pasteData = event.clipboardData.getData('text').trim();
  if (/^\d{6}$/.test(pasteData)) {
    for (let i = 0; i < 6; i++) {
      codeList.value[i] = pasteData[i];
    }
    inputRefs.value[5]?.blur(); // 自动填完后失焦
    event.preventDefault(); // 阻止默认行为
  }
};

// Backspace 自动跳回前一个输入框
const handleKeyDown = (event, index) => {
  console.log(event.key)
  if (event.key === 'Backspace') {
    const curIndex = index - 1;
    if (!codeList.value[curIndex] && curIndex > 0) {
      inputRefs.value[curIndex - 1]?.focus();
      codeList.value[curIndex - 1] = '';
    }
  }
};

function sendCode() {
    if (accountType.value === 1) {
        if (!ruleForm.email) return ElMessage.error(t('请输入邮箱'))
        reqSendCodeToEmail({ email: ruleForm.email, biz: 'findpwd' }).then(res => {
            countdown.value = 60
            startCountdown()
            ElMessage({ message: t('验证码发送成功'), type: "success" })
        })

    } else {
        if (!ruleForm.phone) return ElMessage.error(t('请输入手机号'))
        reqSendCodeToPhone(ruleForm.phone).then(res => {
            countdown.value = 60
            startCountdown()
            ElMessage({ message: t('验证码发送成功'), type: "success" })
        })
    }


}

// 执行倒计时
function startCountdown() {
    const timer = setInterval(() => {
        countdown.value--
        if (countdown.value === 0) {
            clearInterval(timer)
        }
    }, 1000)
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
</style>