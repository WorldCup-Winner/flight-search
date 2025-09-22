<template>
    <div class="max-w-6xl w-full">
        <div class="bg-white my-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
            <h2 class="text-others-gray1 text-[26px]">訂單查詢</h2>
            <div class="bg-white mt-6 rounded-[10px] border-[2px] px-8 py-4 w-full">
                <h2 class="font-semibold text-primary-gold">訂單狀況</h2>
                <div class="space-x-4 mt-4">
                    <span class="text-green-600 text-[22px] font-bold">付款完成</span>
                    <span class="text-others-gray7">感謝您的訂購，客服人員將為您開票，並於開票完成後寄送電子機票email給您。</span>
                </div>
                <div class="space-x-4 mt-2">
                    <span class="text-others-gray7">應付金額</span>
                    <span class="text-others-gray7 text-[18px] font-bold">{{ formatPrice(total) }}</span>
                </div>
                <div class="space-x-4 mt-2">
                    <span class="text-others-gray7">訂單編號</span>
                    <span class="text-others-gray7 text-[18px] font-bold">{{ 'ORD0026597365' }}</span>
                </div>
            </div>
        </div>
        <div class="bg-white mt-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
            <!-- Header -->
            <h2 class="font-semibold text-primary-gold mb-4">航班資料</h2>
            <!-- Flight table -->
            <section class="border rounded-xl text-center overflow-hidden">
                <table class="w-full text-sm">
                    <thead class="bg-primary-gold text-white">
                        <tr>
                            <th class="px-4 py-3 font-medium w-[25%]">班機起飛</th>
                            <th class="px-4 py-3 font-medium">班機抵達</th>
                            <th class="px-4 py-3 font-medium">航班</th>
                            <th class="px-4 py-3 font-medium">狀態</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <tr v-for="(f, i) in flights" :key="i" class="bg-white">
                            <td class="px-4 py-3 align-top">
                                <div class="font-medium text-others-gray1">{{ f.departTime }}</div>
                                <div class="text-others-gray1">{{ f.departAirport }}</div>
                            </td>
                            <td class="px-4 py-3 align-top">
                                <div class="font-medium text-others-gray1">{{ f.arriveTime }}</div>
                                <div class="text-others-gray1">{{ f.arriveAirport }}</div>
                            </td>
                            <td class="px-4 py-3 align-top">
                                <div class="font-medium text-others-gray1">{{ f.flight }}</div>
                                <div class="text-others-gray1">{{ f.cabin }}</div>
                            </td>
                            <td class="px-4 py-3">
                                <span class="text-others-gray1">{{ f.status }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="p-4 text-xs text-others-original border-t">
                    以上班機起飛和抵達時間皆為當地時間，以24小時制呈現，例如：03:00為凌晨3點
                </div>
            </section>
        </div>
        <div class="bg-white mt-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
            <!-- Header -->
            <h2 class="font-semibold text-primary-gold mb-4">旅客資料</h2>
            <!-- Items table -->
            <section class="mt-6 border rounded-xl text-center overflow-hidden">
                <table class="w-full text-sm">
                    <thead class="bg-primary-gold text-white">
                        <tr>
                            <th class="px-4 py-3 font-medium w-[25%]">旅客姓名</th>
                            <th class="px-4 py-3 font-medium">商品名稱</th>
                            <th class="px-4 py-3 font-medium whitespace-nowrap w-[14%]">商品金額</th>
                            <th class="px-4 py-3 font-medium whitespace-nowrap w-[10%]">已付金額</th>
                            <th class="px-4 py-3 font-medium whitespace-nowrap w-[10%]">未付金額</th>
                            <th class="px-4 py-3 font-medium whitespace-nowrap w-[16%]">付款期限</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                    <tr v-for="(it, i) in items" :key="i" class="bg-white">
                        <td class="px-4 py-3">
                        <label class="inline-flex items-center gap-2 select-none">
                            <label class="flex gap-2 items-start text-sm text-slate-600 select-none">                        
                                <label class="flex items-center cursor-pointer relative">
                                    <input type="checkbox" checked
                                        class="mt-[1px] peer w-4 h-4 cursor-pointer transition-all appearance-none rounded-none hover:shadow-md border-[1px] border-primary-gold checked:bg-primary-gold"
                                        id="check" v-model="it.checked" />
                                    <span
                                        class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-primary-gold">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"
                                        stroke="currentColor" stroke-width="1">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd"></path>
                                        </svg>
                                    </span>
                                </label>
                            </label>
                            <span class="font-medium text-others-gray1">{{ it.name }}</span>
                        </label>
                        </td>
                        <td class="px-4 py-3 text-others-gray1">
                            {{ it.productName }}
                        </td>
                        <td class="px-4 py-3 text-right text-others-gray1">
                            <div>含稅金</div>
                            <div class="tabular-nums font-bold">{{ formatPrice(it.fare) }}</div>
                            <div class="tabular-nums">{{ formatPrice(it.tax) }}</div>
                        </td>
                        <td class="px-4 py-3 text-right tabular-nums text-others-gray1">
                            {{ formatPrice(it.paid) }}
                        </td>
                        <td class="px-4 py-3 text-right tabular-nums text-others-gray1 font-bold">
                            {{ formatPrice(Math.max(it.fare + it.tax - it.paid, 0)) }}
                        </td>
                        <td class="px-4 py-3 text-right text-others-original whitespace-nowrap">
                            {{ it.deadline }}
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div class="p-4 border-t flex items-baseline justify-end gap-2">
                    <span class="text-primary-gold font-bold">應付總額</span>
                    <span class="text-others-original font-bold text-[12px]">TWD</span>
                    <span class="text-[22px] tabular-nums text-others-original font-bold">
                    {{ formatPrice(total) }}
                    </span>
                </div>
            </section>
        </div>
        <div class="bg-white mt-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
            <!-- Header -->
            <h2 class="font-semibold text-primary-gold mb-4">主要聯絡人</h2>
            <section class="mt-6 border rounded-xl text-center overflow-hidden">
                <table class="w-full text-sm">
                    <thead class="bg-primary-gold text-white">
                        <tr>
                            <th class="px-4 py-3 font-medium w-[25%]">聯絡人姓名</th>
                            <th class="px-4 py-3 font-medium">聯絡手機</th>
                            <th class="px-4 py-3 font-medium">聯絡email</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                    <tr v-for="(contact, i) in contacts" :key="i" class="bg-white">
                        <td class="px-4 py-3 text-others-gray1">
                            {{ contact.name }}
                        </td>
                        <td class="px-4 py-3 text-others-gray1">
                            {{ contact.number }}
                        </td>
                        <td class="px-4 py-3 text-others-gray1">
                            {{ contact.mail }}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </section>
        </div>
        <div class="bg-white mt-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
            <!-- Header -->
            <h2 class="font-semibold text-primary-gold mb-4">代收轉付收據</h2>
            <section class="mt-6 border rounded-xl text-center overflow-hidden">
                <table class="w-full text-sm">
                    <thead class="bg-primary-gold text-white">
                        <tr>
                            <th class="px-4 py-3 font-medium w-[25%]">是否開立抬頭或統編</th>
                            <th class="px-4 py-3 font-medium">公司名稱</th>
                            <th class="px-4 py-3 font-medium">統一編號</th>
                            <th class="px-4 py-3 font-medium">收據內容摘要</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <tr v-for="(receipt, i) in receipts" :key="i" class="bg-white">
                            <td class="px-4 py-3 text-others-gray1">
                                {{ receipt.type }}
                            </td>
                            <td class="px-4 py-3 text-others-gray1">
                                {{ receipt.name }}
                            </td>
                            <td class="px-4 py-3 text-others-gray1">
                                {{ receipt.number }}
                            </td>
                            <td class="px-4 py-3 text-others-gray1">
                                {{ receipt.summary }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
        <div class="bg-white my-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
            <!-- Header -->
            <h2 class="font-semibold text-primary-gold mb-4">特殊協力事項</h2>
            <section class="mt-6 border rounded-xl text-center overflow-hidden">
                <table class="w-full text-sm">
                    <thead class="bg-primary-gold text-white">
                        <tr>
                            <th class="px-4 py-3 font-medium w-[25%]">是否有特殊需求</th>
                            <th class="px-4 py-3 font-medium">需求內容</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <tr v-for="(cooper, i) in specialCooperations" :key="i" class="bg-white">
                            <td class="px-4 py-3 text-others-gray1">
                                {{ cooper.type }}
                            </td>
                            <td class="px-4 py-3 text-others-gray1">
                                {{ cooper.detail }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    </div>
</template>
<script setup lang="ts">
import { reactive, computed } from "vue";
import { formatPrice } from "@/utils";

type Flight = {
  departTime: string;
  departAirport: string;
  arriveTime: string;
  arriveAirport: string;
  flight: string;
  cabin: string;
  status: string;
};

type Item = {
  checked: boolean;
  name: string;
  productName: string;
  fare: number; // base/with-tax amount (first line)
  tax: number;  // second line amount
  paid: number;
  deadline: string;
};

type Contact = {
    name: string;
    number: string;
    mail: string;
}

type Receipt = {
    type: string;
    name: string;
    number: string;
    summary: string;
}

type SpecialCooperation = {
    type: string;
    detail: string;
}

const flights = reactive<Flight[]>([
  {
    departTime: "2025/09/09 12:10",
    departAirport: "桃園國際機場",
    arriveTime: "2025/09/09 16:30",
    arriveAirport: "成田機場",
    flight: "泰國獅子航空SL394",
    cabin: "經濟艙O",
    status: "處理中",
  },
  {
    departTime: "2025/09/25 17:30",
    departAirport: "成田機場",
    arriveTime: "2025/09/25 20:20",
    arriveAirport: "桃園國際機場",
    flight: "泰國獅子航空SL395",
    cabin: "經濟艙O",
    status: "處理中",
  },
]);

const items = reactive<Item[]>([
  {
    checked: true,
    name: "LEE WEIEN - -, MR.",
    productName: "SL/台北/東京/台北/泰國獅子航空 - TPE/NRT NRT/TPE",
    fare: 5278,
    tax: 3485, // adjust to match your real data
    paid: 0,
    deadline: "2025/8/31 14:20",
  },
  {
    checked: false,
    name: "LEE WEIEN - -, MR.",
    productName: "SL/台北/東京/台北/泰國獅子航空 - TPE/NRT NRT/TPE",
    fare: 5278,
    tax: 3316,
    paid: 0,
    deadline: "2025/8/31 14:20",
  },
  {
    checked: false,
    name: "LEE WEIEN - -, MR.",
    productName: "SL/台北/東京/台北/泰國獅子航空 - TPE/NRT NRT/TPE",
    fare: 5278,
    tax: 3316,
    paid: 0,
    deadline: "2025/8/31 14:20",
  },
]);

const contacts = reactive<Contact[]>([
    {
        name: "王大同",
        number: "0933555222",
        mail: "wong@gmail.com"
    }
])

const receipts = reactive<Receipt[]>([
    {
        type: "是",
        name: "中國鋼鐵股份有限公司",
        number: "12345678",
        summary: "僅開立「機票款」三個字"
    }
])

const specialCooperations = reactive<SpecialCooperation[]>([
    {
        type: "是",
        detail: "內容文字內容文字內容文字內容文字內容文字內容文字內容文字內容文字內容文字，內容文字內容文字內容文字內容文字內容文字內容文字內容文字內容文字內容文字"
    }
])

const total = computed(() =>
  items
    .filter((i) => i.checked)
    .reduce((sum, i) => sum + i.fare + i.tax - i.paid, 0)
);

window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
});
</script>

<style scoped>
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>