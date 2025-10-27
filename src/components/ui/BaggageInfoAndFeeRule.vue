<template>
    <div
        v-if="open"
        class="fixed inset-0 z-50 top-0 w-[100vw] h-[100vh] flex items-center justify-center">
        <div
            class="fixed inset-0 top-0 bg-black/20 w-[100vw] h-[100vh]"
            @click="close"></div>
        <div class="max-w-[800px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-8 py-8 ">
            <h3 class="mb-2 text-h3 text-others-gray1 md:text-h3-d font-light">行李資訊及票價規定</h3>
            <p class="mb-6 text-sm text-others-gray1 leading-relaxed">
                請確認您的機票依序使用，若第一段航程未搭乘，後續航程將自動失效。若您的行程包含多張不同機票或由不同航空公司承運，任一機票的變更或取消不影響其他機票行程，您仍須依原票規使用。
            </p>
            <div class="h-[700px] overflow-y-scroll text-sm leading-relaxed text-gray-700
                    [&::-webkit-scrollbar]:w-[4px]
                    [&::-webkit-scrollbar-track]:transparent
                    [&::-webkit-scrollbar-thumb]:bg-others-gray8
                    [&::-webkit-scrollbar-thumb]:rounded-[10px]
                    dark:[&::-webkit-scrollbar-track]:transparent
                    dark:[&::-webkit-scrollbar-thumb]:bg-others-gray8
                    dark:[&::-webkit-scrollbar-thumb]:rounded-[10px]">
                <h3 class="mb-4 text-lg font-bold text-others-original">行李資訊</h3>
                
                <div v-if="!fareRuleData?.baggage || fareRuleData.baggage.length === 0" class="text-others-gray1 mb-4 p-4 bg-tb-body rounded-[10px]">
                    <p>暫無行李資訊</p>
                </div>
                <div v-else v-for="(segment, segIdx) in fareRuleData.baggage" :key="`baggage-${segIdx}`" class="text-others-gray1 mb-4">
                    <div class="rounded-t-[10px] bg-tb-header text-[17px] p-4">
                        <p class="font-semibold text-black">{{ segment.departureCityName }} - {{ segment.arrivalCityName }}</p>
                    </div>
                    <div v-if="!segment.passengers || segment.passengers.length === 0">
                        <div class="grid grid-cols-12 w-full items-center bg-tb-body py-3">
                            <p class="col-span-12 text-center">此航段無特定乘客行李資訊</p>
                        </div>
                    </div>
                    <div v-else v-for="(passenger, pIdx) in segment.passengers" :key="pIdx">
                        <div class="grid grid-cols-12 w-full items-center bg-tb-body py-3">
                            <p class="col-span-12 md:col-span-2 text-center font-bold">{{ getPassengerDisplay(passenger.passengerType) }}</p>
                            <div class="col-span-12 md:col-span-10">
                                <p>託運行李：{{ formatBaggage(passenger.checkInData) }}</p>
                                <p>手提行李：{{ formatBaggage(passenger.carryOnData) }}</p>
                            </div>
                        </div>
                        <div v-if="pIdx < segment.passengers.length - 1" class="w-full h-[1px] bg-others-gray3"></div>
                    </div>
                </div>

                <h3 class="text-lg font-bold text-others-original">票價規定</h3>
                <p class="mb-4 text-sm text-others-gray1">
                    如需退票，航空公司將以代金券方式退給您，僅可訂購原航空公司之行程，使用方式依航空公司為準。
                </p>
                <div v-if="!fareRuleData?.fareRuleTable || fareRuleData.fareRuleTable.length === 0" class="text-others-gray1 mb-4 p-4 bg-tb-body rounded-[10px]">
                    <p>暫無票價規定資訊</p>
                </div>
                <div v-else class="text-others-gray1 mb-4">
                    <div class="flex flex-row items-center rounded-t-[10px] space-x-4 bg-tb-header text-[17px] p-3">
                        <div v-for="(segment, segIdx) in fareSegments" :key="`tab-${segIdx}`"
                            class="px-6 py-1 rounded-[10px] border-2 font-bold cursor-pointer"
                            :class="[ activeSegmentIndex === segIdx ? 'border-others-original bg-others-original text-white' : 'border-others-original bg-none text-others-original']"
                            @click="activeSegmentIndex = segIdx">
                            <p>{{ segment.departureCityName }} - {{ segment.arrivalCityName }}</p>
                        </div>
                    </div>
                    <div class="panel bg-tb-body">
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
                                            <th v-if="ruleIdx === 0" :rowspan="group.length * 2" scope="rowgroup" class="p-4 text-center">
                                                {{ groupName }}
                                            </th>
                                            <th scope="row" class="p-4">起飛前</th>
                                            <td class="p-4">{{ getPassengerDisplay(rule.passengerType) }}</td>
                                            <td class="p-4">
                                                <span :class="{ 'text-others-original font-semibold': rule.before > 0, 'text-green-600': rule.before === 0 }">
                                                    {{ formatPriceOnFareRule(rule.before, rule.currency) }}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr class="border-t border-gray-200">
                                            <th scope="row" class="p-4">起飛後</th>
                                            <td class="p-4">{{ getPassengerDisplay(rule.passengerType) }}</td>
                                            <td class="p-4">
                                                <span :class="{ 'text-others-original font-semibold': rule.after > 0, 'text-green-600': rule.after === 0 }">
                                                    {{ formatPriceOnFareRule(rule.after, rule.currency) }}
                                                </span>
                                            </td>
                                        </tr>
                                    </template>
                                </template>

                                <tr class="border-t border-gray-200">
                                    <th scope="row" class="p-4">退改說明</th>
                                    <td colspan="3" class="p-4">
                                        <ol class="list-decimal pl-5 space-y-1">
                                        <li>改期：如更改後的票價及稅費較高，須另補足差額。</li>
                                        </ol>
                                    </td>
                                </tr>
                                <tr class="border-t border-gray-200">
                                    <th scope="row" class="p-4">服務費</th>
                                    <td colspan="3" class="p-4">
                                        <ol class="list-decimal pl-5 space-y-1">
                                        <li>改期：加利利服務費 TWD500 元。</li>
                                        </ol>
                                    </td>
                                </tr>
                                <tr class="border-t border-b border-gray-200">
                                    <th scope="row" class="p-4">備註</th>
                                    <td colspan="3" class="p-4">
                                        <ol class="list-decimal pl-5 space-y-1">
                                            <li>若未提前 24～72 小時取消機位，也未如期搭乘，辦理退改時將依各航空公司規定額外收取未登機費。</li>
                                            <li>購票作業費用為：退改費用 + 價差 + 服務費，每人每次計算。</li>
                                            <li>航司訂位費含於稅費內，退票不退還。各航司費用不同，每張票約 USD25～USD40 不等。</li>
                                            <li>請依上述退改期限至少提前 2 天（不含假日）申請，以免作業來不及而導致無法退／改。</li>
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
</template>

<script lang="ts" setup>
import { formatBaggage, formatPriceOnFareRule, getPassengerDisplay } from "@/utils";
import type { FareRuleResponse } from "@/utils/types";
import { ref, defineProps, defineEmits, computed } from "vue";

const props = defineProps<{
    open?: boolean;
    fareRuleData: FareRuleResponse['data'] | null
}>();

const departureOrarrival = ref(true)

const emit = defineEmits<{
  (e: "close"): void;
}>();

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
        if (rule.type.includes('退票')) groupKey = '退票費用';

        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(rule);
    }
    return groups;
});
</script>
