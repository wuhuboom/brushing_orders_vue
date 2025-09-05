<template>
  <div class="bg-[#f5f5f5] records">
    <HeaderTop></HeaderTop>
    <van-tabs color="#007513"  @change="swichTab" v-model:active="active">
      <van-tab :title="$t('全部')"></van-tab>
      <van-tab :title="$t('待办')"></van-tab>
      <van-tab :title="$t('完成')"></van-tab>
    </van-tabs>
    <div class="h-[80vh] overflow-y-scroll">
        <div class="w-full pl-6 pr-6 pt-6 box-border flex flex-col">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list
                    v-model:loading="loading"
                    :finished="finished"
                    :finished-text="$t('没有更多了')"
                    @load="onLoad"
                >
                    <van-cell v-for="item in list" :key="item" :title="item">
                        <div>
                            <div class="w-full flex justify-between items-center mb-2">
                                <div class="text-[#999] text-sm font-medium">{{ formatWithTimezone(item.createTime,userStore.zoneActive.tzName)  }}</div>
                                <div class="text-white text-xs rounded p-1 bg-[#ff9662] font-medium"  :class="item.status=='0'?'bg-[#ff9662]':item.status == '1'?'bg-[#7E8FA2]':''">{{item.status=='0'? $t('已完成'): item.status == '1'?$t('冻结'): $t('待提交')}}</div>
                            </div>
                            <div class="w-full flex flex-col mb-6 bg-[#fff] overflow-hidden rounded-xl p-3 box-border" style="border: 1px solid rgb(240, 240, 240);">
                                <div class="flex">
                                    <div class="mr-4" style="width: 6rem;">
                                         <img :src="VITE_API_IMG_URL+item.coverUrl" alt="">
                                    </div>
                                    <div class="flex flex-col h-[6rem] justify-between">
                                        <div class="flex flex-col">
                                            <div class="text-[#999] text-base font-semibold whitespace-nowrap w-[52vw] overflow-hidden text-ellipsis">{{item.goodsName}}</div>
                                            <div class="text-[#999] text-sm mt-2"><span class="pr-[5px]">{{$t('美元')}}</span>{{item.price}}</div>
                                        </div>
                                        <van-rate
                                            v-model="value"
                                            :size="20"
                                            color="#ffd21e"
                                            void-icon="star"
                                            void-color="#eee"
                                            />
                                    </div>
                                </div>
                                <div class="mt-5 grid grid-cols-4 gap-2">
                                    <div class="col-span-2 flex flex-col">
                                        <div class="text-xs text-[#999] font-medium">{{$t('总金额')}}</div>
                                        <div class="mt-2 text-sm text-[#ff9662] font-semibold">{{item.price}} {{$t('美元')}}</div>
                                    </div>
                                    <div class="col-span-2 flex flex-col">
                                        <div class="text-xs text-[#999] font-medium">{{$t("佣金")}}</div>
                                        <div class="mt-2 text-sm text-[#ff9662] font-semibold">{{item.commission}} {{$t('美元')}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </van-cell>
                </van-list>
            </van-pull-refresh>
        </div>
        
    </div>
    <Footer name="/records"></Footer>

    <van-dialog v-model:show="show" closeable :title="''" :show-confirm-button="false">
        <div class="w-[5rem] mx-auto pt-10" style="width: 6rem; z-index: 999;">
            <img :src="VITE_API_IMG_URL+goodsData.coverUrl" alt="">
        </div>
        <div class="w-full mt-[-3rem] pt-[4rem] text-[#000] p-4 rounded-lg">
            <div class="w-[100%] mx-auto text-center text-sm font-semibold">
                {{goodsData.goodsName}}
            </div>
            <div class="flex w-full items-center pt-4 pb-4 mt-4">
                <div class="w-[50%] mr-2 flex flex-col py-4 bg-[#d8d8d8] justify-center items-center">
                    <div class="text-[#000] font-semibold">{{$t('总金额')}}</div>
                    <div class="text-xs text-[#000] mt-1">{{goodsData.price}}{{$t('美元')}}</div>
                </div>
                <div class="w-[50%] mr-2 flex flex-col py-4 bg-[#d8d8d8] justify-center items-center">
                    <div class="text-[#000] font-semibold">{{$t('佣金')}}</div>
                    <div class="text-xs text-[#000] mt-1">{{goodsData.commission}}{{$t('美元')}}</div>
                </div>
            </div>
            <div class="bg-[#d8d8d8] p-4">
                <div class="flex justify-between items-center box-border">
                    <div class="text-[#000] text-sm">{{$t('创建时间')}}</div>
                    <div class="text-[#000] text-sm font-bold">{{ formatWithTimezone(goodsData.createTime,userStore.zoneActive.tzName)  }}</div>
                </div>
                <div class="flex justify-between items-center box-border">
                    <div class="text-[#000] text-sm">{{$t('编号')}}</div>
                    <div class="text-[#000] text-sm font-bold">{{goodsData.orderNo}}</div>
                </div>
            </div>
            <div class="w-full mt-4">
                <van-button color="#007513" class="w-full" @click="submitVal">{{$t('提交')}}</van-button>
            </div>
        </div>
    </van-dialog>
  </div>
</template>

<script setup>
import HeaderTop from "@/components/HeaderTop.vue";
import { onMounted, ref ,reactive} from "vue";
import {getOrderInfos,submitOrder} from "../../api/apis";
import { showLoadingToast,closeToast,showFailToast,showSuccessToast   } from 'vant';
import { useI18n } from "vue-i18n";
import {formatWithTimezone}  from '../../util/utils'
import { useUserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
const router = useRouter();
const userStore = useUserStore();
const VITE_API_IMG_URL = window.g.VITE_API_IMG_URL;
const { t } = useI18n();
const active = ref(0);
const list =  ref([]);
const show = ref(false);
const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);
const goodsData =  ref({})
const value= ref(5)
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  status:''
});
const onRefresh = async () => {
  refreshing.value = true;
  finished.value = false;
  query.pageNum = 1;
  list.value = [];
  await loadData();
  refreshing.value = false;
};
const onLoad = async () => {
  if (finished.value || loading.value) return;
  loading.value = true;
  await loadData();
  loading.value = false;
};
const loadData = async () => {
  try {
    let res = await getOrderInfos(query);
    const data = res.rows;
    if (data.length < query.pageSize) {
      finished.value = true;
    } else {
      query.pageNum++;
    }

    list.value.push(...data);
  } catch (error) {
    console.error("加载失败", error);
    finished.value = true; // 避免无限加载
  }
};
const submit = (item) => {
    goodsData.value = item;
    show.value = true
}

const submitVal = () =>{
    submitOrder(goodsData.value.id).then((res)=>{
        showSuccessToast(t("提交成功"));
        onRefresh()
        if(res.code == 201) {
            goodsData.value =  res.data
        }else {
            show.value = false;
        }
    }).catch((err)=>{
        if(err.code == 916) {
            router.push('/deposit')

        } else {
            ElMessage({ message: err.status, type: "error" });
        }  
    })

}

const swichTab = () =>{
    console.log(active.value)
    if(active.value == 0) {
        query.status = ''
    } else if (active.value == 1) {
        query.status = 2
    } else {
        query.status = 0
    }
    onRefresh()
   

}
onMounted(() =>{
    onLoad()
})
</script>
<style scoped></style>
