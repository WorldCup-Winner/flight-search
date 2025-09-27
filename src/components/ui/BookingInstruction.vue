<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 top-0 bg-black/20 w-[100vw] h-[100vh] flex items-center justify-center">
    <div class="max-w-[800px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-8 py-8">
        <!-- Close button -->
        <button
            class="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
            @click="close"
            >
            ✕
        </button>
        <!-- Title -->
        <h3 class="text-h3 md:text-h3-d font-light text-primary-gold">訂購須知</h3>
        <p class="mb-6 text-right text-sm text-text-error">
            以下內容請務必詳細閱讀，另列條件
        </p>

      <!-- Content -->
      <div class="space-y-6 h-[700px] overflow-y-scroll text-sm leading-relaxed text-gray-700
                    [&::-webkit-scrollbar]:w-[4px]
                    [&::-webkit-scrollbar-track]:transparent
                    [&::-webkit-scrollbar-thumb]:bg-others-gray8
                    [&::-webkit-scrollbar-thumb]:rounded-[10px]
                    dark:[&::-webkit-scrollbar-track]:transparent
                    dark:[&::-webkit-scrollbar-thumb]:bg-others-gray8
                    dark:[&::-webkit-scrollbar-thumb]:rounded-[10px]">
        <section>
          <h3 class="mb-2 font-semibold text-others-original">機票購買注意事項</h3>
          <ul class="list-disc space-y-2 text-others-gray1 pl-5">
            <li>
              加利利旅行社機票網（下稱本網站）銷售之機票由加利利旅行社合作航空公司及海外供應商提供（海外供應商提供之機票，會於搜尋結果中顯示「由海外供應商提供」），所有機票皆享有相同的客戶服務。
            </li>
            <li>
              本網站所顯示之票價已包含 機場稅費與燃油附加費。
            </li>
            <li>
              各票價之 訂位艙等（如 L 艙、K 艙...等）、票價規定 與 開票期限 可能有所差異，請務必展開「航班資訊」及「票價資訊與行李規定」，詳閱確認均符合需求後再行預訂。
            </li>
            <li>
              票價及機位隨時可能變動，如訂購流程中若發生異動，系統會跳出提示，您可選擇接受新價格或重新搜尋。
            </li>
            <li>
              旅客於飛航過程中任何個人消費，或旅客與航空公司另行達成之其他協議（包括但不限於旅客現場加價升等商務艙），相關費用及責任均由旅客自行承擔，因此產生之爭議亦由旅客自行與航空公司協商，概與本網站或加利利旅行社無涉。
            </li>
          </ul>
        </section>

        <section>
          <h3 class="mb-2 font-semibold text-others-original">付款與訂位說明</h3>
          <ul class="list-disc space-y-2 text-others-gray1 pl-5">
            <li>
              訂單送出並完成付款後，如要取消將產生費用。請您在送出訂單前，務必再次確認 「航班資訊」 與 「票價資訊及行李規定」是否符合需求。確認訂購後，機位與票價將為您保留30分鐘，請在時間內以信用卡完成線上付款：
            </li>
            <li>機位預訂成功：信用卡將直接扣款，系統會自動寄送付款成功確認函至訂單主要聯絡人之E-mail。</li>
            <li>機位預訂失敗：系統將向發卡銀行辦理解除授權（約 3～7 個工作天，實際天數依各發卡銀行規定而訂）。</li>
            <li>開票確認時間：付款完成後，本網站將於1個工作天內為您完成開票並寄送開票成功確認函及 電子機票行程 至訂單主要聯絡人的 E-mail。</li>
            <li>多人同行注意事項：如同筆訂單中有多名旅客，訂單將於所有旅客皆於期限內完成付款後成立，本網站將於訂單成立後進行開票。</li>
            <li>禁止重複訂位：若同一名旅客重複預訂相同或相近日期的行程，本網站配合之全球訂位系統或航空公司有權取消所有機位，如機位因此遭取消，旅客應自負所有相關責任。</li>
            <li>姓名須與護照一致：旅客英文姓名拼音必須與護照完全相符，任何字母差異皆可能導致無法訂位或機票無法使用。</li>
            <li>嬰兒訂位受航空公司規定及航班乘載數量限制，須由航空公司評估，為保障旅客權益，本網站暫不提供嬰兒訂位，如有相關需求，請直接聯繫本網站客服信箱fit@galilee-tour.com，由專人依您的需求提供服務。</li>
          </ul>
        </section>

        <section>
          <h3 class="mb-2 font-semibold text-others-original">重要聲明</h3>
          <ul class="list-disc space-y-2 text-others-gray1 pl-5">
            <li>
              旅行證件資料：部分行程於訂購時須填寫國籍、證件類型（護照/台胞證等）、證件號碼及效期，並輸入至訂位記錄供航空公司查核，請務必正確填寫，以免影響行程。
            </li>
            <li>
              未成年人單獨旅行：
              <ul class="list-disc space-y-2 text-others-gray1 pl-5">
                <li>所有行程皆至少須有一位年滿 18 歲之成人同行。</li>
                <li>若該筆訂單中所有旅客均未滿 18 歲且包含有 12 歲以下孩童，恕無法線上下單，請洽本網站客服查詢航空公司規定。</li>
                <li>若該筆訂單所有旅客均為 12–17 歲，因各航空公司規定不同，請務必先行確認。若未依規定辦理而無法成行或產生損失，將由旅客自行承擔。</li>
              </ul>
            </li>
            <li>
              No Show 規定：<br />
              如因個人因素無法如期搭機，請依航空公司規定於 起飛前 24–72 小時 完成取消或更改。若產生 No Show 紀錄（未搭乘且未如期取消或更改航班），後續改期或退票須依航空公司相關規範辦理，嚴重者機票將視為無效。
            </li>
            <li>
              退票規定：
              <ul class="list-disc space-y-2 text-others-gray1 pl-5">
                <li>所有機票之退票規定皆依各家航空公司規定為準。</li>
                <li>一般機票開票日起一年內可申辦退票；部分航空公司（例：中國民航）須於使用期限內完成，逾期不可退。</li>
                <li>退票可能產生相關費用，包括但不限於：航空公司收費 、本網站服務費、 供應商服務費、已加購行李費用等。</li>
                <li>退票申請送交航空公司審核後，作業期約 1–2 個月；特殊情況或海外供應商出票者，可能需 2–6 個月。</li>
                <li>部分航空公司可能以 代金券 替代退款，並限於原航空公司行程使用，實際規範依各航空公司公告為準。</li>
              </ul>
            </li>
            <li>
              出入境與登機：
              <ul class="list-disc space-y-2 text-others-gray1 pl-5">
                <li>國際航線：請攜帶電子機票、有效護照與簽證，並於起飛前 2–3 小時 抵達機場。護照須有至少 6 個月效期。若行程含轉機，請先確認是否需辦理入/過境簽證。</li>
                <li>特殊身分旅客（如役男、軍人）請自行確認是否須另辦出入境許可。</li>
              </ul>
            </li>
            <li>
              航班異動：<br />
              航空公司得因天候等因素調整或取消航班，旅客應於出發前隨時確認航班動態。<br />
              <ul class="list-disc space-y-2 text-others-gray1 pl-5">
                <li>航空公司或海外供應商通知航班異動時，可能透過本網站或由航空公司直接發送簡訊/電子郵件。請務必留意收件匣及垃圾郵件匣，並將寄件人加入通訊錄，以免錯過重要訊息。</li>
                <li>當您收到異動或取消通知時，請立即聯繫加利利旅行社，以便即時協助辦理改/退票事宜（如您未主動聯繫，可能無法即時提供服務）。</li>
              </ul>
            </li>
            <li>
              運送契約：<br />
              自機票開立起，旅客即與航空公司成立運送契約。若因違反航空公司規定導致行程受阻或產生損失，責任由旅客自行承擔。
            </li>
          </ul>
        </section>

        <section>
          <h3 class="mb-2 font-semibold text-others-original">其他注意事項</h3>
          <ul class="list-disc space-y-2 text-others-gray1 pl-5">
            <li>
              行程順序使用：機票須依序使用，若前段未搭乘，後段航程將自動失效。請先與航空公司確認相關規定；如因未依規定使用而產生損失，均由旅客自行負責。
            </li>
            <li>
              改票申請：機票開立後如需更改，請於工作日聯繫本網站客服提出申請，改票將依航空公司、供應商及本公司之規定收取相關手續費。
            </li>
            <li>
              海外更改：旅客若在國外需改票，請先確認票價規則是否允許更改，並留意是否需支付額外費用，更改申請須於 48 小時工作日前 提出；未依規定致損失，旅客須自行承擔。
            </li>
            <li>
              行李、選位與餐食：特惠票價未必包含免費行李、選位或餐食，可於付款後至航空公司官網加購。 若訂購時提供「加購行李」選項，請立即完成加購；若未加購或系統無此選項，部分票種出票後將無法再加購，只能於機場現場自費。
            </li>
            <li>
              選位服務：部分航空公司授權本網站透過全球訂位系統提供免費選位，但並非所有票價皆適用（依系統實際顯示為準）；聯營航班、多數廉航及海外供應商出票的機票，通常無法線上選位。
            </li>
            <li>
              個資處理：為完成訂單，本網站將依需求提供旅客必要資料予合作業者（如航空公司、OTA 平台、飯店等），並遵循個資法規範處理。詳情請參考《隱私權保護政策》及《個資聲明》。
            </li>
          </ul>
        </section>

        <section>
          <h3 class="mb-2 font-semibold text-others-original">旅行業代收轉付收據</h3>
          <ul class="list-disc space-y-2 text-others-gray1 pl-5">
            <li>
              本公司依財政部台財稅第 10504544630 號函，統一開立 「旅行業代收轉付電子收據」。
            </li>
            <li>
              付款完成後，系統會寄送 電子收據開立通知信 至訂單主要聯絡人的 Email，您可透過信件內連結至「代收轉付電子收據加值服務平台」查看明細並列印（限一次）。
            </li>
            <li>
              如未收到通知信，需報帳使用時，可於「訂單管理」登入後，於訂單進行列印。
            </li>
            <li>
              若行程取消或更動需退款，經您同意，本公司將直接為您辦理電子收據的 銷貨退回或折讓證明單，以加速退款作業。
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

function close() {
  emit("close");
}
</script>