<template>
    <div class="max-w-6xl w-full py-6">
        <div class="grid grid-cols-12 gap-3">
            <div class="col-span-12 md:col-span-9 w-full items-center justify-between">
                <div class="relative mt-[0px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] w-full">
                    <div v-if="!loading">
                        <div class="w-ful flex items-center gap-2 bg-white text-others-gray7 text-[17px] rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-4 font-bold">
                            <!-- Display all segments in the route -->
                            <template v-if="bookingStore.segments.length > 0">
                                <template v-for="(segment, index) in bookingStore.segments" :key="index">
                                    <span>{{ getSegmentDeparture(segment) }}</span>
                                    <img src="@/assets/imgs/arrow-right.svg" />
                                    <span>{{ getLastSegmentArrival(segment) }}</span>
                                    <span v-if="index < bookingStore.segments.length - 1" class="mx-2 text-divider-medium">|</span>
                                </template>
                            </template>
                            <!-- Fallback for old data structure -->
                            <template v-else>
                                <span>{{ bookingStore.searchParams?.departureCity || '出發地' }}</span>
                                <img v-if="bookingStore.isRoundTrip" src="@/assets/imgs/arrow-both.svg" />
                                <img v-else src="@/assets/imgs/arrow-right.svg" />
                                <span>{{ bookingStore.searchParams?.arrivalCity || '目的地' }}</span>
                            </template>
                        </div>
                    </div>
                    <div v-else>
                        <div class="w-ful flex items-center gap-2 bg-white text-others-gray7 text-[17px] rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-4 font-bold">
                            加载中...
                        </div>
                    </div>
                    <div class="px-20 py-10">
                        <!-- Display segments based on trip type -->
                        <div v-for="(segment, segmentIndex) in bookingStore.segments" :key="segmentIndex" class="relative w-full mb-10">
                            <div class="space-x-10">
                                <span class="px-5 py-3 rounded-[15px] rounded-br-none text-white bg-others-original">
                                    {{ getSegmentTitle(segmentIndex) }}
                                </span>
                                <span class="text-others-gray7 text-[15px]">
                                    {{ formatDateToChineseWithWeek(segment.sectors[0]?.departureDate) }} 
                                    飛行時間 {{ toDuration(segment.sectors.reduce((sum: number, sec: Sector) => sum + sec.durationMinutes, 0) || 0)}}
                                </span>
                            </div>
                            <div v-for="(sec, i) in segment.sectors" :key="i" class="ml-12">
                                <div class="grid grid-cols-12 gap-4 py-8 px-8">
                                    <div class="flex items-center flex-col justify-between col-span-12 md:col-span-3">
                                        <div class="flex flex-row items-center justify-between gap-6">
                                            <div class="text-others-gray1">{{ formatDateToChinese(sec.departureDate) }}</div>
                                            <div class="font-bold text-others-gray7">{{ sec.departureTime }}</div>
                                        </div>
                                        <div class="text-others-gray1">{{ toDuration(sec.durationMinutes) }}</div>
                                        <div class="flex items-center justify-between gap-6">
                                            <div class="text-others-gray1">{{ formatDateToChinese(sec.arrivalDate) }}</div>
                                            <div class="font-bold text-others-gray7">{{ sec.arrivalTime }}</div>
                                        </div>
                                    </div>

                                    <div class="relative mx-6">
                                        <span class="absolute -left-[6px] top-0 w-[14px] h-[14px] rounded-full bg-others-gray3"></span>
                                        <div class="w-[3px] h-full bg-others-gray3"></div>
                                        <span class="absolute -left-[6px] bottom-0 w-[14px] h-[14px] rounded-full bg-others-gray3"></span>
                                    </div>

                                    <div class="col-span-12 md:col-span-8 space-y-2">
                                        <div class="font-bold text-others-gray7">
                                            {{ sec.departureAirportCode }}{{ sec.departureAirportName }}{{ sec.departureTerminal }}{{  sec.departureCityName }}
                                        </div>
                                        <div class="flex items-center gap-2 text-others-gray1">
                                            <img
                                                v-if="airlineLogoFor(sec)"
                                                :src="airlineLogoFor(sec)"
                                                :alt="sec.marketingAirlineName || sec.operatingAirlineName"
                                                class="w-5 h-5 object-contain"
                                                @error="onImageError"
                                            />
                                            <span class="font-semibold">{{ sec.flightNo || sec.operatingFlightNo }}</span>
                                            <span class="text-others-gray1">{{ sec.marketingAirlineName || sec.operatingAirlineName }}</span>
                                            <span class="text-others-gray1">{{ sec.craft?.craftName ? ' ' + sec.craft.craftName : '' }}</span>
                                        </div>
                                        <div class="font-bold text-others-gray7">
                                            {{ sec.arrivalAirportCode }}{{ sec.arrivalAirportName }}{{ sec.arrivalTerminal }}{{ sec.arrivalCityName }}
                                        </div>
                                    </div>
                                </div>

                                <div v-if="i < segment.sectors.length - 1 && sec.transfer" class="mx-10 my-2 text-others-gray1">
                                    <div class="inline-flex items-center gap-2 bg-tb-body rounded-[10px] px-6 py-2">
                                        <span>於{{ sec.transfer.transferCity }}轉機</span>
                                        <span class="text-others-gray3">|</span>
                                        <span class="text-others-original">{{ toDuration(sec.transfer.transferStayMinutes) }}</span>
                                        <span class="text-others-gray3" v-if="sec.transfer.isChangeTerminal">|</span>
                                        <span v-if="sec.transfer.isChangeTerminal" class="text-others-original">不同航廈</span>
                                        <span class="text-others-gray3" v-if="sec.transfer.isChangeAirport">|</span>
                                        <span v-if="sec.transfer.isChangeAirport" class="text-others-original">不同機場</span>
                                        <span v-if="sec.baggageStraight > 0">｜ 行李直掛</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="bookingStore.selectedFare"
                        class="relative grid grid-cols-12 gap-4 p-5 border-b last:border-b-0 border-others-gray3 bg-tb-body">
                        <div class="col-span-12 md:col-span-3 text-others-gray1 font-bold flex items-center justify-center">
                            {{ bookingStore.selectedFare.cabin }}
                        </div>
                        <ul class="col-span-12 md:col-span-9 space-y-2">
                            <li v-for="(n, i) in bookingStore.selectedFare.notes" :key="i" class="flex items-center gap-2 text-others-gray1">
                                <img :src="noteIcon(n.type, n.icon)" />
                                <span class="text-[14px]">
                                {{ n.text }}
                                </span>
                            </li>
                        </ul>
                        <button class="absolute bottom-[10px] right-[40px] w-[200px] h-[40px] text-white bg-others-original rounded-[10px] text-[14px] cursor-pointer" @click="openBaggageInfoAndFeeRule">行李資訊及票價規定</button>
                    </div>
                </div>
                <div class="relative mt-[20px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-16 py-8 w-full">
                    <p class="absolute left-[40px] top-[20px] text-primary-gold font-bold">會員 / 訪客登入</p>
                    <div class="flex flex-row justify-between gap-5 items-center text-others-gray1 pt-8">
                        <p>若您曾參加過加利利旅行社團體即為會員，可利用會員登入進行訂購；非會員亦可使用訪客身分，完成手機號碼認證即可下單。 </p>
                        <button
                            class="px-4 py-1 w-[93px] h-[40px] rounded-md border-none bg-others-original text-white hover:bg-others-hover transition"
                            @click="openDialog('signin')">
                            登入
                        </button>
                    </div>
                </div>
                <div class="relative mt-[20px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-16 py-8 w-full">
                    <p class="absolute left-[40px] top-[20px] text-primary-gold font-bold">旅客名單</p>
                    <div class="pt-8">
                        <div v-for="(p, idx) in passengers" :key="idx" class="mb-8">
                            <p class="font-bold">旅客{{idx + 1}} ({{p.type === 'adult' ? '成人' : '小孩'}})</p>
                            <div class="grid grid-cols-12 justify-between gap-x-5 items-center text-others-gray1" >
                                <div class="relative grid-cols-12 md:col-span-3 mb-4">
                                    <label class="block mb-1 text-others-gray1">姓氏</label>
                                    <input
                                        v-model="p.firstName"
                                        type="text"
                                        placeholder="英文姓 例：PENG"
                                        class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                                </div>
                                <div class="relative grid-cols-12 md:col-span-3 mb-4">
                                    <label class="block mb-1 text-others-gray1">名字</label>
                                    <input
                                        v-model="p.lastName"
                                        type="text" 
                                        placeholder="英文名 例：DAKUAI"
                                        class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                                </div>
                                <div class="relative grid-cols-12 md:col-span-3 mb-4">
                                    <label class="block mb-1 text-others-gray1">性別</label>
                                    <div class="relative">
                                        <select
                                            v-model="p.gender"
                                            placeholder="請選擇"
                                            class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none appearance-none bg-transparent cursor-pointer"
                                            aria-label="Gender"
                                            >
                                            <option value="male">
                                                男
                                            </option>
                                            <option value="female">
                                                女
                                            </option>
                                        </select>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                            class="text-primary-goldpointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M18 10l-6 6-6-6" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="relative grid-cols-12 md:col-span-3 mb-4">
                                    <label class="block mb-1 text-others-gray1">出生日期</label>
                                    <input
                                        type="text"
                                        placeholder="請選擇"
                                        v-model="p.birthDateText"
                                        class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none"
                                        @focus="toggleDatePicker($event, p, 'birthDate')"
                                        />
                                        <transition name="fade-scale">
                                            <teleport to="body">
                                                <div
                                                    v-if="isDatePickerOpen"
                                                    ref="datePopoverRef"
                                                    class="fixed z-[10000] left-[-100px]"
                                                    :style="popoverStyle"
                                                    @click.stop
                                                    >
                                                    <DatePicker
                                                      :modelValue="datePickerModelValue"
                                                      :min="datePickerMinDate"
                                                      :max="datePickerMaxDate"
                                                      :type="true"
                                                      @update:modelValue="handleSingleDateApply"
                                                      @apply="handleSingleDateApply"
                                                      @close="closeDatePicker"
                                                    />
                                                </div>
                                            </teleport>
                                        </transition>
                                </div>
                                <div class="relative grid-cols-12 md:col-span-3 mb-4">
                                    <label class="block mb-1 text-others-gray1">國籍</label>
                                    <div class="relative">
                                        <select
                                            v-model="p.nationality"
                                            class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none appearance-none bg-transparent cursor-pointer"
                                            aria-label="Nationality"
                                        >
                                            <option
                                                v-for="item in nationalities"
                                                :key="item.countryCode"
                                                :value="item.countryCode"
                                                >
                                                {{ item.countryCode }}({{ item.countryNameZh }})
                                            </option>
                                        </select>

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            class="text-primary-gold pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 fill-none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        >
                                            <path d="M18 10l-6 6-6-6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="relative mt-[20px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-16 py-8 w-full">
                    <p class="absolute left-[40px] top-[20px] text-primary-gold font-bold">主要聯絡人</p>
                    <div class="grid grid-cols-12 justify-between gap-x-5 items-center text-others-gray1 pt-8">
                        <div class="relative grid-cols-12 md:col-span-3 mb-4">
                            <label class="block mb-1 text-others-gray1">聯絡人姓氏</label>
                            <input 
                                v-model="contactFirstName"
                                type="text" 
                                placeholder="英文姓 例：JOHN"
                                class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                        </div>
                        <div class="relative grid-cols-12 md:col-span-3 mb-4">
                            <label class="block mb-1 text-others-gray1">聯絡人名字</label>
                            <input 
                                v-model="contactLastName"
                                type="text" 
                                placeholder="英文名 例：SMITH"
                                class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                        </div>
                        <div class="relative grid-cols-12 md:col-span-3 mb-4">
                            <label class="block mb-1 text-others-gray1">性別</label>
                            <div class="relative">
                                <select
                                    v-model="contactGender"
                                    placeholder="請選擇"
                                    class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none appearance-none bg-transparent cursor-pointer"
                                    aria-label="Gender"
                                    >
                                    <option value="male">
                                        男
                                    </option>
                                    <option value="female">
                                        女
                                    </option>
                                </select>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                    class="text-primary-goldpointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M18 10l-6 6-6-6" />
                                </svg>
                            </div>
                        </div>
                        <div class="relative grid-cols-12 md:col-span-3 mb-4">
                            <label class="block mb-1 text-others-gray1">聯絡手機</label>
                            <PhoneField v-model="phoneNumber" :countryCode="code" :show-eye="false" />
                        </div>
                        <div class="relative grid-cols-12 md:col-span-3 mb-4">
                            <label class="block mb-1 text-others-gray1">聯絡email</label>
                            <input 
                                v-model="contactEmail"
                                type="text" 
                                placeholder="必填"
                                class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                        </div>
                    </div>
                </div>
                <div class="relative mt-[20px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
                    <p class="text-primary-gold font-bold">代收轉付收據</p>
                    <p class="mb-1 text-others-gray1 pt-4">旅遊業依法開立「代收轉付收據」，不另開統一發票，付款後以email提供。</p>
                    <p class="mb-1 text-others-original">若行程取消或更動，為保障消費者權益，同意授權本公司代為處理銷貨退回或折讓證明單。</p>
                    <div class="flex flex-row items-center mt-5 gap-5">
                        <p class="text-others-gray1">是否開立抬頭或統編？</p>
                        <div class="flex gap-5" role="radiogroup" aria-label="是否索取發票">
                            <div class="relative">
                                <input
                                    id="receipt-no"
                                    class="peer sr-only"
                                    type="radio"
                                    name="receipt"
                                    :value="false"
                                    v-model="isReceipt"
                                    />
                                <label
                                    for="receipt-no"
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-primary-gold transition-color duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    否
                                </label>
                            </div>
                            <div class="relative">
                                <input
                                    id="receipt-yes"
                                    class="peer sr-only"
                                    type="radio"
                                    name="receipt"
                                    :value="true"
                                    v-model="isReceipt"
                                    />
                                <label
                                    for="receipt-yes"
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-primary-gold transition duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    是
                                </label>
                            </div>
                        </div>
                    </div>
                    <div v-if="isReceipt">
                        <div class="grid grid-cols-12 justify-between gap-x-5 items-center text-others-gray1 pt-4">
                            <div class="relative grid-cols-12 md:col-span-6 mb-4">
                                <label class="block mb-1 text-others-gray1">公司名稱</label>
                                <input 
                                    v-model="companyName"
                                    type="text" 
                                    placeholder="請填公司全名"
                                    class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                            </div>
                            <div class="relative grid-cols-12 md:col-span-6 mb-4">
                                <label class="block mb-1 text-others-gray1">統一編號</label>
                                <input 
                                    v-model="taxId"
                                    type="text" 
                                    placeholder="請填統一編號"
                                    class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                            </div>
                        </div>
                        <div class="flex flex-row items-center mt-5 gap-5">
                            <p class="text-others-gray1">收據內容摘要</p>
                            <div class="flex gap-5" role="radiogroup" aria-label="收據內容摘要">
                                <div class="relative">
                                    <input
                                        id="summary-no"
                                        class="peer sr-only"
                                        type="radio"
                                        name="summary"
                                        :value="false"
                                        v-model="isSummary"
                                        />
                                    <label
                                        for="summary-no"
                                        class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                                bg-divider-soft text-primary-gold transition-color duration-200
                                                before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                                peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    列出航班資訊
                                    </label>
                                </div>
                                <div class="relative">
                                    <input
                                        id="summary-yes"
                                        class="peer sr-only"
                                        type="radio"
                                        name="summary"
                                        :value="true"
                                        v-model="isSummary"
                                        />
                                    <label
                                        for="summary-yes"
                                        class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                                bg-divider-soft text-primary-gold transition duration-200
                                                before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                                peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    僅開立「機票款」三個字
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="relative mt-[20px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
                    <p class="text-primary-gold font-bold">特殊協力事項</p>
                    <p class="block mb-1 text-others-gray1 pt-4">若您有特殊餐、輪椅等特殊需求，加利利旅遊將代為轉達，實際供應依航空公司為準，敬請見諒。</p>
                    <div class="flex flex-row items-center mt-5 gap-5">
                        <p class="text-others-gray1">是否有特殊需求？</p>
                        <div class="flex gap-5" role="radiogroup" aria-label="是否有特殊需求">
                            <div class="relative">
                                <input
                                    id="special-need-no"
                                    class="peer sr-only"
                                    type="radio"
                                    name="special-need"
                                    :value="false"
                                    v-model="isSpecialNeed"
                                    />
                                <label
                                    for="special-need-no"
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-primary-gold transition-color duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    否
                                </label>
                            </div>
                            <div class="relative">
                                <input
                                    id="special-need-yes"
                                    class="peer sr-only"
                                    type="radio"
                                    name="special-need"
                                    :value="true"
                                    v-model="isSpecialNeed"
                                    />
                                <label
                                    for="special-need-yes"
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-primary-gold transition duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    是
                                </label>
                            </div>
                        </div>
                    </div>
                    <div v-if="isSpecialNeed">
                        <textarea  
                            v-model="specialNeedsText"
                            placeholder="需求內容"
                            class="w-full h-[80px] mt-4 px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                    </div>
                </div>
            </div>
            <div class="col-span-12 md:col-span-3 rounded-[10px] bg-white p-6 drop-shadow-[0px_2px_30px_rgba(0,0,0,0.1)] md:p-4 w-full h-fit">
                <div class="space-y-3">
                    <!-- Adult ticket total -->
                    <div v-if="adultTotal > 0" class="flex items-baseline justify-between text-primary-gold font-semibold">
                        <span>成人機票總額</span>
                        <div class="flex items-end">
                            {{ currency }} {{ formatPrice(adultTotal) }}
                        </div>
                    </div>
                    
                    <!-- Adult line items -->
                    <div
                        v-for="(line, idx) in adultLines"
                        :key="`adult-${idx}`"
                        class="flex justify-between text-others-gray1"
                        >
                        <span>{{ line.label }}</span>
                        <div class="flex items-end">
                            {{ currency }} {{ formatPrice(line.amount) }} x {{ line.qty ?? 1 }}
                        </div>
                    </div>
                    
                    <!-- Child ticket total -->
                    <div v-if="childTotal > 0" class="flex items-baseline justify-between text-primary-gold font-semibold">
                        <span>兒童機票總額</span>
                        <div class="flex items-end">
                            {{ currency }} {{ formatPrice(childTotal) }}
                        </div>
                    </div>
                    
                    <!-- Child line items -->
                    <div
                        v-for="(line, idx) in childLines"
                        :key="`child-${idx}`"
                        class="flex justify-between text-others-gray1"
                        >
                        <span>{{ line.label }}</span>
                        <div class="flex items-end">
                            {{ currency }} {{ formatPrice(line.amount) }} x {{ line.qty ?? 1 }}
                        </div>
                    </div>

                    <div class="my-2 border-t border-others-gray3"></div>
                    
                    <!-- Payable total -->
                    <div class="flex items-baseline justify-between">
                        <span class="text-primary-gold font-semibold">{{ totalLabel }}</span>
                        <div class="flex items-end font-bold text-others-original">
                            <div class="text-[12px] pr-1">{{ currency }}</div>
                            <div class="text-[24px] leading-none">
                                {{ formatPrice(effectiveTotal) }}
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Agreement -->
                <div class="mt-10 flex gap-2 items-start text-sm text-slate-600 select-none">                        
                    <label class="flex mt-[3px] items-center cursor-pointer relative">
                    <input type="checkbox" checked
                        class="peer w-4 h-4 cursor-pointer transition-all appearance-none rounded-none hover:shadow-md border-[1px] border-primary-gold checked:bg-primary-gold"
                        id="check" v-model="isAgreedToTheTerms" />
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
                    <span>
                        我已閱讀「
                        <span class="text-others-original cursor-pointer hover:text-others-hover" @click="isOpenBookingInstruction = true">訂購須知</span>
                        」含個資聲明）並同意其內容
                    </span>
                </div>
                <!-- Submit button -->
                <button
                    class="mt-6 w-full rounded-[10px] bg-others-original py-3 font-semibold text-white hover:bg-others-hover disabled:opacity-30 disabled:cursor-not-allowed"
                    :disabled="!isAgreedToTheTerms || isSubmitting"
                    @click="emitSubmit"
                    >
                    <span>{{ isSubmitting ? '處理中...' : '送出訂單' }}</span>
                </button>
            </div>
        </div>
        <!-- Modal -->
        <transition name="fade">
            <div v-if="activeDialog" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
                @click.self="closeDialog">
                <div class="bg-white rounded-tl-[60px] rounded-tr-[60px] rounded-bl-[60px] shadow-lg px-[90px] py-[60px] relative">
                <SignIn v-if="activeDialog === 'signin'" />
                <SignUp v-else-if="activeDialog === 'signup'" />
                </div>
            </div>
        </transition>
    </div>
    <Transition name="fade">
        <WakeUp v-if="isWakeUp" v-model:step="step" />
    </Transition>
    <Transition name="fade">
        <BookingInstruction :open="isOpenBookingInstruction" @close="isOpenBookingInstruction = false" />
    </Transition>
    <Transition name="fade">
        <BaggageInfoAndFeeRule 
            :open="sharedValue.isOpenBaggageInfoAndFeeRule" 
            :fareRuleData="bookingStore.fareRuleData" 
            @close="updateValue({ isOpenBaggageInfoAndFeeRule: false })" />
    </Transition>
    <Transition name="fade">
        <div v-if="bookingError" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" @click.self="bookingError = null">
            <div class="flex flex-col items-center justify-center w-[400px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-16 py-8">
                <img src="@/assets/imgs/alert-price-change.png" class="w-20 h-20 mb-4" />
                <h3 class="text-others-gray1 text-h3 md:text-h3-d mb-2">訂單提交失敗</h3>
                <p class="text-others-gray1 text-center mb-6">{{ bookingError }}</p>
                <button
                  class="mt-6 px-4 py-1 w-[93px] h-[40px] rounded-md border-none bg-others-original text-white hover:bg-others-hover transition"
                  @click="bookingError = null"
                >
                  確認
                </button>
            </div>
        </div>
    </Transition>
</template>
<script setup lang="ts">
import { provide, computed, onBeforeUnmount, ref, onMounted, watch } from 'vue'
import { airlineLogoFor, formatDate, formatDateToChinese, formatDateToChineseWithWeek, formatDateWithYYYYMMDD, formatPrice, makeDirect, noteIcon, onImageError, toDuration } from '@/utils'

import Airline_1 from '@/assets/imgs/airlines/TK.png'

import SignIn from "@/components/auth/SignIn.vue"
import SignUp from "@/components/auth/SignUp.vue"
import WakeUp from "@/components/ui/WakeUp.vue"
import BookingInstruction from '@/components/ui/BookingInstruction.vue'
import BaggageInfoAndFeeRule from '@/components/ui/BaggageInfoAndFeeRule.vue'

import PhoneField from '../ui/PhoneField.vue'
import DatePicker from '../ui/DatePicker.vue'
import type { BookingRequestViewModel, Sector } from '@/utils/types'
import { useBookingStore } from '@/stores/booking'
import { booking, getNationality } from '@/api'

const bookingStore = useBookingStore()

interface SharedData {
  isOpenBaggageInfoAndFeeRule: boolean,
  fareRuleData?: any
}

const sharedValue = ref<SharedData>({
  isOpenBaggageInfoAndFeeRule: false,
  fareRuleData: bookingStore.fareRuleData || undefined,
})

function updateValue(val: SharedData) {
  sharedValue.value = val
}

function openBaggageInfoAndFeeRule() {
    updateValue?.({
        isOpenBaggageInfoAndFeeRule: true,
        fareRuleData: bookingStore.fareRuleData
    })
}

const isDatePickerOpen = ref(false)
const isSubmitting = ref(false)
const startDate = ref<any>(new Date())
const activeInputEl = ref<HTMLElement | null>(null)
const activeDateField = ref<{ passenger?: any; field: string } | null>(null)
const popoverStyle = ref<Record<string, string>>({})

const datePickerModelValue = computed(() => {
  if (!activeDateField.value) return new Date();
  if (activeDateField.value.field === 'birthDate') {
    return activeDateField.value.passenger?.birthDate || new Date();
  }
  if (activeDateField.value.field === 'documentExpiryDate') {
    return activeDateField.value.passenger?.documentExpiryDate || null;
  }
  return new Date();
});

const datePickerMinDate = computed(() => {
  if (activeDateField.value?.field === 'documentExpiryDate') {
    return new Date();
  }
  return undefined;
});

const datePickerMaxDate = computed(() => {
  if (activeDateField.value?.field === 'birthDate') {
    return new Date();
  }
  return undefined;
});

function toggleDatePicker(event: FocusEvent, passenger?: any, field: string = 'outbound') {
  activeInputEl.value = event.target as HTMLElement
  activeDateField.value = { passenger, field }

  isDatePickerOpen.value = true
  updatePopoverPosition()

  window.addEventListener('scroll', updatePopoverPosition, true)
  window.addEventListener('resize', updatePopoverPosition, true)
}


function closeDatePicker() {
  isDatePickerOpen.value = false
  window.removeEventListener('scroll', updatePopoverPosition, true)
  window.removeEventListener('resize', updatePopoverPosition, true)
}

function updatePopoverPosition() {
  const el = activeInputEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const gap = 8
  popoverStyle.value = {
    top: `${rect.bottom + gap}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
  }
}

function handleSingleDateApply(d: Date) {
  if (!activeDateField.value) return

  if (activeDateField.value.field === 'outbound') {
    startDate.value = d
  } else if (activeDateField.value.passenger) {
    activeDateField.value.passenger.birthDate = d
    activeDateField.value.passenger.birthDateText = formatDate(d)
  }

  closeDatePicker()
}

onBeforeUnmount(() => closeDatePicker())

// Provide the updater function
provide<(val: SharedData) => void>('updateValue', updateValue)

type Line = {
    label: String
    amount: number
    qty: number
}

const props = defineProps({
    data: { type: Object, default: null },
    currency: { type: String, default: 'TWD' },
    locale: { type: String, default: 'zh-TW' },
    titleLabel: { type: String, default: '成人機票總額' },
    totalLabel: { type: String, default: '應付總額' },
    termsUrl: { type: String, default: '#' },
    lines: {
        type: Array<Line>,
        default: () => ([
            { label: '成人票價', amount: 7174, qty: 1 },
            { label: '稅與費用', amount: 1589, qty: 1 }
        ])
    },
})

const step = defineModel<number>('step')

const activeDialog = ref(null)

const isReceipt = ref(false)
const isSummary = ref(false)
const isSpecialNeed = ref(false)
const isOpenWakeUp = ref(false)
const isOpenBookingInstruction = ref(false)
const isAgreedToTheTerms = ref(false)
const isWakeUp = ref(false)
const bookingError = ref<string | null>(null)

const code  = ref('+886')
const phoneNumber  = ref('')

const contactFirstName = ref('')
const contactLastName = ref('')
const contactGender = ref('male')
const contactEmail = ref('')

const companyName = ref('')
const taxId = ref('')

const specialNeedsText = ref('')

const openDialog = (type: any) => { activeDialog.value = type }
const closeDialog = () => { activeDialog.value = null }

const emit = defineEmits<{
    (e: 'submit', payload: {
        total: number
        currency: String
        lines: Array<Line>
    }): void
}>()

const currency = computed(() => props.currency ?? 'TWD')
const passengers = ref<any[]>([])
const loading = ref(true)
const nationalities = ref<Array<{
    countryCode: string,
    countryNameZh: string
}>>([])

// Helper function to get segment title based on trip type and index
function getSegmentTitle(segmentIndex: number): string {
  if (bookingStore.isMultiTrip) {
    return `行程${segmentIndex + 1}`
  } else if (bookingStore.isRoundTrip) {
    return segmentIndex === 0 ? '去程' : '回程'
  } else {
    return '去程'
  }
}

// Helper function to get departure city from a segment
function getSegmentDeparture(segment: any): string {
  if (segment?.sectors && segment.sectors.length > 0) {
    return segment.sectors[0].departureCityName || segment.sectors[0].departureAirportName || '出發地'
  }
  return '出發地'
}

// Helper function to get departure city from first segment
function getFirstSegmentDeparture(): string {
  if (bookingStore.segments.length > 0) {
    return getSegmentDeparture(bookingStore.segments[0])
  }
  return bookingStore.searchParams?.departureCity || '出發地'
}

// Helper function to get arrival city from last sector of a segment
function getLastSegmentArrival(segment: any): string {
  if (segment?.sectors && segment.sectors.length > 0) {
    const lastSector = segment.sectors[segment.sectors.length - 1]
    return lastSector.arrivalCityName || lastSector.arrivalAirportName || '目的地'
  }
  return '目的地'
}

onMounted(async () => {
    await bookingStore.getBookingData()

    try {
        const res = await getNationality()
        nationalities.value = res.data.data || []
    } catch (error) {
        console.error('Error loading nationality list:', error)
    }
    loading.value = false
})

const realLines = computed(() => {
  const fareSummary = bookingStore.fareRuleData?.fareSummary
  if (!fareSummary || fareSummary.length === 0) {
    return [
      { label: '成人票價', amount: 0, qty: bookingStore.searchParams?.adults || 1 },
      { label: '稅與費用', amount: 0, qty: 1 }
    ]
  }

  const lines: Line[] = []
  fareSummary.forEach(summary => {
    const passengerType = summary.passengerType
    const passengerLabel = passengerType === 'ADT' ? '成人' : passengerType === 'CNN' ? '兒童' : '嬰兒'
    const qty = passengerType === 'ADT' ? (bookingStore.searchParams?.adults || 1) : 
               passengerType === 'CNN' ? (bookingStore.searchParams?.children || 0) : 
               passengerType === 'INF' ? (bookingStore.searchParams?.infants || 0) : 1

    if (qty > 0) {
      lines.push({
        label: `${passengerLabel}票價`,
        amount: summary.price,
        qty: qty
      })

      if (summary.taxAmount > 0) {
        lines.push({
          label: `${passengerLabel}稅與費用`,
          amount: summary.taxAmount,
          qty: qty
        })
      }
    }
  })

  return lines
})

const effectiveLines = computed(() => {
  return realLines.value.length > 0 && realLines.value.some(line => line.amount > 0) ? realLines.value : props.lines
})

const effectiveTotal = computed(() => {
  return effectiveLines.value.reduce((sum: number, l: Line) => sum + (Number(l.amount) * (Number(l.qty ?? 1))), 0)
})

// Filter lines by passenger type
const adultLines = computed(() => {
  return effectiveLines.value.filter(line => line.label.startsWith('成人'))
})

const childLines = computed(() => {
  return effectiveLines.value.filter(line => line.label.startsWith('兒童'))
})

// Calculate adult total
const adultTotal = computed(() => {
  return adultLines.value.reduce((sum: number, l: Line) => sum + (Number(l.amount) * (Number(l.qty ?? 1))), 0)
})

// Calculate child total
const childTotal = computed(() => {
  return childLines.value.reduce((sum: number, l: Line) => sum + (Number(l.amount) * (Number(l.qty ?? 1))), 0)
})


function emitSubmit() {
  if (!isAgreedToTheTerms.value) {
    bookingError.value = '請先閱讀並同意訂購須知';
    return
    }
  
  if (!contactFirstName.value || !contactLastName.value || !contactGender.value ||  !contactEmail.value || !phoneNumber.value) {
    bookingError.value = '請填寫完整的聯絡人資訊';
    return
    }
  
  if (isReceipt.value && (!companyName.value || !taxId.value)) {
    bookingError.value = '請填寫完整的發票資訊';
    return
  }

  if (isSpecialNeed.value && !specialNeedsText.value.trim()) {
    bookingError.value = '請描述您的特殊需求';
    return
    }
  
  const incompletePassengers = passengers.value.filter(p => 
    !p.lastName.trim() || 
    !p.firstName.trim() || 
    !p.birthDateText.trim() ||
    !p.documentNumber.trim() ||
    !p.documentExpiryDateText.trim()
  )
  if (incompletePassengers.length > 0) {
    bookingError.value = '請填寫完整的乘客資訊，包含證件號碼與效期';
    return
    }
  
  isSubmitting.value = true;

const bookingData: BookingRequestViewModel = {
itineraries: [] as any[],

passengers: passengers.value.map((p, index) => {
    const birthDate = new Date(p.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return {
        order: index + 1,  // 乘客順序從 1 開始
        firstName: p.firstName,
        lastName: p.lastName,
        gender: p.gender === 'male' ? 0 : 1, // 0 = male, 1 = female
        dateOfBirth: formatDateWithYYYYMMDD(p.birthDateText),
        nationality: p.nationality || 'TW',
        passengerType: age >= 12 ? 0 : 1, // 0 for adult (12+), 1 for child
        documentType: p.documentType,
        documentNumber: p.documentNumber,
        documentExpiryDate: formatDateWithYYYYMMDD(p.documentExpiryDateText),
        mobileNumberCountryCode: code.value,
        mobileNumber: phoneNumber.value,
        email: contactEmail.value,
        isTheOrderer: index === 0,
        mainlandTravelPermitNumber: "11111111",
        mainlandTravelPermitExpiryDate: "2028-12-01",
        mealPreference: '',
        frequentFlyerNumber: '',
        frequentFlyerAirline: '',
        specialStatus: p.passengerType === 'INF' ? 'INF' : null
    }
}),

contactInfo: {
    firstNameOfContactPerson: contactFirstName.value,
    lastNameOfContactPerson: contactLastName.value,
    genderOfContactPerson: contactGender.value == 'male' ? 0 : 1, // 0 = male, 1 = female
    mobileNumberCountryCode: code.value,
    contactMobileNumber: phoneNumber.value,
    contactEmail: contactEmail.value,
    orderMethod: 0,
    registrationIdType: 0,  // 0 = 護照
    registrationIdNumber: "Z123556767",  // 參考 sample data
    registrationPassword: '',
    mobileVerificationId: '',
    memberId: '',
    lineId: '',
    preferredContactMethod: 1,  // 1 = email
    assignedLocationCode: '',
    assignedConsultantId: ''
},

receiptInfo: isReceipt.value ? {
    isNeedReceipt: true,
    receiptTitle: companyName.value,
    uniformNumber: taxId.value,
    isNeedFlightList: isSummary.value
} : {
    isNeedReceipt: false,
    receiptTitle: '',
    uniformNumber: '',
    isNeedFlightList: false
},

assistanceInfo: isSpecialNeed.value ? {
    isNeedAssistance: true,
    description: specialNeedsText.value
} : {
    isNeedAssistance: false,
    description: ''
},

isAgreedToTheTerms: isAgreedToTheTerms.value
}

  // Build itineraries from segments array
  bookingStore.segments.forEach((segment, segmentIndex) => {
    if (segment && segment.sectors && segment.sectors.length > 0) {
      const itinerary = {
        order: segmentIndex + 1,
        departureAirportCode: segment.header.departureAirportCode,
        arrivalAirportCode: segment.header.arrivalAirportCode,
        sectors: segment.sectors.map((sector: Sector, index: number) => ({
          order: index + 1,
          departureAirportCode: sector.departureAirportCode,
          arrivalAirportCode: sector.arrivalAirportCode,
          departureAirportName: sector.departureAirportName,
          arrivalAirportName: sector.arrivalAirportName,
          departureDate: formatDateWithYYYYMMDD(sector.departureDate),
          departureTime: sector.departureTime,
          arrivalDate: formatDateWithYYYYMMDD(sector.arrivalDate),
          arrivalTime: sector.arrivalTime,
          marketingAirlineCode: sector.marketingAirlineCode,
          marketingAirlineName: sector.marketingAirlineName,
          flightNo: sector.flightNo,
          bookingClass: sector.bookingClass || 'Y',
          cabinType: sector.cabinType
        }))
      }
      bookingData.itineraries.push(itinerary)
    }
  })

  booking(bookingData)
    .then(response => {
      if (response.data.head.code === 0) {
        console.log('Booking successful:', response.data);
        
        bookingStore.setBookingResult({
          bookingData: response.data.data,  // API 回應中的 data 欄位
          itineraries: bookingData.itineraries,
          passengers: bookingData.passengers
        });

        bookingStore.saveBookingData()
        
        step.value = 3
      } else {
        console.error('Booking API error:', response.data.head.message);
        bookingError.value = response.data.head.message || '訂單提交失敗，請檢查您的資料。';
      }
    isSubmitting.value = false;
    })
    .catch(error => {
      console.error('Booking request failed:', error);
      let errorMessage = '訂單提交失敗，請稍後再試';
      if (error.response?.data?.head?.message) {
        errorMessage = error.response.data.head.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      bookingError.value = errorMessage;
        isSubmitting.value = false;
    })
}

watch(
  () => bookingStore.searchParams,
  (params) => {
    const list: any[] = []
    
    if (!params || (params.adults === 0 && params.children === 0 && params.infants === 0)) {
      passengers.value = [
        { 
          id: '1', type: 'adult', passengerType: 'ADT', lastName: '', firstName: '', gender: 'male', birthDate: null, birthDateText: '', nationality: 'TW'
        , documentType: 0, documentNumber: '22222222', documentExpiryDate: '2035-12-31', documentExpiryDateText: '2035-12-31' 
      }
      ]
      return
    }
    
    let id = 1
    
    // 成人 (ADT)
    for (let i = 0; i < (params.adults || 0); i++) {
      list.push({
        id: String(id++),
        type: 'adult',
        passengerType: 'ADT',
        lastName: '',
        firstName: '',
        gender: 'male',
        birthDate: null,
        birthDateText: '',
        nationality: 'TW',
        documentType: 0,
        documentNumber: '22222222',
        documentExpiryDate: '2035-12-31',
        documentExpiryDateText: '2035-12-31'
      })
    }
    
    // 兒童 (CHD)
    for (let i = 0; i < (params.children || 0); i++) {
      list.push({
        id: String(id++),
        type: 'child',
        passengerType: 'CHD',
        lastName: '',
        firstName: '',
        gender: 'male',
        birthDate: null,
        birthDateText: '',
        nationality: 'TW',
        documentType: 0,
        documentNumber: '22222222',
        documentExpiryDate: '2035-12-31',
        documentExpiryDateText: '2035-12-31'
      })
    }
    
    // 嬰兒 (INF)
    for (let i = 0; i < (params.infants || 0); i++) {
      list.push({
        id: String(id++),
        type: 'infant',
        passengerType: 'INF',
        lastName: '',
        firstName: '',
        gender: 'male',
        birthDate: null,
        birthDateText: '',
        nationality: 'TW',
        documentType: 0,
        documentNumber: '22222222',
        documentExpiryDate: '2035-12-31',
        documentExpiryDateText: '2035-12-31'
      })
    }
    
    passengers.value = list
  },
  { immediate: true, deep: true }
)

window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
});
</script>