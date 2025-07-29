<template>
  <el-drawer v-model="dialogVisible" :show-close="false" :modal="true" direction="btt" append-to-body size="auto"
    header-class="header">
    <template #header>
      <div>
        <div class="bg-gray w-8 h-8 flex items-center justify-center rounded-2.5" @click="close">
          <el-icon>
            <Close />
          </el-icon>
        </div>
        <p class="text-[25px] mt-5 text-black">{{ $t('提示') }}</p>
      </div>
    </template>
    <div>
      <p class=" opacity-50">{{ $t('您即将切换为{type}', { type: userStore.accountType === 'REAL' ? $t('模拟账户') : $t('真实账户') })
        }}
      </p>
      <p class="flex-1 flex items-center justify-center bg-gray rounded-2xl h-[50px]" @click="close">{{ $t('取消') }}</p>
      <p class="flex-1 flex items-center justify-center bg-blue text-white rounded-2xl h-[50px]"
        @click="handleChangeAccountType">{{ $t('确认') }}</p>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue';
const dialogVisible = ref(false);
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore()
// 更符合Vue3习惯的暴露方式
const open = () => (dialogVisible.value = true);
const close = () => (dialogVisible.value = false);

defineExpose({
  open,
  close // 新增关闭方法
});

function handleChangeAccountType() {
  close()
  userStore.changeAccountType()
  userStore.getUserBalance()
}

</script>

<style scoped>
:deep(.el-drawer.btt) {
  border-top-left-radius: 20px !important;
  border-top-right-radius: 20px !important;
}
</style>
<style>
.header {
  margin: 0 !important;
  padding: 20px 20px 0 !important;
}
</style>