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
        <!-- 商品價格 -->
        <section>
          <h3 class="mb-2 font-semibold text-others-original">商品價格</h3>
          <ul class="list-disc space-y-2 text-others-gray1 pl-5">
            <li>
              易遊網機票價格皆已包含機場稅費及燃油附加費。
            </li>
            <li>
              部分票價商品由易遊網合作的海外供應商提供，您得以享有更多元的票價選擇；搜尋票價時請留意頁面上的小提示，此類票價會提示『由海外供應商提供』，反之，無此提示者即表示該票價為易遊網自營出票，但一律享有易遊網優質的客戶服務。
            </li>
            <li>
              除上述外，為提供您更多優惠選項，部分票價採用拆開行程後個別查價再組合起來的報價模式，訂購流程中針對此種報價會有『由二至多張機票組成』之提示，舉例說明：搜尋台北東京來回，若搜尋結果的票價中有上述提示時，表示該來回票價是由＂台北飛東京＂和＂東京飛台北＂兩張單程票組合而成。訂購這類票價商品時須留意，每一張機票的票規皆為獨立運作，例如，去程機票航班取消，航空公司特許改票或退票可豁免罰金，但此豁免權並不適用於回程機票，回程若也需退改，仍必須依其票規處理。
            </li>
            <li>
              每個票價商品的訂位艙級（例如L艙、K艙...等）、票價規定以及出票時間不一定相同，請務必點開所選商品之「航班資訊」與「票價資訊及行李規定」，詳細檢查並確認符合您的需求再行訂購。
            </li>
            <li>
              機位價格時有變動，訂購流程中，如有發生異動，頁面會跳出告示視窗，您可選擇接受新價格或重新搜尋。
            </li>
            <li>
              旅客自行與航空公司達成的協議，以及在飛航過程中的消費，得由旅客自行負責。
            </li>
          </ul>
        </section>

        <!-- 付款及訂位 -->
        <section>
          <h3 class="mb-2 font-semibold text-others-original">付款及訂位</h3>
          <ul class="list-disc space-y-2 text-others-gray1 pl-5">
            <li>已選擇商品並填寫訂購資料後，送出訂單資料之前，請您詳細檢查『航班資訊』以及『票價資訊和行李規定』，確認符合需求再作訂購。</li>
            <li>確認訂購後，您須即時於線上刷卡付款，易遊網將以您所提供的信用卡帳戶進行授權（銀行會有信用卡授權記錄），授權成功即進行機位預訂作業。</li>
            <li>機位預訂成功後，將於您的信用卡帳戶直接收取已授權的金額，並發送付款成功確認函到您的E-Mail信箱；倘若機位預訂失敗，易遊網將經由銀行辦理解除授權（約3～7個工作天，實際天數視各發卡行而定）。易遊網自營出票的票種可即時確認機位預訂是否成功（部分廉航機票需時較久，最遲1小時內確認），由海外供應商提供的票種則最遲30分鐘內確認。</li>
            <li>訂購成功確認後，易遊網將開立機票行程單，並寄送到您的E-Mail信箱。</li>
            <li>如有多人同行，部分票種必須所有旅客一併付款，請依頁面提示為準。若是可依不同旅客分開付款的票種，則於第一筆旅客付款後進行機位預訂作業，預訂成功您即可於會員中心查詢訂單，所有旅客皆須於訂單標示的期限內完成付款，本次訂購才確認為成功並進行開票作業。</li>
            <li>不可重複預訂相同（或相近日期）的行程，否則所訂機位將會全數被航空公司取消。</li>
            <li>訂位時，每位旅客的英文姓名拼音必須與護照完全相同，即使只差一個字母，都會導致訂位記錄和機票無法使用。</li>
            <li>攜帶不佔位嬰兒同行時，由於每架飛機針對嬰兒的安全設施有限，仍有嬰兒數量限制，得視訂位記錄內航空公司回應的訊息而定；若航空公司拒絕攜帶嬰兒需求，則恕無法開立嬰兒票，旅客需改訂其他航班。</li>
            <li>請注意！本網銷售之台灣國內航線機票包括「全球訂位系統」與「華信航空訂位系統」兩種來源。透過全球訂位系統預訂，所有旅客必須填寫護照英文姓名進行訂位/開票，且須憑有效護照才可搭機；透過華信航空訂位系統預訂，台灣旅客可填寫中文姓名及身分證號進行訂位/開票，且憑身分證即可搭機。訂購時，填寫旅客資料頁面有相關提示，請務必遵循訂購規則，以確保旅程順暢。</li>
          </ul>
        </section>

        <!-- 退款辦理 -->
        <section>
          <h3 class="mb-2 font-semibold text-others-original">退款辦理</h3>
          <ul class="list-disc space-y-2 text-others-gray1 pl-5">
            <li>
              易遊網自營之機票於付款及訂位成功後5分鐘系統即自動開票；惟，部分廉航機票可能因訂位確認需時較久（最久1小時）而影響出票時間。
            </li>
            <li>
              海外供應商提供之機票，出票時間視供應商作業需要分為「付款後」和「出發前」兩種規則。「付款後出票」指旅客於線上付款及訂位成功後，快則2小時內至最遲48小時內完成出票；「出發前出票」則是旅客於線上付款及訂位成功後，最遲等到出發前7天可取得機票（若供應商提前出票，則旅客可提前取得機票）。
            </li>
            <li>
              承上述，最遲出票時間是供應商承諾在該時間之前完成出票，但多數會提前出票。等待出票期間旅客若有臨時狀況需更改或取消訂單，須先經由易遊網客服中心向供應商確認可否中斷作業，並須以客服中心之回覆為準。
            </li>
            <li>
              凡確認付款及訂位成功的訂單，不論何種出票時間，易遊網皆保證出票，旅客可放心訂購。惟，若需要較快取得電子機票以申辦其他旅行相關文件，則請選擇較符合需求的票價商品。
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