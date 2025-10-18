<template>
  <div class="flex flex-col">
    <Header view="market" :label="$t('输入您的密码')"></Header>
    <div class="flex flex-col items-center pb-3">
      <div class="self-start">
        <div class="mt-5 opacity-50">{{ $t('请输入我们发送给的代码') }}</div>
        <div class="mt-1.5 text-base opacity-50 text-blue" v-if="ruleForm.model === 'email'">{{ ruleForm.email }}</div>
        <div class="mt-1.5 text-base opacity-50 text-blue" v-else>{{ `+${ruleForm.phone}` }}</div>
      </div>
      <div class="flex gap-x-2 mt-12">
        <!-- <input v-for="i in 6" :key="i" v-model="codeList[i - 1]" maxlength="1" type="text"
                    class="w-12 h-12 text-center bg-gray rounded-2.5 code-input" style="font-size: 25px;"
                    @input="handleCodeInput(i)" @click="handleInputClick(i)" /> -->
        <input v-for="i in 6" :key="i" v-model="codeList[i - 1]" maxlength="1" type="text" inputmode="numeric"
          autocomplete="one-time-code" class="w-12 h-12 text-center bg-gray rounded-2.5 code-input"
          style="font-size: 25px;" @input="handleCodeInput(i)" @keydown="(e) => handleKeyDown(e, i)"
          @click="handleInputClick(i)" @paste="handlePaste" :ref="el => inputRefs[i - 1] = el" />

      </div>
      <div class="text-blue opacity-50 underline mt-5" @click="sendCode" v-if="countdown <= 0">{{ $t('重新发送验证码') }}
      </div>
      <div class=" opacity-50  mt-5" v-else>{{ `${$t('重新发送验证码')}(${countdown}s)` }}</div>
      <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="auto" class="w-full mt-10 ">
        <el-form-item :label="$t('密码')" prop="email" label-position="top">
          <el-input v-model="ruleForm.password" type="password" autocomplete="off" size="large" />
        </el-form-item>
        <el-form-item :label="$t('邀请码')" prop="email" label-position="top">
          <el-input v-model="ruleForm.promotionCode" type="text" autocomplete="off" size="large" />
        </el-form-item>
      </el-form>
      <div @click="submitForm(ruleFormRef)" class="w-full relative -right-5" size="large" round>
        <div class=" text-base mt-10 bg-blue px-5 flex items-center h-12 rounded-l-2.5 text-white button-bg">
          <div>{{ $t('加入我们') }}</div>
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
import { reqRegister } from '@/api/apis';
import { reqSendCodeToEmail,reqSendCodeToPhone } from '../../api/apis';
import { useRoute } from 'vue-router';
const inputRefs = ref([]);
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const ruleFormRef = ref(null)
const codeList = ref([])
const ruleForm = reactive({
  email: route.query.email || '',
  code: '',
  nickname: route.query.email || route.query.phone,
  username: route.query.email || route.query.phone,
  phone: route.query.phone || '',
  promotionCode: '',
  country: route.query.country || '',
  password: '',
  verifyPassword: '',
  currency: 'USD',
  model: route.query.type == 1 ? "email" : "iPhone",
})

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
  ruleForm.verifyPassword = ruleForm.password
  ruleForm.code = codeList.value.join('')
  if (!ruleForm.code) return ElMessage.error(t('请输入验证码'))
  if (!ruleForm.password) return ElMessage.error(t('请输入密码'))
  // if (!ruleForm.promotionCode) return ElMessage.error(t('请输入邀请码'))
  reqRegister(ruleForm).then(res => {
    ElMessage({ message: t('注册成功'), type: "success" })
    router.push('/account/login')
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
  if (ruleForm.model === 'email') {
    if (!ruleForm.email) return ElMessage.error(t('请输入邮箱'))
    // 增加验证是否是正确邮箱地址
    if (!ruleForm.email.includes('@')) return ElMessage.error(t('请输入正确的邮箱地址'))
    reqSendCodeToEmail({ email: ruleForm.email, biz: 'ureg' }).then(res => {
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