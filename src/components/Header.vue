<template>
  <div class="pt-5 relative flex items-center w-full">
    <div class="h-9 w-9 bg-gray flex items-center justify-center rounded-2.5" @click="toBack">
      <img src="@/static/images/back.png" alt="" style="height: 18px;width: 18px;">
    </div>
    <div class="ml-auto h-9 w-9 bg-gray flex items-center justify-center rounded-2.5" v-if="rightType === 'search'"
      @click="toSearch">
      <el-icon size="18">
        <Search />
      </el-icon>
    </div>
    <div class="ml-auto h-9 w-9 bg-gray flex items-center justify-center rounded-2.5" v-if="rightType === 'crypto' || rightType === 'bank'"
      @click="toAdd">
      <el-icon size="18">
        <Plus />
      </el-icon>
    </div>
    <div class="ml-auto h-9 w-9 bg-red flex items-center justify-center rounded-2.5" v-if="rightType === 'delete'"
      @click="handleClickRight">
      <el-icon size="18" color="#FFF">
        <Delete />
      </el-icon>
    </div>
    <div class="w-full ml-5"  v-if="showTabs">
      <Tabs :menus="tradeTypeList" :selectMenu="tradeStore.tradeType" @change="handleChangeTradeType"></Tabs>
    </div>
    
  </div>
  <div class="flex flex-col items-center pb-3" v-if="props.label">
    <div class="flex flex-col items-start w-full pt-5">
      <div class="text-3xl">{{ props.label }}</div>
    </div>
  </div>
  
</template>


<script setup>
import { useRouter } from 'vue-router';
import Tabs from './Tabs.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
// import { useTradeStore } from '../store/modules/trade';

const { t } = useI18n();
const router = useRouter()
const emit = defineEmits(['rightClick'])
// const tradeStore = useTradeStore()
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  rightType: {
    type: String,
    default: ''
  },
  showTabs: {
    type: Boolean,
    default: false
  }
})

const tradeTypeList = computed(()=>[
  {
    label: t('合约'),
    value: 'NORMAL'
  },
  {
    label: t('秒合约'),
    value: 'SECOND'
  }
])


function toBack() {
  router.back()
}

function toSearch() {
  router.push({
    path: '/index/search'
  })
}

function toAdd() {
  if (props.rightType === 'crypto') {
    router.push({
      path: '/user/addCrypto'
    })
  } else {
    router.push({
      path: '/user/addBank'
    })
  }

}

function handleClickRight() {
  emit('rightClick')
}

function handleChangeTradeType(value) {
  tradeStore.setTradeType(value)
}
</script>
<style scoped></style>