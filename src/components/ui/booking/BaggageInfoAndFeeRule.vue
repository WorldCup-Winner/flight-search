<template>
  <Teleport to="body">
    <transition name="fade-scale">
      <div
        v-if="open"
        class="fixed inset-0 z-[120] bg-black/40 md:bg-black/20 flex items-stretch md:items-center justify-center p-0 md:px-4 overflow-hidden"
        @click.self="close"
      >
        <div class="flex flex-col w-full h-full md:h-auto md:max-h-[90vh] md:max-w-[800px] bg-white md:rounded-[10px] overflow-hidden shadow-2xl">
          <!-- Header (mobile full-screen like DatePicker) -->
          <div class="bg-primary-gold text-white px-4 md:px-8 py-3 text-[18px] font-semibold flex items-center justify-between flex-shrink-0">
            <span>行李資訊及票價規定</span>
            <button class="text-white hover:opacity-80 transition" @click="close" aria-label="關閉">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

            <!-- Content -->
            <div
             class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 md:px-8 py-4 md:py-6 text-sm leading-relaxed text-gray-700
                   [&::-webkit-scrollbar]:w-[4px]
                   [&::-webkit-scrollbar-track]:transparent
                   [&::-webkit-scrollbar-thumb]:bg-others-gray8
                   [&::-webkit-scrollbar-thumb]:rounded-[10px]
                   dark:[&::-webkit-scrollbar-track]:transparent
                   dark:[&::-webkit-scrollbar-thumb]:bg-others-gray8
                   dark:[&::-webkit-scrollbar-thumb]:rounded-[10px]"
          >
            <p class="mb-4 md:mb-6 text-sm text-others-gray1 leading-relaxed">
              機票須依序使用，若第一段未搭乘，後段航程將自動失效。若您的行程包含多張不同機票或由不同航空公司承運，任一機票的變更或取消不影響其他機票行程，您仍須依原票規使用。
            </p>
            <h3 class="mb-4 text-lg font-bold text-others-original">行李資訊</h3>
            <div v-if="!fareRuleData?.baggage || fareRuleData.baggage.length === 0" class="text-others-gray1 mb-4 p-4 bg-tb-body rounded-[10px]">
              <p>暫無行李資訊</p>
            </div>
            <div v-else v-for="(segment, segIdx) in fareRuleData.baggage" :key="`baggage-${segIdx}`" class="text-others-gray1 mb-4">
              <div class="overflow-hidden rounded-[10px] border border-others-gray8">
                <div class="bg-tb-header px-4 py-3 font-semibold text-others-gray1">
                  {{ segment.departureCityName }} - {{ segment.arrivalCityName }}
                </div>

                <div class="bg-tb-body px-4 py-3">
                  <template v-if="!segment.passengers || segment.passengers.length === 0">
                    <div class="py-2 text-center">此航段無特定乘客行李資訊</div>
                  </template>

                  <template v-else>
                    <div v-for="(passenger, pIdx) in segment.passengers" :key="pIdx" class="py-2">
                      <div class="flex flex-row gap-3 items-start md:grid md:grid-cols-12 md:items-center">
                        <p class="w-[64px] shrink-0 text-center font-bold md:w-auto md:col-span-2 md:text-center">
                          {{ getPassengerDisplay(passenger.passengerType) }}
                        </p>
                        <div class="flex-1 md:col-span-10 space-y-1">
                          <p>託運行李：{{ formatBaggage(passenger.checkInData) }}</p>
                          <p>手提行李：{{ formatBaggage(passenger.carryOnData) }}</p>
                        </div>
                      </div>
                      <div v-if="pIdx < segment.passengers.length - 1" class="mt-3 w-full h-[1px] bg-others-gray3"></div>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <!-- Fare Rules -->
            <h3 class="text-lg font-bold text-others-original">票價規定</h3>
            <p class="mb-4 text-sm text-others-gray1">
              如需退票，航空公司將以現金/代金券方式退給您，代金券僅可訂購原航空公司之行程，退票方式依航空公司為準。
            </p>
            <div v-if="!fareRuleData?.fareRuleTable || fareRuleData.fareRuleTable.length === 0" class="text-others-gray1 mb-4 p-4 bg-tb-body rounded-[10px]">
              <p>暫無票價規定資訊</p>
            </div>
            <div v-else class="text-others-gray1 mb-4">
              <div class="flex flex-row items-center gap-2 overflow-x-auto rounded-t-[10px] bg-tb-header p-3">
                <div
                  v-for="(segment, segIdx) in fareSegments"
                  :key="`tab-${segIdx}`"
                  class="px-4 py-1.5 rounded-[10px] border-2 font-bold cursor-pointer whitespace-nowrap text-xs md:text-[17px]"
                  :class="[ activeSegmentIndex === segIdx ? 'border-others-original bg-others-original text-white' : 'border-others-original bg-none text-others-original']"
                  @click="activeSegmentIndex = segIdx"
                >
                  {{ segment.departureCityName }} - {{ segment.arrivalCityName }}
                </div>
              </div>

              <div
                class="panel bg-tb-body overflow-x-hidden md:overflow-x-auto
                       [&_li]:break-words [&_li]:whitespace-normal"
              >
                <table class="w-full border-collapse">
                  <colgroup>
                    <col class="w-[18%]" />
                    <col class="w-[18%]" />
                    <col class="w-[14%]" />
                    <col />
                  </colgroup>
                  <tbody>
                    <template v-for="(group, groupName) in groupedFareRules" :key="groupName">
                      <template v-for="(rule, ruleIdx) in group" :key="ruleIdx">
                        <tr class="border-t border-gray-200">
                          <th v-if="ruleIdx === 0" :rowspan="group.length * 2" scope="rowgroup" class="p-4 text-center whitespace-nowrap align-top">
                            {{ groupName }}
                          </th>
                          <th scope="row" class="p-4 whitespace-nowrap">起飛前</th>
                          <td class="p-4 whitespace-nowrap">{{ getPassengerDisplay(rule.passengerType) }}</td>
                          <td class="p-4">
                            <span :class="{ 'text-others-original font-semibold': rule.before > 0, 'text-green-600': rule.before === 0 }">
                              {{ formatPrice(rule.before, rule.currency) }}
                            </span>
                          </td>
                        </tr>
                        <tr class="border-t border-gray-200">
                          <th scope="row" class="p-4 whitespace-nowrap">起飛後</th>
                          <td class="p-4 whitespace-nowrap">{{ getPassengerDisplay(rule.passengerType) }}</td>
                          <td class="p-4">
                            <span :class="{ 'text-others-original font-semibold': rule.after > 0, 'text-green-600': rule.after === 0 }">
                              {{ formatPrice(rule.after, rule.currency) }}
                            </span>
                          </td>
                        </tr>
                      </template>
                    </template>

                    <tr class="border-t border-gray-200">
                      <th scope="row" class="p-4">退改票說明</th>
                      <td colspan="3" class="p-4">
                        <ul class="list-disc pl-5 space-y-1">
                          <li>退票：依起飛前後之規定，按系統計算之退票費用收費，若機票已部分使用，需扣除已使用航段的價格/稅金，通常已部分使用的機票無退票價值。</li>
                          <li>改期：依起飛前後之規定，按系統計算之改票費用收費，若更改後票價及稅費較高，須另外補足差額。</li>
                          <li>退改票實際費用包含：航空公司之退改手續費＋票價/稅金差額＋加利利旅遊服務費，按每人每次計算。</li>
                        </ul>
                      </td>
                    </tr>
                    <tr class="border-t border-gray-200">
                      <th scope="row" class="p-4">服務費項目</th>
                      <td colspan="3" class="p-4">
                        <ul class="list-disc pl-5 space-y-1">
                          <li>退票：加利利旅遊服務費 {{ formatPrice(serviceFeeRefund, 'TWD') }} 元。</li>
                          <li>改期：加利利旅遊服務費 {{ formatPrice(serviceFeeChangePeriod, 'TWD') }} 元。</li>
                          <li>若非自營票而產生供應商服務費，則依服務人員提供之退/改票服務費金額為準。</li>
                        </ul>
                      </td>
                    </tr>
                    <tr class="border-t border-b border-gray-200">
                      <th scope="row" class="p-4">備註</th>
                      <td colspan="3" class="p-4">
                        <ol class="list-decimal pl-5 space-y-1">
                          <li>若未在出發前 24～72 小時內取消機位，且當日未搭乘，辦理退票或改票時，將依航空公司規定加收「未登機費」，需結清費用後才能辦理退款。</li>
                          <li>航空公司訂位費已含於稅金內，各航空公司收費標準不同，退票時不退還。</li>
                          <li>請務必於規定退改期限前至少 2 個工作天（不含假日）提出申請，避免因時間不足導致無法辦理退票或改票。</li>
                        </ol>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import type { FareRuleResponse } from '@/utils/types';

const props = defineProps<{
  open?: boolean;
  fareRuleData?: FareRuleResponse['data'];
}>();

const emit = defineEmits<{ (e: "close"): void }>();

function close() {
  emit("close");
}

// --- State ---
const activeSegmentIndex = ref(0);

// --- Computed Properties ---

const fareSegments = computed(() => {
  if (!props.fareRuleData?.baggage) return [];
  return props.fareRuleData.baggage.map(seg => ({
    departureCityName: seg.departureCityName,
    arrivalCityName: seg.arrivalCityName,
  }));
});

const activeFareRules = computed(() => {
    if (!props.fareRuleData?.fareRuleTable) return [];
    const segmentKeyword = activeSegmentIndex.value === 0 ? '去程' : '回程';
    const isMultiSegment = fareSegments.value.length > 1;

    return props.fareRuleData.fareRuleTable.filter(rule => {
        const type = rule.type || '';
        // For single segment, show all rules
        if (!isMultiSegment) return true;
        
        // For multi-segment, filter by keyword
        if (type.includes(segmentKeyword)) return true;
        
        // Always include general rules like '退票費用'
        if (!type.includes('去程') && !type.includes('回程')) return true;
        
        return false;
    });
});

const groupedFareRules = computed(() => {
    const groups: Record<string, any[]> = {};
    for (const rule of activeFareRules.value) {
        let groupKey = rule.type;
        if (rule.type.includes('改期')) groupKey = '改期費用';
        if (rule.type.includes('退票費')) groupKey = '退票費用';

        if (groupKey === '服務費') continue;

        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(rule);
    }
    return groups;
});

const serviceFeeChangePeriod = computed(() => {
    const serviceRule = activeFareRules.value.find(rule => rule.type === '服務費' && rule.passengerType === 'ADT');
    return serviceRule ? serviceRule.before : 500;
});

const serviceFeeRefund = computed(() => {
    const refundRule = activeFareRules.value.find(rule => rule.type === '退票服務費' && rule.passengerType === 'ADT');
    return refundRule ? refundRule.before : 800;
});

// --- Helper Functions ---

function formatBaggage(data: { text: string; piece: number; weight: number } | null): string {
  if (!data) return '資訊待確認';
  if (data.text) return data.text;
  if (data.piece > 0 && data.weight > 0) return `${data.piece}件, 每件${data.weight}公斤`;
  if (data.piece > 0) return `${data.piece}件`;
  if (data.weight > 0) return `${data.weight}公斤`;
  return '無免費行李';
}

function getPassengerDisplay(type: string): string {
  const displays: Record<string, string> = {
    'ADT': '成人票',
    'CNN': '孩童票',
    'CHD': '孩童票',
    'INF': '嬰兒票'
  };
  return displays[type] || type;
}

function formatPrice(price: number | null, currency: string = 'TWD'): string {
  if (price === null) return '不可適用';
  if (price === -1) return '不可退改';
  if (price === 0) return '免費';
  return `${currency} ${price.toLocaleString()}`;
}
</script>
