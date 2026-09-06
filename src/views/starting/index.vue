<template>
  <DmkPcLayout>
    <main class="nsg-start-work nsg-start-work--desktop">
      <p class="nsg-start-work__crumb">{{ $t("das.dmk.profile") }} <span>›</span> {{ $t("das.dmk.startWork") }}</p>
      <div class="nsg-start-work__top">
        <section class="nsg-product-pool">
          <header class="nsg-panel-heading">
            <img class="nsg-panel-heading__icon is-cube" src="/nsg16/product-pool-icon.png" alt="" />
            <div><strong>{{ $t("das.nsg.productPool") }}</strong><small>{{ $t("das.nsg.productPoolHint") }}</small></div>
            <em><NsgUiIcon name="bolt" /> {{ $t("das.nsg.autoMatching") }}</em>
          </header>
          <NsgProductRail :products="displayGoods" :current="current" :loading="goodsLoading" @select="selectRailProduct" />
        </section>

        <section class="nsg-order-match">
          <header class="nsg-panel-heading"><span class="nsg-panel-heading__icon"><NsgUiIcon name="target" /></span><strong>{{ $t("das.nsg.orderMatching") }}</strong></header>
          <div class="nsg-balance-card">
            <div><span>{{ $t("das.form.availableBalance") }}</span><strong>{{ money(userInfo.totalBalance ?? userInfo.balance, "0.00") }} <small>{{ $t("das.dmk.currencyUsd") }}</small></strong></div>
          </div>
          <div class="nsg-match-stats">
            <div><span class="is-purple"><NsgUiIcon name="clock" /></span><small>{{ $t("das.dmk.commission") }}</small><strong>{{ money(userInfo.commission, "0.00") }} {{ $t("das.dmk.currencyUsd") }}</strong></div>
            <div><span class="is-green"><NsgUiIcon name="trend" /></span><small>{{ $t("das.dmk.pendingAmount") }}</small><strong>{{ money(userInfo.balance, "0.00") }} {{ $t("das.dmk.currencyUsd") }}</strong></div>
          </div>
          <button class="nsg-gradient-button" type="button" :disabled="creatingOrder" @click="handleClick">{{ $t("das.nsg.startMatching") }} <NsgUiIcon name="bolt" /></button>
          <div class="nsg-progress"><span>{{ $t("das.nsg.todaysProgress") }}</span><b>{{ taskProgressPercent }}%</b><i><u :style="{ width: `${taskProgressPercent}%` }"></u></i></div>
        </section>
      </div>

      <section class="nsg-order-history">
        <header class="nsg-order-history__header">
          <strong><NsgUiIcon name="history" /> {{ $t("das.nsg.orderHistory") }}</strong>
          <div>
            <button v-for="(tab, index) in historyTabs" :key="tab.label" type="button" :class="{ active: historyActive === index }" @click="switchHistoryTab(index)">{{ tab.label }}</button>
          </div>
        </header>
        <div class="nsg-order-history__list">
          <article v-for="(item, index) in historyList" :key="item.id || item.orderNo || index">
            <van-image v-if="hasImage(item.coverUrl)" :src="imageUrl(item.coverUrl)" :alt="item.goodsName || ''" fit="contain" class="nsg-history-cover" /><span v-else class="nsg-history-cover nsg-product-image-missing" aria-hidden="true">◇</span>
            <div class="nsg-history-product"><strong>{{ item.goodsName || '—' }}</strong><small>{{ $t("das.dmk.productPrice") }}</small><b>{{ money(item.price, "0.00") }} {{ $t("das.dmk.currencyUsd") }}</b></div>
            <div><small>{{ $t("das.dmk.commRate") }}</small><span>{{ historyRate(item.rebatePercentage ?? item.commissionRate ?? item.rate) }}</span></div>
            <div><small>{{ $t("das.dmk.profits") }}</small><span>{{ money(item.commission ?? item.profit, "0.00") }} {{ $t("das.dmk.currencyUsd") }}</span></div>
            <div><small>{{ $t("das.dmk.totalRefund") }}</small><b>{{ money(item.price, "0.00") }} {{ $t("das.dmk.currencyUsd") }}</b></div>
            <div class="nsg-history-state"><time>{{ historyDate(item.createTime ?? item.createdAt) }}</time><button v-if="String(item.status) === '1'" type="button" class="is-pending" @click="openOrderDetails(item)">{{ $t("das.common.submit") }}<NsgUiIcon name="clock" /></button><em v-else :class="String(item.status) === '0' ? 'is-completed' : 'is-processing'">{{ historyStatus(item.status) }}<NsgUiIcon :name="String(item.status) === '0' ? 'check' : 'refresh'" /></em></div>
          </article>
          <div v-if="historyLoading" class="nsg-order-history__empty">{{ $t("das.common.loading") }}...</div>
          <div v-else-if="!historyList.length" class="nsg-order-history__empty">{{ $t("das.common.noData") }}</div>
          <button v-else-if="!historyFinished" class="nsg-order-history__more" type="button" @click="loadHistory()">{{ $t("das.dmk.loadMore") }}</button>
        </div>
      </section>
    </main>
    <div class="dmk-site-scope nsg-start-legacy">
      <div class="w-full max-w-[1200px] mx-auto text-white">
        <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="col-span-1">
            <!-- The current product rail replaces the legacy video background. -->
          </div>
          <div class="col-span-1">
            <div class="w-[500px] mx-auto hidden lg:block">
              <div
                class="text-5xl font-semibold text-[var(--main-color)] uppercase text-center pt-10"
              >
                {{ $t("das.dmk.startWork") }}
              </div>
              <div class="flex w-full mt-10 justify-center items-center">
                <button
                  type="button"
                  class="dmk-task-circle dmk-start-circle van-circle"
                  :class="{ 'dmk-task-circle--full': taskIsFull }"
                  style="width: 300px; height: 300px"
                  :disabled="creatingOrder"
                  @click="handleClick"
                >
                  <DmkTaskWave :full="taskIsFull" />
                  <svg
                    class="dmk-task-progress"
                    style="transform: rotate(270deg)"
                    viewBox="0 0 1050 1050"
                  >
                    <path
                      class="van-circle__layer"
                      d="M 525 525 m 0, -500 a 500, 500 0 1, 1 0, 1000 a 500, 500 0 1, 1 0, -1000"
                      style="
                        fill: none;
                        stroke: rgb(90, 110, 26);
                        stroke-width: 50px;
                      "
                    />
                    <path
                      class="van-circle__hover"
                      :style="{ strokeDasharray: taskProgressDash }"
                      d="M 525 525 m 0, -500 a 500, 500 0 1, 1 0, 1000 a 500, 500 0 1, 1 0, -1000"
                      stroke="rgb(44,185,73)"
                      style="stroke: rgb(44, 185, 73); stroke-width: 51px"
                    />
                  </svg>
                  <div
                    class="w-[300px] h-[300px] flex justify-center items-center bg-black"
                  >
                    <div
                      class="dmk-task-circle__inner w-[240px] h-[240px] bg-[#414c15] rounded-full flex justify-center items-center"
                    >
                      <div class="flex flex-col justify-center items-center">
                        <img
                          alt=""
                          class="w-20"
                          src="/dmk/assets/starting.png"
                        />
                        <p
                          class="dmk-task-circle__count text-5xl font-medium text-white text-center mt-2"
                        >
                          ({{ userInfo.dealCount || 0 }}/{{ orderCount || 0 }})
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
              <div
                class="mt-4 w-[420px] border-[1px] border-[rgb(90,110,26)] rounded-lg p-4 mx-auto"
              >
                <div class="w-full flex justify-between items-center">
                  <p>{{ $t("das.dmk.commission") }}</p>
                  <p>
                    {{ money(userInfo.commission, "0.00") }}
                    {{ $t("das.dmk.currencyUsd") }}
                  </p>
                </div>
                <div>
                  {{ $t("das.dmk.commissionHint") }}
                </div>
                <div class="h-[1px] bg-[var(--main-color)] my-4"></div>
                <div class="w-full flex justify-between items-center">
                  <p>{{ $t("das.dmk.totalBalance") }}</p>
                  <p>
                    {{
                      money(userInfo.totalBalance ?? userInfo.balance, "0.00")
                    }}
                    {{ $t("das.dmk.currencyUsd") }}
                  </p>
                </div>
                <div>{{ $t("das.dmk.balanceHint") }}</div>
                <div class="h-[1px] bg-[var(--main-color)] my-4"></div>
                <div class="w-full flex justify-between items-center">
                  <p>{{ $t("das.dmk.pendingAmount") }}</p>
                  <p>
                    {{
                      money(userInfo.balance, "0.00")
                    }}
                    {{ $t("das.dmk.currencyUsd") }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-[#1a1a1a] hidden lg:block text-white nsg-start-legacy">
        <div class="w-full max-w-[1200px] mx-auto py-10">
          <div class="w-full mx-auto text-5xl font-medium text-center py-5">
            {{ $t("das.dmk.history") }}
          </div>
          <div class="w-full bg-transparent dmk-task-history-scope">
            <div class="van-tabs van-tabs--line">
              <div class="van-tabs__wrap">
                <div
                  aria-orientation="horizontal"
                  class="van-tabs__nav van-tabs__nav--line"
                  role="tablist"
                  style="
                    border-color: var(--main-color);
                    background: transparent;
                  "
                >
                  <button
                    v-for="(tab, index) in historyTabs"
                    :key="tab.label"
                    type="button"
                    class="van-tab van-tab--line cursor-pointer"
                    :class="{ 'van-tab--active': historyActive === index }"
                    :aria-selected="historyActive === index"
                    :style="{
                      color:
                        historyActive === index
                          ? 'rgb(255, 255, 255)'
                          : 'rgb(153, 153, 153)',
                    }"
                    role="tab"
                    @click="switchHistoryTab(index)"
                  >
                    <span class="van-tab__text van-tab__text--ellipsis">
                      {{ tab.label }}
                    </span>
                  </button>
                  <div
                    class="van-tabs__line"
                    :style="historyTabLineStyle"
                  ></div>
                </div>
              </div>
            </div>
            <div class="h-[79vh] overflow-y-scroll">
              <div
                class="w-full pl-2 pr-2 pt-6 box-border flex flex-col"
              >
                <div
                  v-for="(item, index) in historyList"
                  :key="item.id || item.orderNo || index"
                  class="w-full bg-[#3c4146] bg-opacity-50 text-xs p-2 rounded-md mb-2 lg:p-8"
                >
                  <div
                    class="w-full flex justify-between items-start pb-2 border-b-[1px] border-[#fff]"
                  >
                    <div
                      class="w-[8rem] h-[8rem] rounded-lg overflow-hidden bg-[#34383c] flex-shrink-0"
                    >
                      <img
                        v-if="hasImage(item.coverUrl)"
                        :src="imageUrl(item.coverUrl)"
                        class="w-full h-full object-cover"
                        :alt="item.goodsName || ''"
                      />
                    </div>
                    <div
                      class="text-[#eee] ml-2 w-full flex-1"
                    >
                      <p class="lg:text-lg">
                        {{ item.goodsName || "—" }}
                      </p>
                      <p
                        class="text-[var(--main-color)] lg:text-lg"
                      >
                        {{ $t("das.dmk.productPrice") }}:
                        {{ money(item.price, "0.00") }}
                        {{ $t("das.dmk.currencyUsd") }}
                      </p>
                    </div>
                    <div
                      class="flex flex-col justify-end items-center"
                    >
                      <p
                        class="text-[10px] lg:text-base text-right w-full"
                      >
                        {{ historyDate(item.createTime ?? item.createdAt) }}
                      </p>
                      <div class="flex w-full justify-end">
                        <button
                          v-if="String(item.status) === '1'"
                          type="button"
                          class="text-black text-xs text-right rounded p-1 lg:p-4 lg:py-2 lg:text-base bg-[var(--main-color)] font-medium"
                          @click="openOrderDetails(item)"
                        >
                          {{ $t("das.common.submit") }}
                        </button>
                        <div
                          v-else
                          class="text-black text-xs text-right rounded p-1 lg:p-4 lg:py-2 lg:text-base bg-[var(--main-color)] font-medium"
                        >
                          {{ historyStatus(item.status) }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="w-full flex justify-between items-center mt-4"
                  >
                    <div
                      class="text-xs lg:text-lg text-white"
                    >
                      <p>{{ $t("das.dmk.commRate") }}</p>
                      <p>
                        {{
                          historyRate(
                            item.rebatePercentage ??
                              item.commissionRate ??
                              item.rate,
                          )
                        }}
                      </p>
                    </div>
                    <div
                      class="text-xs lg:text-lg text-white text-center"
                    >
                      <p>{{ $t("das.dmk.profits") }}</p>
                      <p>
                        {{ money(item.commission ?? item.profit, "0.00") }}
                        {{ $t("das.dmk.currencyUsd") }}
                      </p>
                    </div>
                    <div
                      class="text-xs lg:text-lg text-white text-right"
                    >
                      <p>{{ $t("das.dmk.totalRefund") }}</p>
                      <p>
                        {{ money(item.price, "0.00") }}
                        {{ $t("das.dmk.currencyUsd") }}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  v-if="historyLoading"
                  class="w-full py-8 text-center text-[#999]"
                >
                  {{ $t("das.common.loading") }}...
                </div>
                <button
                  v-else-if="!historyFinished"
                  type="button"
                  class="mx-auto my-6 px-8 py-3 text-[#999]"
                  @click="loadHistory()"
                >
                  {{ $t("das.dmk.loadMore") }}
                </button>
                <div
                  v-else-if="!historyList.length"
                  class="w-full py-8 text-center text-[#999]"
                >
                  {{ $t("das.common.noData") }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DmkPcLayout>

  <DmkH5Layout class="dmk-mobile-current dmk-starting-mobile">
    <div class="nsg-mobile-section-bar">
      <NsgBackButton decorative />
      <strong>{{ $t("das.dmk.startWork") }}</strong>
      <i aria-hidden="true"></i>
    </div>
    <main class="nsg-start-work nsg-start-work--mobile">
      <section class="nsg-product-pool">
        <header class="nsg-panel-heading">
          <img class="nsg-panel-heading__icon is-cube" src="/nsg16/product-pool-icon.png" alt="" />
          <div><strong>{{ $t("das.nsg.productPool") }}</strong><small>{{ $t("das.nsg.productPoolHint") }}</small></div>
        </header>
        <NsgProductRail :products="displayGoods" :current="current" :loading="goodsLoading" @select="selectRailProduct" />
        <h2 v-if="displayGoods.length">{{ currentProduct.goodsName || '—' }}</h2>
        <div class="nsg-mobile-product-summary">
          <p v-if="displayGoods.length" class="nsg-mobile-rating"><b>★ {{ ratingText(currentProduct.rating) }}</b>&nbsp; {{ currentProduct.reviewCount || 0 }} {{ $t("das.started.reviews") }}</p>
          <p v-if="displayGoods.length" class="nsg-mobile-price">{{ $t("das.dmk.productPrice") }}:&nbsp; <b>{{ money(currentProduct.price, "0.00") }} {{ $t("das.dmk.currencyUsd") }}</b></p>
          <DmkSupport inline class="nsg-product-support" />
        </div>
        <button class="nsg-gradient-button" type="button" :disabled="creatingOrder" @click="handleClick">{{ $t("das.nsg.startMatching") }} <NsgUiIcon name="bolt" /></button>
      </section>

      <section class="nsg-order-match">
        <header class="nsg-panel-heading"><span class="nsg-panel-heading__icon">■</span><strong>{{ $t("das.nsg.orderMatching") }}</strong></header>
        <div class="nsg-balance-card">
          <div><span>{{ $t("das.form.availableBalance") }}</span><strong>{{ h5Amount(userInfo.totalBalance ?? userInfo.balance) }} <small>{{ $t("das.dmk.currencyUsd") }}</small></strong></div>
        </div>
        <div class="nsg-match-stats">
          <div><span class="is-purple"><NsgUiIcon name="clock" /></span><small>{{ $t("das.dmk.commission") }}</small><strong>{{ h5Amount(userInfo.commission) }} {{ $t("das.dmk.currencyUsd") }}</strong></div>
          <div><span class="is-green"><NsgUiIcon name="trend" /></span><small>{{ $t("das.dmk.pendingAmount") }}</small><strong>{{ h5Amount(userInfo.balance) }} {{ $t("das.dmk.currencyUsd") }}</strong></div>
        </div>
        <div class="nsg-progress"><span>{{ $t("das.nsg.todaysProgress") }}</span><b>{{ taskProgressPercent }}%</b><i><u :style="{ width: `${taskProgressPercent}%` }"></u></i></div>
      </section>

      <section class="nsg-order-history">
        <header class="nsg-order-history__header"><strong>{{ $t("das.nsg.orderHistory") }}</strong><div><button v-for="(tab,index) in historyTabs" :key="tab.label" type="button" :class="{ active: historyActive === index }" @click="switchHistoryTab(index)">{{ tab.label }}</button></div></header>
        <div class="nsg-order-history__list">
          <article v-for="(item,index) in historyList" :key="item.id || item.orderNo || index">
            <van-image v-if="hasImage(item.coverUrl)" :src="imageUrl(item.coverUrl)" :alt="item.goodsName || ''" fit="contain" class="nsg-history-cover" /><span v-else class="nsg-history-cover nsg-product-image-missing" aria-hidden="true">◇</span>
            <div class="nsg-history-product"><strong>{{ item.goodsName || '—' }}</strong><span>{{ $t("das.dmk.productPrice") }}: {{ money(item.price, "0.00") }} {{ $t("das.dmk.currencyUsd") }}</span></div>
            <div class="nsg-history-state"><button v-if="String(item.status) === '1'" type="button" class="is-pending" @click="openOrderDetails(item)">{{ $t("das.common.submit") }}<NsgUiIcon name="clock" /></button><em v-else :class="String(item.status) === '0' ? 'is-completed' : 'is-processing'">{{ historyStatus(item.status) }}<NsgUiIcon :name="String(item.status) === '0' ? 'check' : 'refresh'" /></em></div>
            <!-- Keep metrics independent of the div rendered by van-image. -->
            <div class="nsg-mobile-history-stats">
              <div><small>{{ $t("das.dmk.commRate") }}</small><span>{{ historyRate(item.rebatePercentage ?? item.commissionRate ?? item.rate) }}</span></div>
              <div><small>{{ $t("das.dmk.profits") }}</small><span>{{ money(item.commission ?? item.profit, "0.00") }} {{ $t("das.dmk.currencyUsd") }}</span></div>
              <div><small>{{ $t("das.dmk.totalRefund") }}</small><b>{{ money(item.price, "0.00") }} {{ $t("das.dmk.currencyUsd") }}</b></div>
              <time>{{ historyDate(item.createTime ?? item.createdAt) }}</time>
            </div>
          </article>
          <div v-if="historyLoading" class="nsg-order-history__empty">{{ $t("das.common.loading") }}...</div>
          <div v-else-if="!historyList.length" class="nsg-order-history__empty">{{ $t("das.common.noData") }}</div>
          <button v-else-if="!historyFinished" class="nsg-order-history__more" type="button" @click="loadHistory()">{{ $t("das.dmk.loadMore") }}</button>
        </div>
      </section>
    </main>
    <div class="w-full dmk-site-scope nsg-start-legacy">
      <div class="w-full max-w-[1200px] mx-auto text-white">
        <div class="text-[var(--main-color)] text-lg px-4">
          <p>{{ $t("das.dmk.totalBalance") }}</p>
          <p>
            {{ h5Amount(userInfo.totalBalance ?? userInfo.balance) }}
            {{ $t("das.dmk.currencyUsd") }}
          </p>
          <p class="text-xs text-white">
            {{ $t("das.dmk.balanceHint") }}
          </p>
        </div>

        <div class="w-full grid grid-cols-1 gap-4">
          <div class="col-span-1">
            <!-- The current product rail replaces the legacy video background. -->
          </div>
          <div class="col-span-1">
            <div class="w-full px-4 flex justify-between items-center">
              <div class="w-1/2">
                <div class="text-lg text-[var(--main-color)]">
                  <p>{{ $t("das.dmk.commission") }}</p>
                  <p>
                    {{ h5Amount(userInfo.commission) }}
                    {{ $t("das.dmk.currencyUsd") }}
                  </p>
                  <p class="text-white text-xs">
                    {{ $t("das.dmk.commissionHint") }}
                  </p>
                  <div class="w-full flex flex-col mt-4">
                    <p>{{ $t("das.dmk.pendingAmount") }}</p>
                    <p>
                      {{
                        h5Amount(userInfo.balance)
                      }}
                      {{ $t("das.dmk.currencyUsd") }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="w-1/2 flex justify-end items-center">
                <button
                  type="button"
                  class="dmk-task-circle dmk-h5-start-circle van-circle"
                  :class="{ 'dmk-task-circle--full': taskIsFull }"
                  style="width: 150px; height: 150px"
                  :disabled="creatingOrder"
                  @click="handleClick"
                >
                  <DmkTaskWave :full="taskIsFull" />
                  <svg
                    class="dmk-task-progress"
                    style="transform: rotate(270deg)"
                    viewBox="0 0 1040 1040"
                  >
                    <path
                      class="van-circle__layer"
                      d="M 520 520 m 0, -500 a 500, 500 0 1, 1 0, 1000 a 500, 500 0 1, 1 0, -1000"
                      style="
                        fill: none;
                        stroke: rgb(90, 110, 26);
                        stroke-width: 40px;
                      "
                    ></path>
                    <path
                      class="van-circle__hover"
                      :style="{ strokeDasharray: taskProgressDash }"
                      d="M 520 520 m 0, -500 a 500, 500 0 1, 1 0, 1000 a 500, 500 0 1, 1 0, -1000"
                      stroke="rgb(44,185,73)"
                      style="stroke: rgb(44, 185, 73); stroke-width: 41px"
                    ></path>
                  </svg>
                  <div
                    class="w-[150px] h-[150px] flex justify-center items-center bg-black"
                  >
                    <div
                      class="dmk-task-circle__inner w-[120px] h-[120px] bg-[#414c15] rounded-full flex justify-center items-center"
                    >
                      <div class="flex flex-col justify-center items-center">
                        <img
                          alt=""
                          class="w-10"
                          src="/dmk/assets/starting.png"
                        />
                        <p
                          class="dmk-task-circle__count text-xl font-medium text-white text-center mt-2"
                        >
                          ({{ userInfo.dealCount || 0 }}/{{ orderCount || 0 }})
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="w-full px-4 mt-4 bg-[#1a1a1a] py-4 text-left"
          @click="safePush(router, '/records')"
        >
          <i
            class="van-badge__wrapper van-icon van-icon-play"
            style="color: var(--main-color); transform: rotate(-90deg)"
          ></i>
          <p class="text-xl font-medium">{{ $t("das.dmk.history") }}</p>
        </button>
      </div>
    </div>

  </DmkH5Layout>

  <BonusDialog
    :show="bonusVisible"
    :amount="bonusAmount"
    @close="closeBonus"
  />
  <van-dialog
    :show="startAnimationVisible"
    class="start-loading-dialog"
    :show-confirm-button="false"
    :close-on-click-overlay="false"
  >
    <NsgMatchingLoader />
  </van-dialog>

  <DmkSubmitTask
    v-model:show="submitTaskVisible"
    :order="submitTaskOrder"
    :submit-delay-ms="tradeInfo.submitTaskDelayMs"
    @submitted="handleTaskSubmitted"
    @navigate="handleSubmitNavigate"
  />
</template>

<script setup>
import NsgBackButton from "@/components/dmk/NsgBackButton.vue";
import NsgMatchingLoader from "@/components/dmk/NsgMatchingLoader.vue";
import NsgUiIcon from "@/components/dmk/NsgUiIcon.vue";
import NsgProductRail from "@/components/dmk/NsgProductRail.vue";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { closeToast, showLoadingToast, showToast } from "vant";
import {
  createOrder,
  getGoodsList,
  getOrderInfos,
  getTradeConfig,
  userGetInfo,
} from "@/api/apis";
import BonusDialog from "@/components/BonusDialog.vue";
import DmkSubmitTask from "@/components/dmk/DmkSubmitTask.vue";
import DmkTaskWave from "@/components/dmk/DmkTaskWave.vue";
import DmkPcLayout from "@/components/dmkPc/DmkPcLayout.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import { safePush } from "@/utils/navigation";
import { getOrderErrorMessage } from "@/utils/orderCreate";
import { openCustomerServiceDialog } from "@/utils/customerServiceDialog";
import DmkSupport from "@/components/dmk/DmkSupport.vue";

const router = useRouter();
const { t } = useI18n();
const apiImageUrl = window.g?.VITE_API_IMG_URL || "";
const userInfo = ref({});
const levelIconFailed = ref(false);
const tradeInfo = ref({});
const goodsList = ref([]);
const historyTabs = computed(() => [
  { label: t("das.records.all"), status: "" },
  { label: t("das.records.pending"), status: "1" },
  { label: t("das.records.completed"), status: "0" },
]);
const historyActive = ref(0);
const historyList = ref([]);
const historyLoading = ref(false);
const historyFinished = ref(false);
const historyPage = ref(1);
const orderCount = ref(40);
const taskProgress = ref(0);
let taskProgressFrame;
let taskProgressRevealed = false;
const taskProgressTarget = computed(() => {
  const completed = Number(userInfo.value.dealCount ?? 0);
  const limit = Number(orderCount.value);
  return Number.isFinite(completed) && Number.isFinite(limit) && limit > 0
    ? Math.min(1, Math.max(0, completed / limit))
    : 0;
});
const taskProgressDash = computed(() => {
  return `${(3140 * taskProgress.value).toFixed(2)}px, 3140px`;
});
const taskIsFull = computed(() => {
  const completed = Number(userInfo.value.dealCount ?? 0);
  const limit = Number(orderCount.value);
  return (
    Number.isFinite(completed) &&
    Number.isFinite(limit) &&
    limit > 0 &&
    completed >= limit
  );
});
const current = ref(2);
const heroMotion = ref(null);
const dataTransition = ref(false);
const bonusVisible = ref(false);
const bonusAmount = ref("");
const creatingOrder = ref(false);
const startAnimationVisible = ref(false);
const submitTaskVisible = ref(false);
const submitTaskOrder = ref({});
let refreshHistoryOnTaskClose = false;
let refreshTimer;
let carouselTimer;
let dataTransitionTimer;
let startDelayTimer;
let tradeConfigRequest;
let historyRequestVersion = 0;
let historyController;
let pageAlive = false;
const AUTO_DELAY = 3000;
const SOURCE_SLOT_ORDER = [0, 3, 7, 4, 1, 2, 6, 5];
let sourceSlotCursor = 0;

watch(taskProgressTarget, (value) => {
  if (!pageAlive) return;
  window.cancelAnimationFrame(taskProgressFrame);
  if (taskProgressRevealed) {
    taskProgress.value = value;
    return;
  }
  taskProgress.value = 0;
  taskProgressFrame = window.requestAnimationFrame(() => {
    taskProgressFrame = window.requestAnimationFrame(() => {
      taskProgressRevealed = true;
      taskProgress.value = value;
    });
  });
});

const goodsLoading = ref(true);
const displayGoods = computed(() => goodsList.value);

const currentProduct = computed(
  () => displayGoods.value[current.value] || displayGoods.value[0] || {},
);

const currentLevel = computed(
  () =>
    userInfo.value.userLevel?.level ??
    userInfo.value.memberLevel?.level ??
    userInfo.value.levelId ??
    userInfo.value.vipId ??
    1,
);
const levelIcon = computed(() => {
  if (levelIconFailed.value) return "";
  const path =
    userInfo.value.userLevel?.icon ??
    userInfo.value.memberLevel?.icon ??
    userInfo.value.levelIcon ??
    userInfo.value.vipIcon;
  return hasImage(path) ? imageUrl(path) : "";
});

const backdropProducts = computed(() => {
  const list = displayGoods.value;
  if (!list.length) return [];
  return Array.from({ length: 8 }, (_, offset) => {
    const index = (current.value + offset + 1) % list.length;
    const item = list[index] || {};
    return {
      item,
      index,
      key: `${item.id || item.orderNo || "product"}-${index}-${offset}`,
      slot: offset,
    };
  });
});

const dotItems = computed(() =>
  Array.from({ length: Math.min(Math.max(displayGoods.value.length, 1), 8) }),
);
const activeDot = computed(() => current.value % dotItems.value.length);
const taskProgressPercent = computed(() =>
  Math.round(taskProgressTarget.value * 100),
);

const heroMotionStyle = computed(() => {
  if (!heroMotion.value) return {};
  return {
    "--throw-x": `${heroMotion.value.x}px`,
    "--throw-y": `${heroMotion.value.y}px`,
    "--throw-r": `${heroMotion.value.r}deg`,
  };
});

const motionForSlot = (slot = 0) => {
  const index = Number(slot || 0);
  const isTop = index < 4;
  const isLeft = [0, 1, 4, 5].includes(index);
  const isNear = [1, 2, 5, 6].includes(index);
  return {
    x: (isLeft ? -1 : 1) * (isNear ? 108 : 168),
    y: (isTop ? -1 : 1) * (isNear ? 82 : 102),
    r: (isLeft ? -1 : 1) * (isTop ? 8 : -8),
  };
};

// The visible rail owns its spring animation; it does not depend on the hidden legacy hero's animationend.
const selectRailProduct = (index) => {
  current.value = index;
  startCarousel();
};

const advanceProduct = () => {
  const length = goodsList.value.length;
  if (!pageAlive || length <= 1) return;
  const slot = SOURCE_SLOT_ORDER[sourceSlotCursor % SOURCE_SLOT_ORDER.length];
  sourceSlotCursor += 1;
  const incoming = backdropProducts.value.find((entry) => entry.slot === slot);
  if (!incoming) return;
  heroMotion.value = motionForSlot(incoming.slot);
  current.value = incoming.index;
};

const selectBackdrop = (entry) => {
  if (!entry || heroMotion.value) return;
  heroMotion.value = motionForSlot(entry.slot);
  current.value = entry.index;
  startCarousel();
};

const startCarousel = () => {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(advanceProduct, AUTO_DELAY);
};

const hasImage = (path) => {
  const value = String(path ?? "")
    .trim()
    .toLowerCase();
  return Boolean(value && value !== "null" && value !== "undefined");
};
const imageUrl = (path) =>
  /^https?:/i.test(String(path || "")) ? path : `${apiImageUrl}${path}`;

const money = (value, fallback) =>
  value === undefined || value === null || value === ""
    ? fallback
    : Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

const historyTabLineStyle = computed(() => ({
  width: "50px",
  backgroundColor: "var(--main-color)",
  transform: `translateX(${200 + historyActive.value * 400}px) translateX(-50%)`,
  transitionDuration: ".3s",
}));
const historyRate = (value) => {
  if (value === undefined || value === null || value === "") return "—";
  const text = String(value);
  if (text.includes("%")) return text;
  const number = Number(value);
  return Number.isFinite(number) ? `${number}%` : text;
};
const historyStatus = (status) =>
  String(status) === "0"
    ? t("das.records.completed")
    : String(status) === "2"
      ? t("das.records.frozen")
      : t("das.records.pending");
const historyDate = (value) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime()))
    return String(value).replace("T", " ").slice(0, 19);
  return parsed
    .toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    .replace(/^(\d{2})\/(\d{2})\/(\d{4}), /, "$3-$1-$2 ");
};
const cancelHistoryRequest = () => {
  historyRequestVersion += 1;
  historyController?.abort();
  historyController = undefined;
  historyLoading.value = false;
};
const loadHistory = async ({ replace = false } = {}) => {
  if (historyLoading.value) return;
  const version = ++historyRequestVersion;
  const controller = new AbortController();
  historyController = controller;
  historyLoading.value = true;
  const pageNum = replace ? 1 : historyPage.value;
  const pageSize = 10;
  try {
    const response = await getOrderInfos(
      {
        pageNum,
        pageSize,
        status: historyTabs.value[historyActive.value].status,
      },
      { signal: controller.signal },
    );
    if (version !== historyRequestVersion) return;
    const rows = response.rows || [];
    historyList.value = replace ? rows : [...historyList.value, ...rows];
    const total = Number(response.total || 0);
    historyFinished.value =
      rows.length < pageSize ||
      (total > 0 && historyList.value.length >= total);
    historyPage.value = pageNum + 1;
  } catch (_) {
    if (!controller.signal.aborted && version === historyRequestVersion) {
      historyFinished.value = true;
    }
  } finally {
    if (version === historyRequestVersion) {
      historyController = undefined;
      historyLoading.value = false;
    }
  }
};
const switchHistoryTab = (index) => {
  if (historyActive.value === index) return;
  cancelHistoryRequest();
  historyActive.value = index;
  historyList.value = [];
  historyPage.value = 1;
  historyFinished.value = false;
  loadHistory({ replace: true });
};

const h5Amount = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    useGrouping: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const ratingText = (value) => {
  if (value === undefined || value === null || value === "") return "—";
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return number.toLocaleString(undefined, { maximumFractionDigits: 1 });
};

const formatClock = (value) => {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value === "number" || /^\d{10,13}$/.test(String(value))) {
    const raw = Number(value);
    const date = new Date(String(value).length === 10 ? raw * 1000 : raw);
    if (!Number.isNaN(date.getTime())) {
      return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    }
  }
  const text = String(value).trim();
  const clock = text.match(/(?:^|T|\s)(\d{1,2}):(\d{2})/);
  if (clock) return `${clock[1].padStart(2, "0")}:${clock[2]}`;
  if (/^\d{1,2}$/.test(text)) return `${text.padStart(2, "0")}:00`;
  return text;
};

const tradeStart = computed(() =>
  formatClock(
    tradeInfo.value.workTimeStart ??
      tradeInfo.value.serviceTimeRange?.[0] ??
      tradeInfo.value.workStartTime ??
      tradeInfo.value.businessStartTime ??
      tradeInfo.value.serviceStartTime ??
      tradeInfo.value.startTime ??
      tradeInfo.value.start,
  ),
);
const tradeEnd = computed(() =>
  formatClock(
    tradeInfo.value.workTimeEnd ??
      tradeInfo.value.serviceTimeRange?.[1] ??
      tradeInfo.value.workEndTime ??
      tradeInfo.value.businessEndTime ??
      tradeInfo.value.serviceEndTime ??
      tradeInfo.value.endTime ??
      tradeInfo.value.end,
  ),
);
const noticeText = computed(() =>
  tradeStart.value && tradeEnd.value
    ? t("das.started.noticeWithHours", {
        start: tradeStart.value,
        end: tradeEnd.value,
      })
    : t("das.started.noticeText"),
);

const delayMs = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
};

const waitForStartDelay = () =>
  new Promise((resolve) => {
    const timeout = delayMs(tradeInfo.value.startTaskDelayMs);
    if (!timeout) {
      resolve();
      return;
    }
    startDelayTimer = setTimeout(resolve, timeout);
  });

const loadTradeConfig = () => {
  if (!tradeConfigRequest) {
    tradeConfigRequest = getTradeConfig()
      .then((res) => {
        if (pageAlive) tradeInfo.value = res.data || {};
        return res;
      })
      .catch(() => null);
  }
  return tradeConfigRequest;
};

const getList = async () => {
  try {
    const res = await getGoodsList();
    if (!pageAlive) return;
    const nextGoods = Array.isArray(res.data) ? res.data : [];
    const signature = (list) =>
      JSON.stringify(
        list.map((item) => [
          item.id ?? item.orderNo,
          item.coverUrl,
          item.goodsName,
          item.price,
          item.rating,
        ]),
      );
    if (signature(nextGoods) !== signature(goodsList.value)) {
      const previousId =
        currentProduct.value.id ?? currentProduct.value.orderNo;
      goodsList.value = nextGoods;
      const preservedIndex = nextGoods.findIndex(
        (item) => String(item.id ?? item.orderNo) === String(previousId),
      );
      current.value =
        preservedIndex >= 0
          ? preservedIndex
          : Math.min(2, Math.max(0, nextGoods.length - 1));
      dataTransition.value = false;
      await nextTick();
      dataTransition.value = true;
      clearTimeout(dataTransitionTimer);
      dataTransitionTimer = setTimeout(() => {
        dataTransition.value = false;
      }, 760);
    }
  } catch (_) {
  } finally {
    if (pageAlive) {
      goodsLoading.value = false;
      refreshTimer = setTimeout(getList, 10000);
    }
  }
};

const openOrderDetails = (order, { refreshOnClose = false } = {}) => {
  if (!order?.id) return;
  refreshHistoryOnTaskClose = refreshOnClose;
  submitTaskOrder.value = order;
  submitTaskVisible.value = true;
};

const refreshAfterSubmit = async () => {
  cancelHistoryRequest();
  historyPage.value = 1;
  historyFinished.value = false;
  const [userResult] = await Promise.allSettled([
    userGetInfo(),
    loadHistory({ replace: true }),
  ]);
  if (!pageAlive || userResult.status !== "fulfilled") return;
  userInfo.value = userResult.value.data || {};
  levelIconFailed.value = false;
  orderCount.value = userResult.value.data?.userLevel?.orderCount || 40;
};

const handleTaskSubmitted = (updatedOrder) => {
  refreshHistoryOnTaskClose = false;
  submitTaskOrder.value = updatedOrder || submitTaskOrder.value;
  refreshAfterSubmit();
};

const handleSubmitNavigate = (path) => {
  refreshHistoryOnTaskClose = false;
  submitTaskVisible.value = false;
  if (path === "/contact") {
    openCustomerServiceDialog();
    return;
  }
  safePush(router, path);
};

watch(submitTaskVisible, (visible, wasVisible) => {
  if (visible || !wasVisible) return;

  const shouldRefresh =
    refreshHistoryOnTaskClose &&
    window.matchMedia("(min-width: 1024px)").matches;
  refreshHistoryOnTaskClose = false;

  if (shouldRefresh) {
    refreshAfterSubmit();
  }
});

const closeBonus = () => {
  bonusVisible.value = false;
};

const handleClick = async () => {
  if (creatingOrder.value) return;
  creatingOrder.value = true;
  startAnimationVisible.value = true;
  try {
    await loadTradeConfig();
    await waitForStartDelay();
    if (!pageAlive) return;
    startAnimationVisible.value = false;
    showLoadingToast({
      message: t("das.started.creating"),
      forbidClick: true,
      duration: 0,
    });
    const res = await createOrder();
    closeToast();
    if (res.resultType === "BONUS") {
      bonusAmount.value = res.data?.amount ?? "";
      bonusVisible.value = true;
      return;
    }
    const order = res.data || {};
    showToast(t("das.started.created"));
    openOrderDetails(order, { refreshOnClose: true });
  } catch (error) {
    closeToast();
    if (Number(error?.code) === 2000) {
      bonusAmount.value = error?.data?.amount ?? "";
      bonusVisible.value = true;
      return;
    }
    if (Number(error?.code) === 907 && error?.data?.id) {
      openOrderDetails(error.data);
      return;
    }
    showToast(getOrderErrorMessage(t, error, "das.started.unableCreate"));
  } finally {
    startAnimationVisible.value = false;
    creatingOrder.value = false;
  }
};

onMounted(async () => {
  pageAlive = true;
  getList();
  loadHistory({ replace: true });
  const [userResult, tradeResult] = await Promise.allSettled([
    userGetInfo(),
    loadTradeConfig(),
  ]);
  if (!pageAlive) return;
  if (userResult.status === "fulfilled") {
    userInfo.value = userResult.value.data || {};
    levelIconFailed.value = false;
    orderCount.value = userResult.value.data?.userLevel?.orderCount || 40;
  }
  if (tradeResult.status === "fulfilled") {
    tradeInfo.value = tradeResult.value?.data || tradeInfo.value;
  }
  startCarousel();
});

onUnmounted(() => {
  pageAlive = false;
  window.cancelAnimationFrame(taskProgressFrame);
  cancelHistoryRequest();
  clearTimeout(refreshTimer);
  clearTimeout(dataTransitionTimer);
  clearTimeout(startDelayTimer);
  clearInterval(carouselTimer);
});
</script>

<style scoped>
.dmk-starting-mobile {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  overscroll-behavior-x: none;
  touch-action: pan-y;
}

.dmk-starting-mobile .dmk-site-scope {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.dmk-task-circle {
  --task-ring-color: #2cb949;
  --task-track-color: #5a6e1a;
  --task-core-color: #414c15;
  --task-wave-color: rgba(44, 185, 73, 0.68);
  position: relative;
  overflow: visible;
  isolation: isolate;
  border-radius: 50%;
}
.dmk-task-circle--full {
  --task-ring-color: #ff3b3b;
  --task-track-color: #792525;
  --task-core-color: #581d1d;
  --task-wave-color: rgba(255, 59, 59, 0.7);
}
.dmk-task-progress {
  z-index: 2;
  animation: dmk-task-ring-glow 1.65s ease-in-out infinite;
}
.dmk-task-circle > div {
  position: relative;
  z-index: 1;
  overflow: hidden;
  border-radius: 50%;
}
.dmk-task-circle .van-circle__layer {
  stroke: var(--task-track-color) !important;
  transition: stroke 0.35s ease;
}
.dmk-task-circle .van-circle__hover {
  stroke: var(--task-ring-color) !important;
  stroke-linecap: round;
  filter: drop-shadow(0 0 8px var(--task-wave-color));
  transition:
    stroke 0.35s ease,
    stroke-dasharray 1.6s cubic-bezier(0.2, 0.72, 0.24, 1);
}
.dmk-task-circle__inner {
  background: var(--task-core-color) !important;
  transition:
    background-color 0.35s ease,
    box-shadow 0.35s ease;
  box-shadow: inset 0 0 34px rgba(0, 0, 0, 0.22);
}
.dmk-task-circle--full .dmk-task-circle__inner {
  box-shadow:
    inset 0 0 34px rgba(0, 0, 0, 0.25),
    0 0 24px rgba(255, 59, 59, 0.18);
}
.dmk-task-circle__count {
  transition: color 0.35s ease;
}
.dmk-task-circle--full .dmk-task-circle__count {
  color: #ffb4b4 !important;
}
@keyframes dmk-task-ring-glow {
  0%,
  100% {
    filter: drop-shadow(0 0 2px var(--task-wave-color));
  }
  50% {
    filter: drop-shadow(0 0 13px var(--task-wave-color));
  }
}
.started-page {
  background: #ecf3e8;
  color: #17382d;
}
.started-bg {
  background: url("@/static/das/bg-get-started.png") top center/100% auto
    no-repeat;
  padding-bottom: 28px;
}
.started-user {
  min-height: 106px;
  box-sizing: border-box;
  padding: 39px 20px 20px;
  display: grid;
  grid-template-columns: 48px 1fr auto 25px;
  align-items: center;
  color: #f7f5ec;
}
.started-user button {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font-size: 32px;
  font-weight: 200;
}
.started-user button img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}
.started-user div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.started-user span {
  opacity: 0.65;
  font-size: 13px;
}
.started-user strong {
  font-size: 17px;
}
.started-user b {
  font-size: 14px;
  margin-right: 10px;
}
.started-user :deep(.das-icon) {
  width: 24px;
  height: 24px;
}
.started-user__level-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.product-stage {
  --hero-half: min(33%, 142px);
  --mini-w: 96px;
  --mini-peek: 30px;
  --mini-gap: 14px;
  height: 356px;
  position: relative;
  overflow: hidden;
}
.product-stage__backdrop {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
.product-stage__mini {
  position: absolute;
  width: var(--mini-w);
  height: 132px;
  padding: 8px;
  overflow: hidden;
  border: 0;
  border-radius: 16px;
  background: rgba(248, 248, 240, 0.96);
  box-shadow: 0 8px 20px rgba(20, 57, 44, 0.09);
  cursor: pointer;
  pointer-events: auto;
}
.product-stage__mini:nth-child(1),
.product-stage__mini:nth-child(2),
.product-stage__mini:nth-child(3),
.product-stage__mini:nth-child(4) {
  top: 33px;
}
.product-stage__mini:nth-child(5),
.product-stage__mini:nth-child(6),
.product-stage__mini:nth-child(7),
.product-stage__mini:nth-child(8) {
  bottom: 33px;
}
.product-stage__mini:nth-child(1),
.product-stage__mini:nth-child(5) {
  left: calc(
    50% - var(--hero-half) - var(--mini-peek) - var(--mini-w) - var(--mini-gap)
  );
}
.product-stage__mini:nth-child(2),
.product-stage__mini:nth-child(6) {
  left: calc(50% - var(--hero-half) - var(--mini-peek));
}
.product-stage__mini:nth-child(3),
.product-stage__mini:nth-child(7) {
  right: calc(50% - var(--hero-half) - var(--mini-peek));
}
.product-stage__mini:nth-child(4),
.product-stage__mini:nth-child(8) {
  right: calc(
    50% - var(--hero-half) - var(--mini-peek) - var(--mini-w) - var(--mini-gap)
  );
}
.product-stage__mini img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.product-placeholder {
  display: block;
  color: #c0c6c3;
}
.product-placeholder--mini {
  width: 32px;
  height: 27px;
  margin: auto;
}
.product-placeholder--hero {
  width: 66px;
  height: 54px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.product-stage__hero {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(66%, 284px);
  height: 356px;
  transform: translate(-50%, -50%);
  z-index: 2;
  padding: 24px;
  overflow: hidden;
  border: 4px solid transparent;
  border-radius: 28px;
  background:
    linear-gradient(#fff, #fff) padding-box,
    linear-gradient(135deg, #ee907f, #e2b64c, #258672) border-box;
  box-shadow: 0 18px 28px rgba(20, 57, 44, 0.26);
}
.product-stage__hero::before,
.product-stage__hero::after {
  content: "";
  position: absolute;
  width: 27px;
  height: 27px;
  pointer-events: none;
}
.product-stage__hero::before {
  left: 17px;
  top: 17px;
  border-left: 3px solid #ee907f;
  border-top: 3px solid #ee907f;
  border-radius: 7px 0 0;
}
.product-stage__hero::after {
  right: 17px;
  bottom: 17px;
  border-right: 3px solid #76a8c6;
  border-bottom: 3px solid #76a8c6;
  border-radius: 0 0 7px;
}
.product-stage__hero img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.product-stage__hero.is-throwing {
  animation: product-throw-in 720ms cubic-bezier(0.16, 1.05, 0.3, 1) both;
}
@keyframes product-data-in {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
    filter: blur(5px);
  }
  65% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: blur(0);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes product-mini-data-in {
  0% {
    opacity: 0;
    transform: translateY(14px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes product-copy-data-in {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.started-bg.is-data-transitioning .product-stage__hero:not(.is-throwing) {
  animation: product-data-in 680ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.started-bg.is-data-transitioning .product-stage__mini {
  animation: product-mini-data-in 520ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.started-bg.is-data-transitioning .product-stage__mini:nth-child(2),
.started-bg.is-data-transitioning .product-stage__mini:nth-child(6) {
  animation-delay: 45ms;
}
.started-bg.is-data-transitioning .product-stage__mini:nth-child(3),
.started-bg.is-data-transitioning .product-stage__mini:nth-child(7) {
  animation-delay: 90ms;
}
.started-bg.is-data-transitioning .product-stage__mini:nth-child(4),
.started-bg.is-data-transitioning .product-stage__mini:nth-child(8) {
  animation-delay: 135ms;
}
.started-bg.is-data-transitioning .product-copy {
  animation: product-copy-data-in 560ms 100ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes product-throw-in {
  0% {
    opacity: 0.34;
    filter: blur(1.5px);
    transform: translate(
        calc(-50% + var(--throw-x, 0px)),
        calc(-50% + var(--throw-y, 0px))
      )
      scale(0.34) rotate(var(--throw-r, 0deg));
    box-shadow: 0 5px 9px rgba(20, 57, 44, 0.08);
  }
  64% {
    opacity: 1;
    filter: blur(0);
    transform: translate(-50%, -50%) scale(1) rotate(0);
    box-shadow: 0 24px 36px rgba(20, 57, 44, 0.3);
  }
  82% {
    transform: translate(-50%, -50%) scale(0.985) rotate(0);
  }
  100% {
    opacity: 1;
    filter: blur(0);
    transform: translate(-50%, -50%) scale(1) rotate(0);
    box-shadow: 0 18px 28px rgba(20, 57, 44, 0.26);
  }
}
.product-dots {
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7px;
}
.product-dots i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(23, 56, 45, 0.18);
}
.product-dots i.active {
  width: 22px;
  border-radius: 999px;
  background: #14392c;
}
.product-copy {
  padding: 18px 27px 0;
  text-align: center;
}
.product-copy h1 {
  margin: 0;
  font-size: 17px;
}
.product-rating {
  margin: 8px 0;
  color: #727b75;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-rating img {
  width: 14px;
  height: 14px;
  margin-right: 5px;
  object-fit: contain;
  vertical-align: -2px;
}
.product-copy h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 400;
}
.product-copy button {
  width: 100%;
  height: 55px;
  margin-top: 20px;
  border: 3px solid transparent;
  border-radius: 999px;
  background:
    linear-gradient(#14392c, #14392c) padding-box,
    linear-gradient(90deg, #ef9382, #dfb34a, #277b68) border-box;
  color: white;
  font-size: 17px;
  font-weight: 800;
  box-shadow: 0 13px 20px rgba(20, 57, 44, 0.2);
}
.product-copy button:disabled {
  opacity: 0.65;
}

.margin-card,
.notice-card {
  margin: 22px 24px 0;
  padding: 28px 22px 24px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.92);
  text-align: center;
}
.margin-card__main-icon {
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.margin-card__main-icon :deep(.das-icon) {
  width: 29px;
  height: 29px;
}
.margin-card h2 {
  margin: 13px 0 11px;
  font-size: 17px;
}
.margin-card > strong {
  font-size: 24px;
  font-weight: 400;
}
.margin-card > p {
  margin: 17px 0 14px;
  color: #8b918c;
  font-size: 12px;
  line-height: 1.4;
}
.balance-grid {
  padding-top: 21px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid #e3e5df;
}
.balance-grid > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  padding: 0 11px;
}
.balance-grid b {
  font-size: 13px;
}
.balance-grid span {
  font-size: 15px;
}
.balance-grid small {
  color: #8f9490;
  font-size: 10px;
  line-height: 1.3;
}
.notice-card {
  padding: 24px 28px;
}
.notice-card h2 {
  margin: 0 0 10px;
  font-size: 15px;
  font-weight: 800;
}
.notice-card p {
  margin: 0;
  color: #858b86;
  font-size: 12px;
  line-height: 1.55;
}
.das-copyright {
  margin: 24px 0 0;
  color: #98a29a;
  font-size: 9px;
  text-align: center;
}

.nsg-start-legacy {
  display: none !important;
}

.nsg-start-work {
  box-sizing: border-box;
  color: #d9def5;
  font-family: "DM Sans", Arial, sans-serif;
}

.nsg-start-work button {
  font: inherit;
}

.nsg-start-work--desktop {
  width: min(1216px, calc(100% - 48px));
  margin: 0 auto;
  padding: 16px 0 116px;
}

.nsg-start-work__crumb {
  margin: 0 0 32px;
  color: #595d78;
  font-size: 12px;
  letter-spacing: 0.08em;
}

.nsg-start-work__crumb span {
  margin: 0 10px;
  color: #323752;
}

.nsg-start-work__top {
  display: grid;
  grid-template-columns: 1.36fr 1fr;
  gap: 14px;
}

.nsg-product-pool,
.nsg-order-match,
.nsg-order-history {
  box-sizing: border-box;
  border: 1px solid #111b55;
  border-radius: 12px;
  background: #050922;
}

.nsg-product-pool,
.nsg-order-match {
  min-height: 470px;
  padding: 22px 16px 22px;
}

.nsg-panel-heading {
  display: flex;
  min-height: 44px;
  align-items: center;
  gap: 11px;
  color: #dce1f7;
}

.nsg-panel-heading__icon {
  color: #4fc8ff;
  font-size: 23px;
  font-weight: 800;
  text-shadow: 0 0 12px #4c50ff;
}

.nsg-panel-heading div {
  display: flex;
  flex-direction: column;
}

.nsg-panel-heading strong {
  font-size: 16px;
  letter-spacing: 0.025em;
}

.nsg-panel-heading small {
  margin-top: 4px;
  color: #737a9c;
  font-size: 11px;
}

.nsg-panel-heading em {
  margin-left: auto;
  padding: 12px 22px;
  border: 1px solid #202a75;
  border-radius: 999px;
  color: #b6b1ea;
  background: #080e35;
  box-shadow: 0 0 20px rgba(65, 56, 240, 0.22);
  font-size: 12px;
  font-style: normal;
}

.nsg-order-match .nsg-panel-heading {
  margin-bottom: 21px;
}

.nsg-balance-card {
  box-sizing: border-box;
  min-height: 94px;
  padding: 18px 21px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0;
  border-radius: 10px;
  background: url('/nsg16/matching-balance-pc.png') center / 100% 100% no-repeat;
}

.nsg-balance-card div {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nsg-balance-card span {
  color: #8f8ad1;
  font-size: 13px;
}

.nsg-balance-card strong {
  color: #f8f9ff;
  font-size: 18px;
}

.nsg-balance-card small {
  color: #b5bad5;
  font-size: 11px;
  font-weight: 500;
}

.nsg-balance-card img {
  width: 74px;
  height: 58px;
  object-fit: contain;
}

.nsg-match-stats {
  margin: 16px 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.nsg-match-stats > div {
  box-sizing: border-box;
  min-height: 66px;
  padding: 13px 15px 11px 58px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid #111a45;
  border-radius: 9px;
  background: #060b29;
}

.nsg-match-stats > div > span {
  position: absolute;
  left: 14px;
  top: 15px;
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  font-size: 17px;
}

.nsg-match-stats .is-purple {
  color: #b75bff;
  background: #211052;
}

.nsg-match-stats .is-green {
  color: #5ff7bc;
  background: #0c3037;
}

.nsg-match-stats small {
  color: #727998;
  font-size: 10px;
}

.nsg-match-stats strong {
  margin-top: 5px;
  color: #e7ebff;
  font-size: 13px;
}

.nsg-gradient-button {
  width: 100%;
  height: 47px;
  border: 0;
  border-radius: 7px;
  color: #fff;
  background: linear-gradient(90deg, #55baf0, #8840dc);
  box-shadow: 0 9px 25px rgba(77, 91, 255, 0.18);
  font-size: 14px;
  font-weight: 750;
  letter-spacing: 0.02em;
  cursor: pointer;
}

.nsg-gradient-button:disabled {
  opacity: 0.62;
}

.nsg-progress {
  margin-top: 22px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  color: #8b91ae;
  font-size: 12px;
}

.nsg-progress b {
  color: #dfe3f7;
}

.nsg-progress i {
  height: 8px;
  grid-column: 1 / -1;
  overflow: hidden;
  border-radius: 99px;
  background: #2b3046;
}

.nsg-progress u {
  height: 100%;
  min-width: 0;
  display: block;
  border-radius: inherit;
  background: linear-gradient(90deg, #52bcee, #8a3edb);
  text-decoration: none;
}

.nsg-order-history {
  margin-top: 24px;
  padding: 23px;
  border-color: #171d34;
  background: #070b15;
}

.nsg-order-history__header {
  min-height: 43px;
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid #1b2234;
}

.nsg-order-history__header > strong {
  color: #dbe0f4;
  font-size: 15px;
}

.nsg-order-history__header > div {
  margin-left: 32px;
  display: flex;
  align-self: stretch;
  gap: 26px;
}

.nsg-order-history__header button {
  padding: 0 0 14px;
  border: 0;
  border-bottom: 3px solid transparent;
  color: #7f8499;
  background: none;
  font-size: 13px;
  cursor: pointer;
}

.nsg-order-history__header button.active {
  border-color: #6b5dff;
  color: #f3f4ff;
}

.nsg-order-history__list {
  padding-top: 16px;
}

.nsg-order-history__list article {
  box-sizing: border-box;
  min-height: 78px;
  margin-bottom: 10px;
  padding: 11px 18px;
  display: grid;
  grid-template-columns: 54px 1.25fr 0.8fr 0.8fr 0.85fr 1fr;
  align-items: center;
  gap: 14px;
  border: 1px solid #1a2540;
  border-radius: 9px;
  background: #121a2e;
}

.nsg-order-history__list article > img {
  width: 45px;
  height: 50px;
  object-fit: contain;
}

.nsg-order-history__list article > div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nsg-order-history__list small,
.nsg-order-history__list time {
  color: #68718e;
  font-size: 9px;
}

.nsg-order-history__list span {
  color: #cfd4e9;
  font-size: 11px;
}

.nsg-order-history__list b {
  color: #43ddad;
  font-size: 11px;
}

.nsg-history-product strong {
  color: #f3f5ff;
  font-size: 13px;
}

.nsg-history-state {
  align-items: flex-end;
}

.nsg-history-state button,
.nsg-history-state em {
  padding: 4px 12px;
  border: 1px solid #14694f;
  border-radius: 999px;
  color: #54e6b7;
  background: #08372f;
  font-size: 10px;
  font-style: normal;
}

.nsg-order-history__empty,
.nsg-order-history__more {
  box-sizing: border-box;
  width: 100%;
  min-height: 92px;
  display: grid;
  place-items: center;
  border: 0;
  color: #6d7592;
  background: transparent;
  font-size: 13px;
}

.nsg-start-work--mobile {
  display: none;
}

@media (max-width: 1023px) {
  .nsg-start-work--desktop {
    display: none;
  }

  .nsg-start-work--mobile {
    width: 100%;
    padding: 23px 20px 60px;
    display: block;
  }

  .nsg-start-work--mobile .nsg-product-pool,
  .nsg-start-work--mobile .nsg-order-match,
  .nsg-start-work--mobile .nsg-order-history {
    border: 0;
    background: transparent;
  }

  .nsg-start-work--mobile .nsg-product-pool {
    min-height: 0;
    padding: 0 0 32px;
  }

  .nsg-start-work--mobile .nsg-panel-heading {
    min-height: 50px;
    align-items: flex-start;
  }

  .nsg-start-work--mobile .nsg-panel-heading strong {
    font-size: 18px;
  }

  .nsg-start-work--mobile .nsg-panel-heading small {
    font-size: 12px;
  }

  .nsg-start-work--mobile .nsg-product-pool h2 {
    margin: 22px 0 7px;
    color: #fff;
    font-size: 20px;
    text-align: center;
  }

  .nsg-mobile-rating,
  .nsg-mobile-price {
    margin: 0;
    color: #858ba0;
    text-align: center;
  }

  .nsg-mobile-product-summary {
    position: relative;
    min-height: 72px;
    padding: 0 64px;
  }

  .nsg-mobile-product-summary .nsg-product-support {
    position: absolute;
    top: 6px;
    right: 0;
    width: 66px;
    height: 66px;
    overflow: visible;
  }

  .nsg-mobile-rating {
    font-size: 13px;
  }

  .nsg-mobile-rating b {
    color: #ffc800;
  }

  .nsg-mobile-price {
    margin-top: 14px;
    color: #fff;
    font-size: 18px;
    font-weight: 700;
  }

  .nsg-mobile-price b {
    color: #52bff4;
  }

  .nsg-start-work--mobile .nsg-gradient-button {
    height: 58px;
    margin-top: 35px;
    border-radius: 8px;
    font-size: 16px;
  }

  .nsg-start-work--mobile .nsg-order-match {
    min-height: 0;
    margin-top: 0;
    padding: 20px;
    border: 1px solid #1b2742;
    border-radius: 9px;
    background: #101828;
  }

  .nsg-start-work--mobile .nsg-order-match .nsg-panel-heading {
    min-height: 38px;
    margin-bottom: 12px;
    border-bottom: 2px solid #283145;
  }

  .nsg-start-work--mobile .nsg-order-match .nsg-panel-heading strong {
    font-size: 13px;
    letter-spacing: 0.09em;
  }

  .nsg-start-work--mobile .nsg-balance-card {
    min-height: 94px;
    padding: 14px 16px;
    background-image: url('/nsg16/matching-balance-h5.png');
  }

  .nsg-start-work--mobile .nsg-balance-card strong {
    font-size: 26px;
  }

  .nsg-start-work--mobile .nsg-balance-card img {
    width: 74px;
  }

  .nsg-start-work--mobile .nsg-match-stats {
    margin: 12px 0 19px;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .nsg-start-work--mobile .nsg-match-stats > div {
    min-height: 62px;
    padding-left: 54px;
  }

  .nsg-start-work--mobile .nsg-progress {
    padding-top: 17px;
    border-top: 2px solid #273044;
  }

  .nsg-start-work--mobile .nsg-progress b {
    color: #4fc9ff;
  }

  .nsg-start-work--mobile .nsg-order-history {
    margin-top: 35px;
    padding: 0;
  }

  .nsg-start-work--mobile .nsg-order-history__header {
    min-height: 48px;
    justify-content: space-between;
    align-items: center;
    border: 0;
  }

  .nsg-start-work--mobile .nsg-order-history__header > strong {
    font-size: 13px;
    letter-spacing: 0.05em;
  }

  .nsg-start-work--mobile .nsg-order-history__header > div {
    height: 36px;
    margin: 0;
    align-self: auto;
    gap: 0;
    border: 1px solid #28314a;
    border-radius: 5px;
    background: #141b2d;
  }

  .nsg-start-work--mobile .nsg-order-history__header button {
    height: 100%;
    padding: 0 13px;
    border: 0;
    border-radius: 4px;
    font-size: 11px;
  }

  .nsg-start-work--mobile .nsg-order-history__header button.active {
    color: #fff;
    background: #635bea;
  }

  .nsg-start-work--mobile .nsg-order-history__list {
    padding-top: 10px;
  }

  .nsg-start-work--mobile .nsg-order-history__list article {
    min-height: 158px;
    margin-bottom: 12px;
    padding: 14px 13px;
    grid-template-columns: 58px minmax(0, 1fr) auto;
    grid-template-rows: auto auto;
    gap: 11px 10px;
    border-color: #1b2842;
    background: #11192b;
  }

  .nsg-start-work--mobile .nsg-order-history__list article > img {
    width: 45px;
    height: 52px;
  }

  .nsg-start-work--mobile .nsg-history-product strong {
    font-size: 14px;
  }

  .nsg-start-work--mobile .nsg-history-product span {
    color: #aeb5cb;
    font-size: 11px;
  }

  .nsg-start-work--mobile .nsg-history-state {
    align-self: start;
  }

  .nsg-start-work--mobile .nsg-order-history__list article > .nsg-mobile-history-stats {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 4px 8px;
    padding-top: 11px;
    border-top: 2px solid #202a3e;
  }

  .nsg-mobile-history-stats > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .nsg-mobile-history-stats > div:nth-child(2) {
    align-items: center;
  }

  .nsg-mobile-history-stats > div:nth-child(3) {
    align-items: flex-end;
  }

  .nsg-mobile-history-stats time {
    grid-column: 1 / -1;
    text-align: right;
    margin-top: 7px;
    white-space: nowrap;
  }
}

@media (max-width: 380px) {
  .product-stage {
    --hero-half: min(33%, 126px);
    --mini-w: 84px;
    --mini-peek: 26px;
    --mini-gap: 11px;
    height: 330px;
  }
  .product-stage__hero {
    width: min(66%, 252px);
    height: 330px;
  }
  .product-stage__mini {
    height: 116px;
  }
  .product-stage__mini:nth-child(1),
  .product-stage__mini:nth-child(2),
  .product-stage__mini:nth-child(3),
  .product-stage__mini:nth-child(4) {
    top: 37px;
  }
  .product-stage__mini:nth-child(5),
  .product-stage__mini:nth-child(6),
  .product-stage__mini:nth-child(7),
  .product-stage__mini:nth-child(8) {
    bottom: 37px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dmk-task-circle .van-circle__hover {
    transition: none;
  }
  .dmk-task-progress,
  .product-stage__hero.is-throwing,
  .started-bg.is-data-transitioning .product-stage__hero,
  .started-bg.is-data-transitioning .product-stage__mini,
  .started-bg.is-data-transitioning .product-copy {
    animation: none;
  }
}

.nsg-panel-heading strong { text-transform: uppercase; font-weight: 600; }
.nsg-panel-heading__icon.is-cube { display: block; width: 29px; height: 32px; object-fit: contain; }
.nsg-panel-heading em { display: flex; align-items: center; gap: 8px; padding: 12px 16px; white-space: nowrap; text-transform: uppercase; }
.nsg-gradient-button .nsg-ui-icon { margin-left: 10px; font-size: 20px; }
.nsg-history-state button, .nsg-history-state em { display: inline-flex; align-items: center; gap: 5px; font: 500 12px/1.3 "DM Sans", Arial, sans-serif; }
.nsg-history-state .is-pending { background: #30374c; border-color: #41485c; color: #b2b6cb; }
.nsg-history-state .is-processing { background: #33125b; border-color: #501783; color: #b897de; }
.nsg-history-state .is-completed { background: #0e3439; border-color: #26665e; color: #59ccab; }
.nsg-order-history__header > strong { display: flex; align-items: center; gap: 8px; text-transform: uppercase; }
.nsg-order-history__header > strong .nsg-ui-icon { color: #7063f6; font-size: 20px; }
.nsg-order-history__list article { grid-template-columns: 64px 1.35fr .85fr .85fr .9fr 1.2fr; column-gap: 20px; }
.nsg-history-product strong { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; overflow-wrap: anywhere; font-weight: 600; line-height: 1.4; }
.nsg-start-work--desktop .nsg-progress { grid-template-columns: 1fr auto; }
.nsg-start-work--desktop .nsg-progress > span { grid-column: 1 / -1; }
.nsg-start-work--desktop .nsg-progress > i { grid-column: 1; grid-row: 2; align-self: center; }
.nsg-start-work--desktop .nsg-progress > b { grid-column: 2; grid-row: 2; }
.nsg-start-work--desktop .nsg-balance-card { min-height: 112px; }
.nsg-start-work--desktop .nsg-match-stats > div { min-height: 76px; }
.nsg-start-work--desktop .nsg-order-match { display: flex; flex-direction: column; }
.nsg-start-work--desktop .nsg-order-match .nsg-gradient-button { margin-top: auto; min-height: 54px; text-transform: uppercase; }
@media (max-width: 1023px) {
  .nsg-start-work--mobile .nsg-panel-heading { align-items: center; }
  .nsg-start-work--mobile .nsg-product-pool h2 { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; overflow-wrap: anywhere; }
  .nsg-start-work--mobile .nsg-history-state button, .nsg-start-work--mobile .nsg-history-state em { flex-direction: row-reverse; border-radius: 5px; padding: 4px 7px; font-size: 11px; }
  .nsg-start-work--mobile .nsg-history-state .is-pending { background: #301c0c; border-color: #784b08; color: #f2a600; }
  .nsg-start-work--mobile .nsg-history-state .is-processing { background: #171b40; border-color: #323877; color: #19bded; }
  .nsg-start-work--mobile .nsg-history-state .is-completed { background: #082c2b; border-color: #075043; color: #18c5a0; }
  .nsg-start-work--mobile .nsg-order-history__header { gap: 8px; }
  .nsg-start-work--mobile .nsg-order-history__header button { padding: 0 9px; }
}
</style>
<style>
.nsg-order-history__list .nsg-history-cover { width: 64px; height: 64px; flex-shrink: 0; border-radius: 6px; overflow: hidden; }
.nsg-history-cover img { width: 100%; height: 100%; object-fit: contain; }
@media (max-width: 1023px) { .nsg-order-history__list .nsg-history-cover { width: 58px; height: 58px; } }
</style>
