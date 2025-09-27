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

                <div class="text-others-gray1 mb-4">
                    <div class="rounded-t-[10px] bg-tb-header text-[17px] p-4">
                        <h4 class="mb-2 font-semibold text-black">台北 - 東京</h4>
                        <p class="text-sm">行李尺寸詳情請與航空公司確認。</p>
                    </div>
                    <div class="grid grid-cols-12 w-full items-center bg-tb-body py-3">
                        <p class="col-span-12 md:col-span-2 text-center font-bold">成人票</p>
                        <div class="col-span-12 md:col-span-10">
                            <p>託運行李：無免費託運行李。</p>
                            <p>手提行李：每人1件，每件10公斤，長寬高不可超過54*38*23公分。</p>
                        </div>
                    </div>
                    <div class="w-full h-[1px] bg-others-gray3"></div>
                    <div class="grid grid-cols-12 w-full rounded-b-[10px] items-center bg-tb-body py-3">
                        <p class="col-span-12 md:col-span-2 text-center font-bold">孩童票</p>
                        <div class="col-span-12 md:col-span-10">
                            <p>託運行李：無免費託運行李。</p>
                            <p>手提行李：每人1件，每件10公斤，長寬高不可超過54*38*23公分。</p>
                        </div>
                    </div>
                </div>

                <div class="text-others-gray1 mb-4">
                    <div class="rounded-t-[10px] bg-tb-header text-[17px] p-4">
                        <h4 class="mb-2 font-semibold text-black">東京 - 台北</h4>
                        <p class="text-sm">行李尺寸詳情請與航空公司確認。</p>
                    </div>
                    <div class="grid grid-cols-12 w-full items-center bg-tb-body py-3">
                        <p class="col-span-12 md:col-span-2 text-center font-bold">成人票</p>
                        <div class="col-span-12 md:col-span-10">
                            <p>託運行李：無免費託運行李。</p>
                            <p>手提行李：每人1件，每件10公斤，長寬高不可超過54*38*23公分。</p>
                        </div>
                    </div>
                    <div class="w-full h-[1px] bg-others-gray3"></div>
                    <div class="grid grid-cols-12 w-full rounded-b-[10px] items-center bg-tb-body py-3">
                        <p class="col-span-12 md:col-span-2 text-center font-bold">孩童票</p>
                        <div class="col-span-12 md:col-span-10">
                            <p>託運行李：無免費託運行李。</p>
                            <p>手提行李：每人1件，每件10公斤，長寬高不可超過54*38*23公分。</p>
                        </div>
                    </div>
                </div>

                <h3 class="text-lg font-bold text-others-original">行李資訊</h3>
                <p class="mb-4 text-sm text-others-gray1">
                    如需退票，航空公司將以代金券方式退給您，僅可訂購原航空公司之行程，使用方式依航空公司為準。
                </p>

                <div class="text-others-gray1 mb-4">
                    <div class="rounded-t-[10px] space-x-4 bg-tb-header text-[17px] p-3">
                        <button class="px-6 py-1 rounded-[10px] border-2 font-bold"
                                :class="[departureOrarrival ? 'border-others-original bg-others-original text-white' : 'border-others-original bg-none text-others-original']"
                                @click="departureOrarrival = true">台北 - 東京</button>
                        <button class="px-6 py-1 rounded-[10px] border-2 font-bold"
                                :class="[!departureOrarrival ? 'border-others-original bg-others-original text-white' : 'border-others-original bg-none text-others-original']"
                                @click="departureOrarrival = false">東京 - 台北</button>
                    </div>
                    <section v-if="departureOrarrival" class="panel bg-tb-body">
                        <table class="w-full border-collapse">
                        <colgroup>
                            <col class="w-[18%]" />
                            <col class="w-[18%]" />
                            <col class="w-[14%]" />
                            <col />
                        </colgroup>
                        <tbody>
                            <tr class="border-t border-gray-200">
                                <th scope="rowgroup" rowspan="2" class="p-4 text-center">退票費用</th>
                                <th scope="row" class="p-4">起飛前</th>
                                <td class="p-4">成人</td>
                                <td class="p-4"><span class="text-others-original">不可退票及退稅</span></td>
                            </tr>
                            <tr class="border-t border-gray-200">
                                <th scope="row" class="p-4">起飛後</th>
                                <td class="p-4">成人</td>
                                <td class="p-4"><span class="text-others-original">不可退票及退稅</span></td>
                            </tr>

                            <tr class="border-t border-gray-200">
                                <th scope="rowgroup" rowspan="2" class="p-4">改期費用</th>
                                <th scope="row" class="p-4">起飛前</th>
                                <td class="p-4">成人</td>
                                <td class="p-4">可改期，罰金另詢</td>
                            </tr>
                            <tr class="border-t border-gray-200">
                                <th scope="row" class="p-4t">起飛後</th>
                                <td class="p-4">成人</td>
                                <td class="p-4"><span class="text-others-original font-semibold">不可改期</span></td>
                            </tr>

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
                    </section>
                    <section v-else class="panel bg-tb-body">
                        <table class="w-full border-collapse">
                        <colgroup>
                            <col class="w-[18%]" />
                            <col />
                        </colgroup>
                        <tbody>
                            <tr class="border-t border-gray-200">
                                <th scope="row" class="p-4">退改說明</th>
                                <td colspan="2" class="p-4">
                                    <ol class="list-decimal pl-5 space-y-1">
                                        <li>退票：依起飛前後之規定，按系統計算之退票費用收費，若機票已部分使用，需扣除已使用航段的價格/稅金，通常已部分使用的機票無退票價值。</li>
                                        <li>改期：依起飛前後之規定，按系統計算之改票費用收費，若更改後票價及稅費較高，須另外補足差額。</li>
                                    </ol>
                                </td>
                            </tr>

                            <tr class="border-t border-gray-200">
                                <th scope="row" class="p-4">服務費</th>
                                <td colspan="3" class="p-4">
                                    <ol class="list-decimal pl-5 space-y-1">
                                        <li>退票：加利利旅遊服務費 TWD 800 元。</li>
                                        <li>改期：加利利旅遊服務費 TWD 500 元。</li>
                                        <li>若非自營票而產生供應商服務費，則依服務人員提供之退/改票服務費金額為準。</li>
                                    </ol>
                                </td>
                            </tr>

                            <tr class="border-t border-b border-gray-200">
                                <th scope="row" class="p-4">備註</th>
                                <td colspan="3" class="p-4">
                                    <ol class="list-decimal pl-5 space-y-1">
                                        <li>若未在出發前 24～72 小時內取消機位，且當日未搭乘，辦理退票或改票時，將依航空公司規定加收「未登機費」，需結清費用後才能辦理退款。</li>
                                        <li>退改實際費用包含：航空公司之退改手續費＋票價/稅金差額＋服務費，按每人每次計算。</li>
                                        <li>航空公司訂位費已含於稅金內，各航空公司收費標準不同，退票時不退還。</li>
                                        <li>請務必於規定退改期限前至少 2 個工作天（不含假日）提出申請，避免因時間不足導致無法辦理退票或改票。</li>
                                    </ol>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps<{
  open: boolean;
}>();

const departureOrarrival = ref(true)

const emit = defineEmits<{
  (e: "close"): void;
}>();

function close() {
  emit("close");
}
</script>
