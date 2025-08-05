<template>
  <div class="w-full min-h-[100vh] bg-[#f4f4f5]">
    
    <div class="w-full p-6 box-border flex flex-col font-montserrat text-[#666]">
        <van-nav-bar
        :title="$t('条款协议')"
        fixed
        left-arrow
        @click-left="onClickLeft"
    />
        <p class="pt-10">
            {{ $t('尊敬的用户，欢迎来到利润和收入指南。我们将向您介绍公司的利润和收入结构，帮助您更好地规划工作日程。所有员工的利润和收入由三部分组成：每日利润、重置奖金和基本工资。每日利润是您最重要的收入来源。当您满足商家设定的特定要求时，您将获得重置奖金和基本工资。 ') }}
        </p>
        <p>{{$t('阅读指南，帮助您了解并最大化这份工作的收入')}}</p>
        <p>&nbsp;</p>
        <p>
            <br>
            {{$t('1）基本工资')}}
        </p>
        <p>{{$t('该公司采用累积签到制作为薪酬支付结构，旨在激励用户每天积极参与任务。虽然基本工资固定，但并非一次性支付。相反，公司会在指定工作日（例如2天、4天或10天）后发放基本工资，以鼓励用户持续完成每日任务。一旦用户完成规定的工作日数，公司就会相应地支付工资。')}}</p>
        <p>
            <img src="https://bigwnew.oss-ap-northeast-1.aliyuncs.com/msr/1751730642479403847.jpg" alt="">
        </p>
        <p>
            {{$t('2）重置奖金')}}
        </p>
        <p>
            {{$t('重置奖励是您首次与我们合作时最重要的收入来源之一。所有用户每天可以完成两组任务，商家会提供不同的额外重置奖励，以鼓励用户完成日常任务。每次重置账户，以100美元启动第一个任务，您将获得额外的10美元奖励；当您单日累计重置金额超过1500美元时，您将获得单日两组任务累计金额的4%的额外奖励。')}}
        </p>
        <p>
            <img src="https://bigwnew.oss-ap-northeast-1.aliyuncs.com/msr/1751730723964535460.jpg" alt="">
        </p>
        <p>{{$t('3）每日利润')}}</p>
        <p>{{$t('每日收益是您的主要收入来源。系统会根据您账户的余额，分配不同商家提供的产品进行优化。每优化一个产品，您将获得产品价格0.5%~2.5%的收益。收益金额由VIP等级决定，VIP等级越高，收益越高。VIP等级越高，每套任务的数量也会增加。商家众多，部分商家会分配组合产品。系统会根据所有参与优化的用户账户余额，随机分配组合产品。根据您优化的产品，您可以额外获得产品价格5%~25%的收益。')}}</p>
    
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {}

const onClickLeft = () => history.back();
</script>