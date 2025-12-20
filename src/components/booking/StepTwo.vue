<template>
    <div class="max-w-6xl w-full mx-auto py-16">
        <div class="grid grid-cols-12 gap-3">
            <div class="col-span-12 md:col-span-9 items-center justify-between mx-6 md:mx-0 pb-32 md:pb-0">
                <div class=" relative mt-[0px] w-full">
                    <div v-if="!loading">
                        <div class="w-full md:bg-white md:rounded-t-[10px] md:drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] flex items-center gap-2 text-others-gray7 text-base md:text-[17px] px-4 md:px-10 py-4 font-bold">
                            <!-- Display all segments in the route -->
                            <template v-if="bookingStore.segments.length > 0 && !bookingStore.isRoundTrip">
                                <template v-for="(segment, index) in bookingStore.segments" :key="index">
                                    <span>{{ getSegmentDeparture(segment) }}</span>
                                    <img src="@/assets/imgs/arrow-right.svg" />
                                    <span>{{ getLastSegmentArrival(segment) }}</span>
                                    <span v-if="index < bookingStore.segments.length - 1" class="mx-2 text-divider-medium">|</span>
                                </template>
                            </template>

                          <!-- Fallback for old data structure -->
                          <template v-else-if="bookingStore.segments.length > 0 && bookingStore.isRoundTrip">
                              <span>{{ getSegmentDeparture(bookingStore.segments[0]) || '出發地' }}</span>
                              <img v-if="bookingStore.isRoundTrip" src="@/assets/imgs/arrow-both.svg" />
                              <img v-else src="@/assets/imgs/arrow-right.svg" />
                              <span>{{ getSegmentDeparture(bookingStore.segments[1]) || '目的地' }}</span>
                          </template>
                        </div>
                    </div>

                    <div v-else>
                        <div class="w-full md:bg-white md:rounded-t-[10px] md:drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] flex items-center gap-2 text-others-gray7 text-[17px] px-10 py-4 font-bold">
                            加载中...
                        </div>
                    </div>

                    <div class="bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] md:rounded-none">
                      <!-- Mobile: BookingHeaderStrip -->
                      <div class="md:hidden py-4 px-4">
                          <div v-for="(segment, segmentIndex) in bookingStore.segments" :key="segmentIndex" class="relative w-full">
                              <BookingHeaderStrip
                                  :current-leg="segmentIndex === 0 ? 'outbound' : 'return'"
                                  :segment-title="getSegmentTitle(segmentIndex)"
                                  :date-text="segment.sectors[0]?.departureDate || ''"
                                  :origin="getHeaderStripOrigin(segment)"
                                  :destination="getHeaderStripDestination(segment)"
                                  :no-margin="segmentIndex > 0"
                              />
                          </div>
                      </div>

                      <!-- Desktop: Original segment display -->
                      <div class="hidden md:block px-20 py-10">
                          <!-- Display segments based on trip type -->
                          <div v-for="(segment, segmentIndex) in bookingStore.segments" :key="segmentIndex" class="relative w-full mb-10">
                              <div class="space-x-10">
                                  <span class="px-5 py-3 rounded-[15px] rounded-br-none text-white bg-others-original">
                                      {{ getSegmentTitle(segmentIndex) }}
                                  </span>
                                  <span class="text-others-gray7 text-[15px]">
                                      {{ formatDateToChineseWithWeek(segment.sectors[0]?.departureDate) }} 
                                      飛行時間 {{ toDuration(segment.sectors.reduce((sum: number, sec: any) => sum + sec.durationMinutes, 0) || 0)}}
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
                                              {{ sec.departureAirportCode }} {{ sec.departureAirportName }} {{ sec.departureTerminal }} {{  sec.departureCityName }}
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
                                              {{ sec.arrivalAirportCode }} {{ sec.arrivalAirportName }} {{ sec.arrivalTerminal }} {{ sec.arrivalCityName }}
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
                          class="relative grid grid-cols-12 gap-4 p-5 border-b last:border-b-0 border-others-gray3 md:bg-tb-body">
                          <div class="col-span-12 md:col-span-3 text-others-gray1 font-bold flex items-center justify-start md:justify-center">
                              {{ bookingStore.selectedFare.cabin }}
                          </div>
                          <ul class="col-span-12 md:col-span-9 space-y-2">
                              <li v-for="(n, i) in bookingStore.selectedFare.notes.filter(note => !note.text.includes('服務費'))" :key="i" class="flex items-center gap-2 text-others-gray1">
                                  <img :src="noteIcon(n.type, n.icon)" />
                                  <span class="text-[14px]">
                                  {{ n.text }}
                                  </span>
                              </li>
                          </ul>
                          <button class="hidden md:block absolute bottom-4 right-4 w-[200px] h-[40px] text-white bg-others-original rounded-[10px] text-[14px] cursor-pointer hover:bg-others-hover transition-colors" @click="openBaggageInfoAndFeeRule">行李資訊及票價規定</button>
                          <button class="md:hidden col-span-12 flex justify-start text-others-original font-weight-500 text-xs transition-all duration-300" @click="openBaggageInfoAndFeeRule">行李資訊及票價規定</button>
                        </div>
                    </div>
                </div>
                <div v-if="!authStore.isAuthenticated" class="relative mt-5 md:mt-[20px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-4 md:px-16 py-4 md:py-8 w-full">
                    <p class="absolute left-4 md:left-10 top-4 md:top-5 text-primary-gold font-bold">會員 / 訪客登入</p>
                    <div class="flex flex-col md:flex-row md:justify-between gap-4 md:gap-5 items-start md:items-center text-others-gray1 pt-8">
                        <p>若您曾參加過加利利旅行社團體即為會員，可利用會員登入進行訂購；非會員亦可使用訪客身分，完成手機號碼認證即可下單。 </p>
                        <button
                            class="px-4 py-1 w-[93px] h-[40px] rounded-md border-none bg-others-original text-white hover:bg-others-hover transition"
                            @click="openDialog('signin')">
                            登入
                        </button>
                    </div>
                </div>
                <div class="relative mt-5 md:mt-[20px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-4 md:px-16 py-4 md:py-8 w-full">
                  <div class="flex justify-between items-center">  
                    <p class="left-4 md:left-10 text-primary-gold font-bold">旅客名單</p>
                    <button type="button" class ="flex items-center right-4 cursor-pointer text-primary-gold font-bold gap-2" @click="isShowNameExample = true">
                      <p class="text-sm">姓名填寫範例</p>
                      <p class="text-lg">&gt;</p>
                    </button>
                  </div>
                    <div class="pt-8">
                        <div v-for="(p, idx) in passengers" :key="idx" class="mb-8">
                            <p class="font-bold">旅客{{idx + 1}} ({{ p.type === 'adult' ? '成人' : p.type === 'child' ? '兒童' : '嬰兒' }})</p>
                            <div class="grid grid-cols-12 justify-between gap-x-2 md:gap-x-5 items-center text-others-gray1" >
                                <div class="relative col-span-12 md:col-span-3 mb-4">
                                    <label class="block mb-1 text-others-gray1">姓氏</label>
                                    <input
                                        v-model="p.lastName"
                                        type="text"
                                        placeholder="英文姓 例：SMITH"
                                        :class="[
                                            'w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none',
                                            getPassengerNameError(p.id, 'lastName')
                                                ? 'border-text-error focus:ring-text-error'
                                                : 'border-primary-gold focus:ring-others-original'
                                        ]"
                                        @blur="handleNameBlur(p, 'lastName')"
                                    />
                                    <p v-if="getPassengerNameError(p.id, 'lastName')" class="text-text-error text-sm mt-1">
                                        {{ getPassengerNameError(p.id, 'lastName') }}
                                    </p>
                                </div>
                                <div class="relative col-span-12 md:col-span-3 mb-4">
                                    <label class="block mb-1 text-others-gray1">名字</label>
                                    <input
                                        v-model="p.firstName"
                                        type="text" 
                                        placeholder="英文名 例：JOHN"
                                        :class="[
                                            'w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none',
                                            getPassengerNameError(p.id, 'firstName')
                                                ? 'border-text-error focus:ring-text-error'
                                                : 'border-primary-gold focus:ring-others-original'
                                        ]"
                                        @blur="handleNameBlur(p, 'firstName')"
                                    />
                                    <p v-if="getPassengerNameError(p.id, 'firstName')" class="text-text-error text-sm mt-1">
                                        {{ getPassengerNameError(p.id, 'firstName') }}
                                    </p>
                                </div>
                                <div class="relative col-span-12 md:col-span-3 mb-4">
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
                                <div class="relative col-span-12 md:col-span-3 mb-4" :class="{'pb-6': getPassengerBirthDateError(p.id)}">
                                    <label class="block mb-1 text-others-gray1">出生日期</label>
                                    <input
                                        type="text"
                                        placeholder="請選擇"
                                        v-model="p.birthDateText"
                                        :class="[
                                            'w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none',
                                            getPassengerBirthDateError(p.id)
                                                ? 'border-text-error focus:ring-text-error'
                                                : 'border-primary-gold focus:ring-others-original'
                                        ]"
                                        @focus="toggleDatePicker($event, p, 'birthDate')"
                                        @blur="handleBirthDateBlur(p)"
                                        />
                                    <p v-if="getPassengerBirthDateError(p.id)" class="absolute left-0 top-full mt-1 text-text-error text-sm">
                                        {{ getPassengerBirthDateError(p.id) }}
                                    </p>

                                        <transition name="fade-scale">
                                            <teleport to="body">
                                                <div
                                                v-if="isDatePickerOpen"
                                                ref="datePopoverRef"
                                                class="fixed z-[10000]"
                                                :style="popoverStyle"
                                                @click.stop
                                                >
                                                <DatePicker
                                                    :modelValue="datePickerModelValue"
                                                    :min="datePickerMinDate"
                                                    :max="datePickerMaxDate"
                                                    :singleMonth="true"
                                                    :compact="true"
                                                    :mobileConfirm="false"
                                                    @apply="handleSingleDateApply"
                                                    @close="closeDatePicker"
                                                />
                                                </div>
                                            </teleport>
                                        </transition>
                                </div>
                                <div class="relative col-span-12 md:col-span-3 mb-4">
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
                                <!-- <div class="relative grid-cols-12 md:col-span-3 mb-4">
                                    <label class="block mb-1 text-others-gray1">證件類型</label>
                                    <div class="relative">
                                        <select v-model="p.documentType" class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none appearance-none bg-transparent cursor-pointer">
                                            <option :value="0">護照</option>
                                            <option :value="1">身分證</option>
                                        </select>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                            class="text-primary-goldpointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M18 10l-6 6-6-6" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="relative grid-cols-12 md:col-span-3 mb-4">
                                    <label class="block mb-1 text-others-gray1">證件號碼</label>
                                    <input v-model="p.documentNumber" type="text" placeholder="請輸入證件號碼" class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                                </div>
                                <div class="relative grid-cols-12 md:col-span-3 mb-4">
                                    <label class="block mb-1 text-others-gray1">證件有效日期</label>
                                    <input type="text" placeholder="請選擇" v-model="p.documentExpiryDateText" @focus="toggleDatePicker($event, p, 'documentExpiryDate')" class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                                </div> -->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="relative mt-5 md:mt-[20px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-4 md:px-16 py-4 md:py-8 w-full">
                    <p class="absolute left-4 md:left-10 top-4 md:top-5 text-primary-gold font-bold">主要聯絡人</p>
                    <div class="grid grid-cols-12 justify-between gap-x-2 md:gap-x-5 items-center text-others-gray1 pt-8">
                        <div class="relative col-span-12 md:col-span-4 mb-4">
                            <label class="block mb-1 text-others-gray1">聯絡人姓氏</label>
                            <input 
                                v-model="contactLastName"
                                type="text" 
                                placeholder="中文姓 例：王"
                                :disabled="isContactLastNameLocked"
                                :class="[
                                    'w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none',
                                    isContactLastNameLocked ? 'bg-gray-100 cursor-not-allowed' : ''
                                ]"
                                @focus="handleContactFieldFocus" />
                        </div>
                        <div class="relative col-span-12 md:col-span-4 mb-4">
                            <label class="block mb-1 text-others-gray1">聯絡人名字</label>
                            <input 
                                v-model="contactFirstName"
                                type="text" 
                                placeholder="中文名 例：小明"
                                :disabled="isContactFirstNameLocked"
                                :class="[
                                    'w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none',
                                    isContactFirstNameLocked ? 'bg-gray-100 cursor-not-allowed' : ''
                                ]"
                                @focus="handleContactFieldFocus" />
                        </div>
                        <div class="relative col-span-12 md:col-span-4 mb-4">
                            <label class="block mb-1 text-others-gray1">聯絡人性別</label>
                            <div class="relative">
                                <select
                                    v-model="contactGender"
                                    placeholder="請選擇"
                                    :disabled="isContactGenderLocked"
                                    :class="[
                                        'w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none appearance-none bg-transparent',
                                        isContactGenderLocked ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'
                                    ]"
                                    aria-label="Contact Gender"
                                    @mousedown="handleContactFieldFocus"
                                    @focus="handleContactFieldFocus"
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
                        <div class="relative col-span-12 md:col-span-6 mb-4" :class="{ 'pb-6': phoneError }">
                            <label class="block mb-1 text-others-gray1">聯絡手機</label>
                            <PhoneField 
                                v-model="phoneNumber" 
                                v-model:countryCode="code"
                                :codes="phoneCodes" 
                                :show-eye="false"
                                :default-visible="true"
                                :disabled="isContactPhoneLocked"
                                @focus="handleContactFieldFocus"
                                @blur="handlePhoneBlur"
                            />
                            <p v-if="phoneError" class="absolute left-0 top-full mt-1 text-text-error text-sm">
                                {{ phoneError }}
                            </p>
                        </div>
                        <div class="relative col-span-12 md:col-span-6 mb-4" :class="{ 'pb-6': emailError }">
                            <label class="block mb-1 text-others-gray1">聯絡email</label>
                            <input 
                                v-model="contactEmail"
                                type="text" 
                                placeholder="必填"
                                :disabled="isContactEmailLocked"
                                :class="[
                                    'w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none',
                                    emailError
                                        ? 'border-text-error focus:ring-text-error'
                                        : 'border-primary-gold focus:ring-others-original',
                                    isContactEmailLocked ? 'bg-gray-100 cursor-not-allowed' : ''
                                ]"
                                @focus="handleContactFieldFocus"
                                @blur="handleEmailBlur"
                            />
                            <p v-if="emailError" class="absolute left-0 top-full mt-1 text-text-error text-sm">
                                {{ emailError }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="relative mt-5 md:mt-[20px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-4 md:px-10 py-4 md:py-8 w-full">
                    <p class="text-primary-gold font-bold">代收轉付收據</p>
                    <p class="mb-1 text-others-gray1 pt-4">旅遊業依法開立「代收轉付收據」，不另開統一發票，付款後以email提供。</p>
                    <p class="mb-1 text-others-original">若行程取消或更動，為保障消費者權益，同意授權本公司代為處理銷貨退回或折讓證明單。</p>
                    <div class="flex flex-col md:flex-row md:items-center mt-5 gap-2 md:gap-5">
                        <p class="text-others-gray1 font-semibold">是否開立抬頭或統編？</p>
                        <div class="flex gap-5" role="radiogroup" aria-label="是否索取發票">
                            <div class="relative w-fit">
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
                            <div class="relative w-fit">
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
                        <div class="grid grid-cols-12 justify-between gap-x-2 md:gap-x-5 items-center text-others-gray1 pt-4">
                            <div class="relative col-span-12 md:col-span-6 mb-4">
                                <label class="block mb-1 text-others-gray1">公司名稱</label>
                                <input 
                                    v-model="companyName"
                                    type="text" 
                                    placeholder="請填公司全名"
                                    class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                            </div>
                            <div class="relative col-span-12 md:col-span-6 mb-4">
                                <label class="block mb-1 text-others-gray1">統一編號</label>
                                <input 
                                    v-model="taxId"
                                    type="text" 
                                    placeholder="請填統一編號"
                                    class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row md:items-center mt-5 gap-2 md:gap-5">
                        <p class="text-others-gray1 font-semibold">收據內容摘要</p>
                        <div class="flex flex-col md:flex-row gap-2 md:gap-5" role="radiogroup" aria-label="收據內容摘要">
                            <div class="relative w-fit">
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
                                            bg-divider-soft text-primary-gold transition-color duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                列出航班資訊
                                </label>
                            </div>
                            <div class="relative w-fit">
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
                                            bg-divider-soft text-primary-gold transition duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                僅開立「機票款」三個字
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="relative mt-5 md:mt-[20px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-4 md:px-10 py-4 md:py-8 w-full">
                    <p class="text-primary-gold font-bold">特殊協力事項</p>
                    <p class="block mb-1 text-others-gray1 pt-4">若您有特殊餐、輪椅等特殊需求，加利利旅遊將代為轉達，實際供應依航空公司為準，敬請見諒。</p>
                    <div class="flex flex-col md:flex-row md:items-center mt-5 gap-2 md:gap-5">
                        <p class="text-others-gray1 font-semibold">是否有特殊需求？</p>
                        <div class="flex gap-2 md:gap-5" role="radiogroup" aria-label="是否有特殊需求">
                            <div class="relative w-fit">
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
                            <div class="relative w-fit">
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
                            class="w-full h-[120px] mt-4 px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none"
                        ></textarea>
                    </div>
                </div>
            </div>
            <div class="hidden md:block md:col-span-3 rounded-[10px] bg-white p-6 drop-shadow-[0px_2px_30px_rgba(0,0,0,0.1)] md:p-4 w-full h-fit">
                <div class="space-y-3">
                    <!-- Adult section -->
                    <div v-if="adultTotal > 0" class="space-y-2">
                        <div class="flex items-baseline justify-between text-primary-gold font-semibold">
                            <span>成人機票總額</span>
                            <div class="flex items-end">
                                {{ currency }} {{ formatPrice(adultTotal) }}
                            </div>
                        </div>
                        <div
                            v-for="(line, idx) in effectiveLines.filter(l => l.label.includes('成人'))"
                            :key="'adult-' + idx"
                            class="flex justify-between text-others-gray1 pl-4"
                        >
                            <span>{{ line.label }}</span>
                            <div class="flex items-end">
                                {{ currency }} {{ formatPrice(line.amount) }} x {{ line.qty ?? 1 }}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Child section -->
                    <div v-if="childTotal > 0" class="space-y-2">
                        <div class="flex items-baseline justify-between text-primary-gold font-semibold">
                            <span>兒童機票總額</span>
                            <div class="flex items-end">
                                {{ currency }} {{ formatPrice(childTotal) }}
                            </div>
                        </div>
                        <div
                            v-for="(line, idx) in effectiveLines.filter(l => l.label.includes('兒童'))"
                            :key="'child-' + idx"
                            class="flex justify-between text-others-gray1 pl-4"
                        >
                            <span>{{ line.label }}</span>
                            <div class="flex items-end">
                                {{ currency }} {{ formatPrice(line.amount) }} x {{ line.qty ?? 1 }}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Infant section -->
                    <div v-if="infantTotal > 0" class="space-y-2">
                        <div class="flex items-baseline justify-between text-primary-gold font-semibold">
                            <span>嬰兒機票總額</span>
                            <div class="flex items-end">
                                {{ currency }} {{ formatPrice(infantTotal) }}
                            </div>
                        </div>
                        <div
                            v-for="(line, idx) in effectiveLines.filter(l => l.label.includes('嬰兒'))"
                            :key="'infant-' + idx"
                            class="flex justify-between text-others-gray1 pl-4"
                        >
                            <span>{{ line.label }}</span>
                            <div class="flex items-end">
                                {{ currency }} {{ formatPrice(line.amount) }} x {{ line.qty ?? 1 }}
                            </div>
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
                <!-- Agreement -->
                <div class="mt-10 flex gap-2 items-start text-sm text-slate-600 select-none">                        
                    <label class="flex mt-[3px] items-center cursor-pointer relative">
                    <input type="checkbox"
                        class="peer w-4 h-4 cursor-pointer transition-all appearance-none rounded-none hover:shadow-md border-[1px] border-primary-gold checked:bg-primary-gold"
                        id="check" v-model="agreed" />
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
                        」(含個資聲明）並同意其內容
                    </span>
                </div>
                <!-- Submit button -->
                <button
                    class="mt-6 w-full rounded-[10px] bg-others-original py-3 font-semibold text-white hover:bg-others-hover disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    :disabled="isSubmitting"
                    @click="emitSubmit"
                    >
                    <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{{ isSubmitting ? '處理中...' : '送出訂單' }}</span>
                </button>
              </div>
        </div>
        <!-- Modal -->
        <transition name="fade">
            <div v-if="activeDialog" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[100]"
                @click.self="closeDialog">
                <div class="bg-white rounded-tl-[60px] rounded-tr-[60px] rounded-bl-[60px] shadow-lg px-6 py-8 md:px-[90px] md:py-[60px] relative w-[90%] md:w-auto max-w-md md:max-w-none max-h-[90vh] overflow-y-auto md:overflow-visible">
                <SignIn v-if="activeDialog === 'signin'" @close="closeDialog" />
                <SignUp v-else-if="activeDialog === 'signup'" />
                </div>
            </div>
        </transition>
    </div>
    <Transition name="fade">
        <WakeUp v-if="isOpenWakeUp" />
    </Transition>
    <Transition name="fade">
        <BookingInstruction :open="isOpenBookingInstruction" @close="isOpenBookingInstruction = false" />
    </Transition>
    <BaggageInfoAndFeeRule 
      :open="sharedValue.isOpenBaggageInfoAndFeeRule" 
      :fareRuleData="sharedValue.fareRuleData"
      @close="sharedValue.isOpenBaggageInfoAndFeeRule = false" 
    />
    <transition name="fade">
        <div v-if="bookingError" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[100]" @click.self="bookingError = null">
            <div class="flex flex-col items-center justify-center w-[400px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-16 py-8">
                <img src="@/assets/imgs/alert-price-change.png" class="w-20 h-20 mb-4" />
                <h3 class="text-others-gray1 text-h3 md:text-h3-d mb-2">{{ bookingError.title || '訂單提交失敗' }}</h3>
                <p class="text-others-gray1 text-center mb-6">{{ bookingError.message }}</p>
                <button
                  class="mt-6 px-4 py-1 w-[93px] h-[40px] rounded-md border-none bg-others-original text-white hover:bg-others-hover transition"
                  @click="bookingError = null"
                >
                  確認
                </button>
            </div>
        </div>
    </transition>
    <Transition name="fade">
        <ThankYou v-if="showThankYouDialog" @close="showThankYouDialog = false" />
    </Transition>
    <Transition name="fade">
        <ReviewPassengers 
            v-if="showReviewPassengers" 
            :passengers="reviewPassengersList" 
            @confirm="proceedWithBooking" 
            @cancel="showReviewPassengers = false" 
        />
    </Transition>
    <Transition name="fade">
        <BookingInProgress v-if="showBookingInProgress" :passengers="reviewPassengersList" />
    </Transition>
    <!-- Mobile sticky price summary -->
    <StepTwoMobilePriceSummary
      :title-label="titleLabel"
      :total-label="totalLabel"
      :currency="currency"
      :effective-lines="effectiveLines"
      :effective-total="effectiveTotal"
      :adult-total="adultTotal"
      :child-total="childTotal"
      :infant-total="infantTotal"
      v-model:agreed="agreed"
      :is-submitting="isSubmitting"
      @submit="emitSubmit"
      @open-booking-instruction="isOpenBookingInstruction = true"
    />
    </div>
    <NameExampleModal :open="isShowNameExample" @close="isShowNameExample = false" />
</template>
<script setup lang="ts">
import { provide, computed, onBeforeUnmount, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate, formatPrice, noteIcon, toDuration, formatDateToChinese } from '@/utils'
import { booking, getPhoneCodes, getNationality } from '@/api'
import { useBookingStore } from '@/stores/booking'
import { useAuthStore } from '@/stores/auth'
import NameExampleModal from '@/components/ui/modals/NameExampleModal.vue'

import SignIn from "@/components/auth/SignIn.vue"
import SignUp from "@/components/auth/SignUp.vue"
import WakeUp from "@/components/ui/feedback/WakeUp.vue"
import BookingInstruction from '@/components/ui/booking/BookingInstruction.vue'
import BaggageInfoAndFeeRule from '@/components/ui/booking/BaggageInfoAndFeeRule.vue'
import BookingHeaderStrip from '@/components/booking/BookingHeaderStrip.vue'
import StepTwoMobilePriceSummary from '@/components/booking/StepTwoMobilePriceSummary.vue'
import ThankYou from '@/components/ui/feedback/ThankYou.vue'
import ReviewPassengers from '@/components/ui/booking/ReviewPassengers.vue'
import BookingInProgress from '@/components/ui/booking/BookingInProgress.vue'

import type { BookingRequestViewModel } from '@/utils/types'
import PhoneField from '@/components/ui/forms/PhoneField.vue'
import DatePicker from '@/components/ui/pickers/DatePicker.vue'

// Airline logo utility
import { resolveAirlineLogo, onAirlineImageError, AirlineDefault } from '@/utils/airlineLogo'

// 使用 BookingStore 取得訂票資料
const bookingStore = useBookingStore()
const authStore = useAuthStore()

/** Image error handler */
const onImageError = (event: Event) => {
onAirlineImageError(event)
}

// Same type as grandparent
interface SharedData {
isOpenBaggageInfoAndFeeRule: boolean,
fareRuleData?: any,
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

// 格式化去程日期和飛行時間
const formatOutboundDate = computed(() => {
// 優先從航段資料中取得實際的起飛日期
const firstSector = bookingStore.outboundSegment?.sectors?.[0]
if (firstSector?.departureDate) {
  try {
    const date = new Date(firstSector.departureDate)
    if (!isNaN(date.getTime())) return formatDate(date)
  } catch (e) {
    console.error('Error parsing outbound date:', e)
  }
}

// Fallback: 使用搜尋參數中的日期
const dateStr = bookingStore.searchParams?.departureDate
if (!dateStr) return '日期未設定'
try {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '日期格式錯誤'
  return formatDate(date)
} catch {
  return '日期格式錯誤'
}
})

const formatOutboundDuration = computed(() => {
const minutes = bookingStore.outboundSegment?.sectors.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) || 0
return toDuration(minutes)
})

// 格式化回程日期和飛行時間
const formatReturnDate = computed(() => {
// 優先從航段資料中取得實際的起飛日期
const firstSector = bookingStore.returnSegment?.sectors?.[0]
if (firstSector?.departureDate) {
  try {
    const date = new Date(firstSector.departureDate)
    if (!isNaN(date.getTime())) return formatDate(date)
  } catch (e) {
    console.error('Error parsing return date:', e)
  }
}

// Fallback: 使用搜尋參數中的日期
const dateStr = bookingStore.searchParams?.returnDate
if (!dateStr) return '日期未設定'
try {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '日期格式錯誤'
  return formatDate(date)
} catch {
  return '日期格式錯誤'
}
})

const formatReturnDuration = computed(() => {
const minutes = bookingStore.returnSegment?.sectors.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) || 0
return toDuration(minutes)
})

// 格式化多行程航段日期
function formatSegmentDate(segment: any) {
const firstSector = segment?.sectors?.[0]
if (firstSector?.departureDate) {
  try {
    const date = new Date(firstSector.departureDate)
    if (!isNaN(date.getTime())) return formatDate(date)
  } catch (e) {
    console.error('Error parsing segment date:', e)
  }
}
return '日期未設定'
}

// 格式化多行程航段飛行時間
function formatSegmentDuration(segment: any) {
const minutes = segment?.sectors?.reduce((sum: number, s: any) => sum + (s.durationMinutes || 0), 0) || 0
return toDuration(minutes)
}

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

// Helper function to get arrival city from last sector of a segment
function getLastSegmentArrival(segment: any): string {
if (segment?.sectors && segment.sectors.length > 0) {
  const lastSector = segment.sectors[segment.sectors.length - 1]
  return lastSector.arrivalCityName || lastSector.arrivalAirportName || '目的地'
}
return '目的地'
}

// Helper function to get origin for HeaderStrip
function getHeaderStripOrigin(segment: any): { name: string; code: string } {
  if (segment?.sectors && segment.sectors.length > 0) {
    const firstSector = segment.sectors[0]
    return {
      name: firstSector.departureCityName || firstSector.departureAirportName || '出發地',
      code: firstSector.departureAirportCode || ''
    }
  }
  return { name: '出發地', code: '' }
}

// Helper function to get destination for HeaderStrip
function getHeaderStripDestination(segment: any): { name: string; code: string } {
  if (segment?.sectors && segment.sectors.length > 0) {
    const lastSector = segment.sectors[segment.sectors.length - 1]
    return {
      name: lastSector.arrivalCityName || lastSector.arrivalAirportName || '目的地',
      code: lastSector.arrivalAirportCode || ''
    }
  }
  return { name: '目的地', code: '' }
}

// Format date to Chinese with week day
function formatDateToChineseWithWeek(dateStr: string): string {
if (!dateStr) return ''
try {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''
  
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = weekdays[date.getDay()]
  
  return `${year}年${month}月${day}日 (${weekday})`
} catch (e) {
  console.error('Error formatting date:', e)
  return ''
}
}

// Airline logo helper (using existing resolveAirlineLogo)
function airlineLogoFor(sector: any): string | undefined {
if (!sector?.marketingAirlineCode) return undefined
return resolveAirlineLogo(sector.marketingAirlineCode)
}

// 根據 searchParams 動態產生旅客名單
const passengers = ref<any[]>([])

watch(
() => bookingStore.searchParams,
(params) => {
  const list: any[] = []
  
  if (!params || (params.adults === 0 && params.children === 0 && params.infants === 0)) {
    // Fallback: 預設一位成人
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
if (!activeDateField.value || !activeDateField.value.passenger) return;

const field = activeDateField.value.field;
const passenger = activeDateField.value.passenger;

if (field === 'birthDate') {
  passenger.birthDate = d;
  passenger.birthDateText = formatDate(d);
  // Validate birth date after selection
  handleBirthDateBlur(passenger)
} else if (field === 'documentExpiryDate') {
  passenger.documentExpiryDate = d;
  passenger.documentExpiryDateText = formatDate(d);
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
  currency: { type: String, default: 'TWD' },
  locale: { type: String, default: 'zh-TW' },
  titleLabel: { type: String, default: '成人機票總額' },
  totalLabel: { type: String, default: '應付總額' },
  termsUrl: { type: String, default: '#' },
  lines: {
      type: Array<Line>,
      default: () => ([])
  },
})

// Step navigation now handled by router (no longer using v-model:step)
const router = useRouter()

const activeDialog = ref(null)
const isReceipt = ref(false)
const isSummary = ref(false)
const isSpecialNeed = ref(false)
const isOpenWakeUp = ref(false)
const isOpenBookingInstruction = ref(false)

const code  = ref('+886')
const phoneNumber  = ref('')
const phoneCodes = ref<Array<{ label: string; value: string }>>([
{ label: '台灣 (+886)', value: '+886' },
])
const nationalities = ref<Array<{
  countryCode: string,
  countryNameZh: string
}>>([])

// 聯絡人資訊
const contactFirstName = ref('')
const contactLastName = ref('')
const contactGender = ref('male')
const contactEmail = ref('')

// Computed properties to determine if fields should be disabled
// Only lock fields that have valid data from auth store
const isContactFirstNameLocked = computed(() => {
  // 對會員檢查 isAuthenticated，對訪客只檢查 isGuest
  if (!authStore.isAuthenticated && !authStore.isGuest) return false
  const user = authStore.user
  return !!(user.firstName && user.firstName.trim())
})

const isContactLastNameLocked = computed(() => {
  // 對會員檢查 isAuthenticated，對訪客只檢查 isGuest
  if (!authStore.isAuthenticated && !authStore.isGuest) return false
  const user = authStore.user
  return !!(user.lastName && user.lastName.trim())
})

const isContactGenderLocked = computed(() => {
  // 訪客不鎖定性別欄位（訪客驗證時沒有提供性別）
  if (authStore.isGuest) return false
  if (!authStore.isAuthenticated) return false
  const user = authStore.user
  // Only lock if gender is valid
  const gender = user.gender
  return gender === "1" || gender === "2" || gender === 1 || gender === 2
})

const isContactPhoneLocked = computed(() => {
  // 對會員檢查 isAuthenticated，對訪客只檢查 isGuest
  if (!authStore.isAuthenticated && !authStore.isGuest) return false
  const user = authStore.user
  return !!(user.phone && user.phone.trim())
})

const isContactEmailLocked = computed(() => {
  if (!authStore.isAuthenticated) return false
  // Only lock email for members with valid email
  if (!authStore.isMember) return false
  const user = authStore.user
  return !!(user.email && user.email.trim())
})

// Legacy computed for backward compatibility
const isContactInfoLocked = computed(() => isContactPhoneLocked.value)

// Function to auto-fill contact info from auth store
function fillContactInfoFromAuth() {
  // 對會員檢查 isAuthenticated（包含 token 驗證）
  // 對訪客只檢查 isGuest（訪客沒有 JWT token）
  if (!authStore.isAuthenticated && !authStore.isGuest) return
  
  const user = authStore.user
  
  // For members: fill all fields (姓氏、名字、性別、手機、email)
  if (authStore.isMember) {
      if (user.firstName) contactFirstName.value = user.firstName
      if (user.lastName) contactLastName.value = user.lastName
      const gender = user.gender
      if (gender === "1" || gender === 1) {
          contactGender.value = 'male'
      } else if (gender === "2" || gender === 2) {
          contactGender.value = 'female'
      }
      // If gender is "0" or 0 or undefined, leave it editable (don't set)
      if (user.phone) phoneNumber.value = user.phone
      if (user.countryCode) code.value = user.countryCode
      if (user.email) contactEmail.value = user.email
  }
  // For guests: fill only (姓氏、名字、手機) - 簡訊驗證通過後填入
  else if (authStore.isGuest) {
      if (user.firstName) contactFirstName.value = user.firstName
      if (user.lastName) contactLastName.value = user.lastName
      if (user.phone) phoneNumber.value = user.phone
      if (user.countryCode) code.value = user.countryCode
  }
}

// 發票資訊
const companyName = ref('')
const taxId = ref('')

// 特殊需求
const specialNeedsText = ref('')

const openDialog = (type: any) => { activeDialog.value = type }
const closeDialog = () => { activeDialog.value = null }

// Handle contact field focus - check if user is logged in
function handleContactFieldFocus(event: FocusEvent | MouseEvent) {
  if (!authStore.isAuthenticated && !authStore.isGuest) {
    event.preventDefault()
    const target = event.target as HTMLElement
    if ('blur' in target) {
      target.blur()
    }
    openDialog('signin')
  }
}

// Handle edit search - blank for now
function handleEditSearch() {
  // TODO: Implement edit search functionality
}

// Track if we're waiting for login to complete booking
const pendingBookingAfterLogin = ref(false)

const agreed = ref(false)
const bookingError = ref<{ title: string; message: string } | null>(null)
const isSubmitting = ref(false)

// Passenger name validation errors
const passengerNameErrors = ref<Record<string, { lastName?: string; firstName?: string }>>({})

// Passenger birth date validation errors
const passengerBirthDateErrors = ref<Record<string, string | null>>({})

// Contact info validation errors
const phoneError = ref<string | null>(null)
const emailError = ref<string | null>(null)
const showThankYouDialog = ref(false)
const showReviewPassengers = ref(false)
const showBookingInProgress = ref(false)
const currency = computed(() => props.currency ?? 'TWD')
const loading = ref(true)

// Format passengers for review dialog
const reviewPassengersList = computed(() => {
return passengers.value.map(p => ({
  lastName: p.lastName,
  firstName: p.firstName,
  gender: p.gender,
  type: p.type
}))
})

// 從 fare-rule 資料計算真實的總額明細
const realLines = computed(() => {
const fareSummary = bookingStore.fareRuleData?.fareSummary
if (!fareSummary || fareSummary.length === 0) {
  // 如果沒有 fare-rule 資料，使用預設值
  return [
    { label: '成人票價', amount: 0, qty: bookingStore.searchParams?.adults || 1 },
    { label: '成人稅與費用', amount: 0, qty: bookingStore.searchParams?.adults || 1 }
  ]
}

const lines: Line[] = []
fareSummary.forEach(summary => {
  const passengerType = summary.passengerType
  const qty = passengerType === 'ADT' ? (bookingStore.searchParams?.adults || 1) : 
             passengerType === 'CNN' ? (bookingStore.searchParams?.children || 0) : 
             passengerType === 'INF' ? (bookingStore.searchParams?.infants || 0) : 1

  if (qty > 0) {
    const passengerLabel = passengerType === 'ADT' ? '成人' : passengerType === 'CNN' ? '兒童' : '嬰兒'
    
    // 計算不含稅票價 = 含稅價 - 稅額
    const fareWithoutTax = summary.price - summary.taxAmount
    
    // 顯示票價（不含稅）
    lines.push({
      label: `${passengerLabel}票價`,
      amount: fareWithoutTax,
      qty: qty
    })

    // 顯示稅與費用
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

// 使用真實資料計算總額，如果沒有則使用 props
const effectiveLines = computed(() => {
return realLines.value.length > 0 && realLines.value.some(line => line.amount > 0) ? realLines.value : props.lines
})

const effectiveTotal = computed(() => {
return effectiveLines.value.reduce((sum: number, l: Line) => sum + (Number(l.amount) * (Number(l.qty ?? 1))), 0)
})

// 計算各類別乘客的總額
const adultTotal = computed(() => {
  return effectiveLines.value
    .filter(line => line.label.includes('成人'))
    .reduce((sum: number, l: Line) => sum + (Number(l.amount) * (Number(l.qty ?? 1))), 0)
})

const childTotal = computed(() => {
  return effectiveLines.value
    .filter(line => line.label.includes('兒童'))
    .reduce((sum: number, l: Line) => sum + (Number(l.amount) * (Number(l.qty ?? 1))), 0)
})

const infantTotal = computed(() => {
  return effectiveLines.value
    .filter(line => line.label.includes('嬰兒'))
    .reduce((sum: number, l: Line) => sum + (Number(l.amount) * (Number(l.qty ?? 1))), 0)
})

// Passport name validation functions
function validatePassportName(name: string): { isValid: boolean; error?: string } {
if (!name || name.trim().length === 0) {
  return { isValid: true } // Empty is handled by required validation
}

// Check if contains only English letters (after removing spaces)
const lettersOnly = /^[A-Za-z]+$/
const cleaned = name.replace(/\s/g, '')

if (!lettersOnly.test(cleaned)) {
  return {
    isValid: false,
    error: '請填英文,不可含空格和其它符號'
  }
}

return { isValid: true }
}

function handleNameBlur(passenger: any, field: 'firstName' | 'lastName') {
const value = passenger[field] || ''

// Remove spaces and convert to uppercase
const cleaned = value.replace(/\s/g, '').toUpperCase()
passenger[field] = cleaned

// Validate
const validation = validatePassportName(cleaned)

if (!passengerNameErrors.value[passenger.id]) {
  passengerNameErrors.value[passenger.id] = {}
}

if (validation.isValid) {
  delete passengerNameErrors.value[passenger.id]?.[field]
} else {
  passengerNameErrors.value[passenger.id][field] = validation.error
}
}

function getPassengerNameError(passengerId: string, field: 'firstName' | 'lastName'): string | undefined {
return passengerNameErrors.value[passengerId]?.[field]
}

function getPassengerBirthDateError(passengerId: string): string | null {
return passengerBirthDateErrors.value[passengerId] || null
}

// Get departure date from booking store
function getDepartureDate(): Date | null {
// Try to get from first segment's first sector
if (bookingStore.segments.length > 0 && bookingStore.segments[0].sectors?.length > 0) {
  const departureDateStr = bookingStore.segments[0].sectors[0].departureDate
  if (departureDateStr) {
    const date = new Date(departureDateStr)
    if (!isNaN(date.getTime())) {
      return date
    }
  }
}

// Fallback to search params
if (bookingStore.searchParams?.departureDate) {
  const date = new Date(bookingStore.searchParams.departureDate)
  if (!isNaN(date.getTime())) {
    return date
  }
}

return null
}

// Calculate age in years based on birth date and departure date
function calculateAge(birthDate: Date, departureDate: Date): number {
let age = departureDate.getFullYear() - birthDate.getFullYear()
const monthDiff = departureDate.getMonth() - birthDate.getMonth()

if (monthDiff < 0 || (monthDiff === 0 && departureDate.getDate() < birthDate.getDate())) {
  age--
}

return age
}

// Validate birth date against passenger type
function validateBirthDate(passenger: any): string | null {
if (!passenger.birthDate) {
  return null // Let required validation handle empty dates
}

const departureDate = getDepartureDate()
if (!departureDate) {
  return null // Can't validate without departure date
}

const birthDate = new Date(passenger.birthDate)
if (isNaN(birthDate.getTime())) {
  return '出生日期格式錯誤'
}

const age = calculateAge(birthDate, departureDate)

// Adult ticket: must be 12 years or older (12-18 requires adult companion, validated separately)
if (passenger.type === 'adult') {
  if (age < 12) {
    if (age >= 2 && age < 12) {
      return '此出生日期為2-12歲，應購買兒童票'
    } else if (age < 2) {
      return '此出生日期為2歲以下，應購買嬰兒票'
    }
    return '成人票出生日期必須在出發日期時年滿12歲'
  }
  // Age 12-18 is allowed for adult tickets, but requires adult companion (validated in submit)
}

// Child ticket: must be 2-12 years old
if (passenger.type === 'child') {
  if (age < 2) {
    return '此出生日期為2歲以下，應購買嬰兒票'
  } else if (age >= 12) {
    if (age >= 18) {
      return '此出生日期為18歲以上，應購買成人票'
    } else {
      return '此出生日期為12-18歲，應購買成人票（需至少一位成人陪同）'
    }
  }
}

// Infant ticket: must be under 2 years old
if (passenger.type === 'infant') {
  if (age >= 2) {
    if (age >= 12 && age < 18) {
      return '此出生日期為12-18歲，應購買成人票（需至少一位成人陪同）'
    } else if (age >= 2 && age < 12) {
      return '此出生日期為2-12歲，應購買兒童票'
    } else {
      return '此出生日期為18歲以上，應購買成人票'
    }
  }
}

return null // Valid
}

// Handle birth date blur/change
function handleBirthDateBlur(passenger: any) {
const error = validateBirthDate(passenger)
if (error) {
  passengerBirthDateErrors.value[passenger.id] = error
} else {
  delete passengerBirthDateErrors.value[passenger.id]
}
}

// Phone number validation
function validatePhoneNumber(phone: string, countryCode: string): { isValid: boolean; error?: string } {
if (!phone || phone.trim().length === 0) {
  return { isValid: true } // Empty is handled by required validation
}

// Only validate for Taiwanese phones (+886)
if (countryCode === '+886') {
  // Remove spaces and dashes for validation
  const cleaned = phone.replace(/[\s-]/g, '')
  
  // Check if it's numeric
  if (!/^\d+$/.test(cleaned)) {
    return {
      isValid: false,
      error: '格式有誤，請檢查'
    }
  }
  
  // Check if it's 09 followed by 8 digits (10 digits total) or 9 followed by 8 digits (9 digits total)
  if (!/^09\d{8}$/.test(cleaned) && !/^9\d{8}$/.test(cleaned)) {
    return {
      isValid: false,
      error: '格式有誤，請檢查'
    }
  }
}

return { isValid: true }
}

// Email validation
function validateEmail(email: string): { isValid: boolean; error?: string } {
if (!email || email.trim().length === 0) {
  return { isValid: true } // Empty is handled by required validation
}

// Standard email format regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

if (!emailRegex.test(email)) {
  return {
    isValid: false,
    error: '格式有誤，請檢查'
  }
}

return { isValid: true }
}

function handlePhoneBlur() {
const validation = validatePhoneNumber(phoneNumber.value, code.value)
phoneError.value = validation.isValid ? null : (validation.error || null)
}

function handleEmailBlur() {
const validation = validateEmail(contactEmail.value)
emailError.value = validation.isValid ? null : (validation.error || null)
}

// Watch country code changes to re-validate phone
watch(code, () => {
if (phoneNumber.value) {
  handlePhoneBlur()
}
})

function emitSubmit() {
// TODO_BOOKING_API: 此函式準備並送出訂位 API 請求
// 部分欄位使用硬編碼資料（參考 docs/booking-api-sample-data.json）
// 詳細說明請參考: docs/ai-notes/booking-api-missing-fields-analysis.md

// 檢查使用者是否已登入或驗證（會員或訪客）
if (!authStore.isAuthenticated && !authStore.isGuest) {
  // 標記需要登入後繼續訂購
  pendingBookingAfterLogin.value = true
  // 開啟登入視窗
  openDialog('signin')
  return
}

// 驗證必填欄位
if (!agreed.value) {
  // Show ThankYou dialog to remind user to agree to terms
  showThankYouDialog.value = true
  return
}

// 檢查聯絡人資訊是否完整
if (!contactFirstName.value || !contactLastName.value || !contactEmail.value || !phoneNumber.value) {
  bookingError.value = {
    title: '訂單提交失敗',
    message: '請填寫完整的聯絡人資訊'
  };
  return
}

// 驗證手機號碼格式
const phoneValidation = validatePhoneNumber(phoneNumber.value, code.value)
if (!phoneValidation.isValid) {
  phoneError.value = phoneValidation.error || null
  bookingError.value = {
    title: '訂單提交失敗',
    message: '聯絡手機格式有誤，請檢查'
  };
  return
}

// 驗證Email格式
const emailValidation = validateEmail(contactEmail.value)
if (!emailValidation.isValid) {
  emailError.value = emailValidation.error || null
  bookingError.value = {
    title: '訂單提交失敗',
    message: '聯絡email格式有誤，請檢查'
  };
  return
}

// 檢查發票資訊是否完整（如果選擇要開立發票）
if (isReceipt.value && (!companyName.value || !taxId.value)) {
  bookingError.value = {
    title: '訂單提交失敗',
    message: '請填寫完整的發票資訊'
  };
  return
}

// 檢查特殊需求是否已填寫（如果選擇有特殊需求）
if (isSpecialNeed.value && !specialNeedsText.value.trim()) {
  bookingError.value = {
    title: '訂單提交失敗',
    message: '請描述您的特殊需求'
  };
  return
}

// 檢查乘客姓名格式（只允許英文字母，無空格和其他符號）
const invalidNamePassengers: string[] = []
passengers.value.forEach((p, index) => {
  // Auto-clean names: remove spaces and convert to uppercase
  if (p.lastName) {
    p.lastName = p.lastName.replace(/\s/g, '').toUpperCase()
  }
  if (p.firstName) {
    p.firstName = p.firstName.replace(/\s/g, '').toUpperCase()
  }
  
  const lastNameValidation = validatePassportName(p.lastName)
  const firstNameValidation = validatePassportName(p.firstName)
  
  if (!lastNameValidation.isValid || !firstNameValidation.isValid) {
    invalidNamePassengers.push(`旅客${index + 1}`)
    
    // Set error state for display
    if (!passengerNameErrors.value[p.id]) {
      passengerNameErrors.value[p.id] = {}
    }
    if (!lastNameValidation.isValid) {
      passengerNameErrors.value[p.id].lastName = lastNameValidation.error
    }
    if (!firstNameValidation.isValid) {
      passengerNameErrors.value[p.id].firstName = firstNameValidation.error
    }
  }
})

if (invalidNamePassengers.length > 0) {
  bookingError.value = {
    title: '訂單提交失敗',
    message: `${invalidNamePassengers.join('、')}的姓名格式不正確，請填英文,不可含空格和其它符號`
  };
  return
}

// 驗證乘客出生日期是否符合票種
const invalidBirthDatePassengers: string[] = []
const departureDate = getDepartureDate()

if (!departureDate) {
  bookingError.value = {
    title: '訂單提交失敗',
    message: '無法取得出發日期，請重新選擇航班'
  };
  return
}

// Check for minor adults (12-18) and ensure they have at least one adult (18+) companion
let hasAdultCompanion = false
const minorAdults: string[] = []

passengers.value.forEach((p, index) => {
  // Validate birth date for each passenger
  const error = validateBirthDate(p)
  if (error) {
    invalidBirthDatePassengers.push(`旅客${index + 1}`)
    passengerBirthDateErrors.value[p.id] = error
  } else {
    delete passengerBirthDateErrors.value[p.id]
    
    // Check if this is an actual adult (18+)
    if (p.type === 'adult' && p.birthDate) {
      const birthDate = new Date(p.birthDate)
      if (!isNaN(birthDate.getTime())) {
        const age = calculateAge(birthDate, departureDate)
        if (age >= 18) {
          hasAdultCompanion = true
        } else if (age >= 12 && age < 18) {
          minorAdults.push(`旅客${index + 1}`)
        }
      }
    }
  }
})

// Check if minor adults have adult companion
if (minorAdults.length > 0 && !hasAdultCompanion) {
  bookingError.value = {
    title: '訂單提交失敗',
    message: `${minorAdults.join('、')}為12-18歲，必須至少有一位18歲以上的成人陪同`
  };
  return
}

if (invalidBirthDatePassengers.length > 0) {
  bookingError.value = {
    title: '訂單提交失敗',
    message: `${invalidBirthDatePassengers.join('、')}的出生日期與票種不符，請檢查`
  };
  return
}

// 檢查乘客資訊是否完整
const incompletePassengers = passengers.value.filter(p => 
  !p.lastName.trim() || 
  !p.firstName.trim() || 
  !p.birthDateText.trim() ||
  !p.documentNumber.trim() ||
  !p.documentExpiryDateText.trim()
)
if (incompletePassengers.length > 0) {
  bookingError.value = {
    title: '訂單提交失敗',
    message: '請填寫完整的乘客資訊，包含證件號碼與效期'
  };
  return
}

// Show review dialog first
showReviewPassengers.value = true
}

function proceedWithBooking() {
showReviewPassengers.value = false
isSubmitting.value = true
showBookingInProgress.value = true

// 準備訂單資料 - 轉換為 BookingRequestViewModel 格式
const bookingData: BookingRequestViewModel = {
  // 航程資訊 (itineraries)
  itineraries: [] as any[],

  // 乘客資訊 (passengers)
  passengers: passengers.value.map((p, index) => {
    // 根據旅客類型轉換為 API 規格的數字格式
    // API 規格: 0 = 成人 (ADT), 1 = 小孩 (CHD/INF)
    // 注意: 嬰兒 (INF) 的 passengerType 也是 1 (小孩)，但需要在 specialStatus 額外標記為 'INF'
    let passengerTypeValue = 0; // 預設成人
    if (p.passengerType === 'CHD' || p.passengerType === 'INF') {
      passengerTypeValue = 1; // 兒童或嬰兒都屬於「小孩」類型
    }

    return {
      order: index + 1,  // 乘客順序從 1 開始
      firstName: p.firstName,
      lastName: p.lastName,
      gender: p.gender === 'male' ? 0 : 1, // 0 = male, 1 = female
      dateOfBirth: formatBirthDate(p.birthDateText),
      nationality: p.nationality || 'TW',
      passengerType: passengerTypeValue,
      documentType: p.documentType,
      documentNumber: p.documentNumber,
      documentExpiryDate: formatBirthDate(p.documentExpiryDateText),
      mobileNumberCountryCode: code.value,
      mobileNumber: phoneNumber.value,
      email: contactEmail.value,
      isTheOrderer: index === 0,
      // TODO_BOOKING_API: 台胞證欄位 - 未來需要根據目的地（中國大陸）動態顯示 UI 欄位
      mainlandTravelPermitNumber: "11111111",  // 參考 sample data
      mainlandTravelPermitExpiryDate: "2028-12-01",  // 參考 sample data
      // TODO_BOOKING_API: 餐點偏好 - 未來可以加入特殊餐點選項（素食、兒童餐等）
      mealPreference: '',
      // TODO_BOOKING_API: 常客會員資訊 - 未來可以加入常客會員號碼欄位
      frequentFlyerNumber: '',
      frequentFlyerAirline: '',
      specialStatus: p.passengerType === 'INF' ? 'INF' : null
    }
  }),

  // 聯絡人資訊 (contactInfo)
  contactInfo: {
    firstNameOfContactPerson: contactFirstName.value,
    lastNameOfContactPerson: contactLastName.value,
    genderOfContactPerson: contactGender.value === 'male' ? 0 : 1, // 0 = male, 1 = female
    mobileNumberCountryCode: code.value,
    contactMobileNumber: phoneNumber.value,
    contactEmail: contactEmail.value,
    orderMethod: 0,
    // TODO_BOOKING_API: 註冊證件資訊 - 暫時使用範例資料，未來需要從會員系統或 UI 取得
    registrationIdType: 0,  // 0 = 護照
    registrationIdNumber: "Z123556767",  // 參考 sample data
    // TODO_BOOKING_API: 會員系統相關欄位 - 未來需要整合會員登入功能
    registrationPassword: '',
    mobileVerificationId: '',
    memberId: '',
    lineId: '',
    // TODO_BOOKING_API: 偏好聯絡方式 - 未來可以加入 UI 欄位 (0=電話, 1=email, 2=Line 等)
    preferredContactMethod: 1,  // 1 = email
    // TODO_BOOKING_API: 內部系統欄位 - 用於指派顧問或分店
    assignedLocationCode: '',
    assignedConsultantId: ''
  },

  // 發票資訊 (receiptInfo) - 可選
  receiptInfo: isReceipt.value ? {
    isNeedReceipt: true,
    receiptTitle: companyName.value,
    uniformNumber: taxId.value,
    isNeedFlightList: isSummary.value  // true=列出航班資訊, false=僅開立機票款三個字
  } : {
    isNeedReceipt: false,
    receiptTitle: '',
    uniformNumber: '',
    isNeedFlightList: isSummary.value  // 不論是否開立發票，都傳遞用戶選擇的選項
  },

  // 特殊需求資訊 (assistanceInfo) - 可選
  assistanceInfo: isSpecialNeed.value ? {
    isNeedAssistance: true,
    description: specialNeedsText.value
  } : {
    isNeedAssistance: false,
    description: ''
  },

  // 同意狀態
  isAgreedToTheTerms: agreed.value
}

// 取得最後一段行程的 validatingAirlineCode 和 itineraryRBDs
// 根據 API 文件說明：這些欄位應該來自最後一段行程 flight-search 結果中使用者選擇的航班
const lastSegment = bookingStore.segments[bookingStore.segments.length - 1]
if (lastSegment) {
  bookingData.validatingAirlineCode = lastSegment.validatingAirlineCode
  bookingData.itineraryRBDs = lastSegment.itineraryRBDs
}

console.log('BookingStore segments count:', bookingStore.segments.length)
console.log('Last segment validatingAirlineCode:', lastSegment?.validatingAirlineCode)
console.log('Last segment itineraryRBDs:', lastSegment?.itineraryRBDs)

// 建構航程資訊
// 判斷是否為多行程
if (bookingStore.isMultiTrip) {
  console.log('Processing multi-trip with', bookingStore.segments.length, 'segments')
  // 多行程：遍歷所有航段
  bookingStore.segments.forEach((segment, segmentIndex) => {
    if (segment && segment.sectors && segment.sectors.length > 0) {
      const itinerary = {
        order: segmentIndex + 1,
        departureAirportCode: segment.header.departureAirportCode,
        arrivalAirportCode: segment.header.arrivalAirportCode,
        sectors: segment.sectors.map((sector: any, index: number) => ({
          order: index + 1,
          departureAirportCode: sector.departureAirportCode,
          arrivalAirportCode: sector.arrivalAirportCode,
          departureDate: sector.departureDate,
          departureTime: sector.departureTime,
          arrivalDate: sector.arrivalDate,
          arrivalTime: sector.arrivalTime,
          marketingAirlineCode: sector.marketingAirlineCode,
          flightNo: sector.flightNo,
          // TODO_BOOKING_API: bookingClass 應該從 fareRuleData 或 selectedFare 中取得實際艙等
          // 目前預設為 'Y'，但實際應該使用選定票價的 bookingClass (如 'M', 'W' 等)
          bookingClass: sector.bookingClass || 'Y',
          cabinType: sector.cabinType
        }))
      }
      bookingData.itineraries.push(itinerary)
    }
  })
  console.log('Multi-trip itineraries built:', bookingData.itineraries.length)
} else {
  console.log('Processing single/round trip')
  // 單程/來回：使用原有邏輯
  let itineraryOrder = 1

  // 去程航程
  if (bookingStore.outboundSegment && bookingStore.outboundSegment.sectors && bookingStore.outboundSegment.sectors.length > 0) {
    const outboundItinerary = {
      order: itineraryOrder++,
      departureAirportCode: bookingStore.outboundSegment.header.departureAirportCode,
      arrivalAirportCode: bookingStore.outboundSegment.header.arrivalAirportCode,
      sectors: bookingStore.outboundSegment.sectors.map((sector: any, index: number) => ({
        order: index + 1,
        departureAirportCode: sector.departureAirportCode,
        arrivalAirportCode: sector.arrivalAirportCode,
        departureDate: sector.departureDate,
        departureTime: sector.departureTime,
        arrivalDate: sector.arrivalDate,
        arrivalTime: sector.arrivalTime,
        marketingAirlineCode: sector.marketingAirlineCode,
        flightNo: sector.flightNo,
        // TODO_BOOKING_API: bookingClass 應該從 fareRuleData 或 selectedFare 中取得實際艙等
        // 目前預設為 'Y'，但實際應該使用選定票價的 bookingClass (如 'M', 'W' 等)
        bookingClass: sector.bookingClass || 'Y',
        cabinType: sector.cabinType
      }))
    }
    bookingData.itineraries.push(outboundItinerary)
  }

  // 回程航程
  if (bookingStore.returnSegment && bookingStore.returnSegment.sectors && bookingStore.returnSegment.sectors.length > 0) {
    const returnItinerary = {
      order: itineraryOrder++,
      departureAirportCode: bookingStore.returnSegment.header.departureAirportCode,
      arrivalAirportCode: bookingStore.returnSegment.header.arrivalAirportCode,
      sectors: bookingStore.returnSegment.sectors.map((sector: any, index: number) => ({
        order: index + 1,
        departureAirportCode: sector.departureAirportCode,
        arrivalAirportCode: sector.arrivalAirportCode,
        departureDate: sector.departureDate,
        departureTime: sector.departureTime,
        arrivalDate: sector.arrivalDate,
        arrivalTime: sector.arrivalTime,
        marketingAirlineCode: sector.marketingAirlineCode,
        flightNo: sector.flightNo,
        // TODO_BOOKING_API: bookingClass 應該從 fareRuleData 或 selectedFare 中取得實際艙等
        bookingClass: sector.bookingClass || 'Y',
        cabinType: sector.cabinType
      }))
    }
    bookingData.itineraries.push(returnItinerary)
  }
}

console.log('=== Final Booking Data ===')
console.log('Trip Type:', bookingStore.searchParams?.tripType)
console.log('Segments count:', bookingStore.segments.length)
console.log('Itineraries count:', bookingData.itineraries.length)
console.log('validatingAirlineCode:', bookingData.validatingAirlineCode)
console.log('itineraryRBDs:', bookingData.itineraryRBDs)
console.log('Full booking data:', JSON.stringify(bookingData, null, 2))

// 呼叫 booking API
booking(bookingData)
  .then(response => {
    // 檢查業務邏輯錯誤碼 (head.code)
    if (response.data.head.code === 0) {
      console.log('Booking successful:', response.data);
      
      // 儲存訂票結果到 store
      // response.data.data 包含: pnrCode, orderNumber, totalAmount, orderUniqId, details[]
      bookingStore.setBookingResult({
        bookingData: response.data.data,  // API 回應中的 data 欄位
        itineraries: bookingData.itineraries,
        passengers: bookingData.passengers
      });
      
      // Navigate to step 3 (payment) using router
      router.push({ name: 'booking-step-3' })
    } else {
      // 業務邏輯錯誤處理
      console.error('Booking API error:', response.data.head);
      
      let title = '訂單提交失敗';
      let message = response.data.head.message || '訂單提交失敗，請檢查您的資料。';
      
      // 特別處理 code 500 且為航班已滿的情況
      if (response.data.head.code === 500) {
        const errorMsg = response.data.head.message || '';
        
        if (errorMsg.includes('AirSellFromRecommendation failed') || 
            errorMsg.includes('non-OK status') ||
            errorMsg.includes('segments have a non-OK status')) {
          title = '航班已滿';
          message = '趕快來找其他航班，可能有更好的價格呢！';
        }
      }
      
      bookingError.value = { title, message };
    }
  })
  .catch(error => {
    console.error('Booking request failed:', error);
    
    // HTTP 層級錯誤處理（網路錯誤、伺服器無回應等）
    let title = '訂單提交失敗';
    let message = '訂單提交失敗，請稍後再試';
    
    if (error.response?.data?.head?.message) {
      message = error.response.data.head.message;
    } else if (error.message) {
      message = error.message;
    }
    
    bookingError.value = { title, message };
  })
  .finally(() => {
    isSubmitting.value = false;
    showBookingInProgress.value = false;
  });
}

// Watch for authentication state changes - if user logs in while pending booking, proceed
watch(
() => authStore.isAuthenticated,
(isAuthenticated) => {
  if (isAuthenticated) {
    // Auto-fill contact info when user logs in
    fillContactInfoFromAuth()
    
    // Close login dialog when user logs in
    closeDialog()
    
    if (pendingBookingAfterLogin.value) {
      // Reset pending flag
      pendingBookingAfterLogin.value = false
      // Automatically proceed with booking submission
      // Use nextTick to ensure dialog is closed first
      setTimeout(() => {
        emitSubmit()
      }, 100)
    }
  }
}
)

// Watch for guest login (SMS verification)
watch(
() => authStore.isGuest,
(isGuest) => {
  if (isGuest) {
    // Auto-fill contact info when guest verifies
    fillContactInfoFromAuth()
    
    // Close login dialog when guest verifies
    closeDialog()
  }
}
)

window.scrollTo({
top: 0,
left: 0,
behavior: 'smooth'
});

function formatBirthDate(input: string): string {
// Accepts 'YYYY-MM-DD', 'YYYY/MM/DD', 'YYYYMMDD', etc. Returns 'YYYY-MM-DD'.
if (!input) return '';
// Remove all non-digit characters
const digits = input.replace(/[^\d]/g, '');
if (digits.length === 8) {
  return `${digits.slice(0,4)}-${digits.slice(4,6)}-${digits.slice(6,8)}`;
}
// If already in YYYY-MM-DD format, return as is
if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
// If in YYYY/MM/DD format
if (/^\d{4}\/\d{2}\/\d{2}$/.test(input)) return input.replace(/\//g, '-');
// Fallback: return input
return input;
}

// 從 API 取得國碼清單和國籍清單
onMounted(async () => {
// 載入 localStorage 中的訂票資料
bookingStore.getBookingData()

// Auto-fill contact info if user is already authenticated
fillContactInfoFromAuth()

try {
  const response = await getPhoneCodes()
  
  // 檢查 API 回應格式: { head: { code, message }, data: [...] }
  if (response.data?.head?.code === 0 && Array.isArray(response.data.data)) {
    // 轉換 API 資料為 PhoneField 所需的格式
    // API 回傳格式: { countryCode, countryNameZh, phoneCountryCode }
    phoneCodes.value = response.data.data
      .filter((item: any) => item.phoneCountryCode) // 過濾掉沒有電話國碼的項目
      .map((item: any) => ({
        label: `${item.countryNameZh || item.countryCode || ''} (${item.phoneCountryCode})`, // 顯示：國家名稱 (國碼)
        value: item.phoneCountryCode // 實際值：國碼
      }))
    
    // 如果有資料但目前的 code 不在清單中，設定預設值為 +886 或第一個
    if (phoneCodes.value.length > 0) {
      const hasCurrentCode = phoneCodes.value.some(c => c.value === code.value)
      if (!hasCurrentCode) {
        // 優先使用 +886，如果沒有則使用第一個
        const taiwan = phoneCodes.value.find(c => c.value === '+886')
        code.value = taiwan ? taiwan.value : phoneCodes.value[0].value
      }
    }
  } else {
    console.warn('Phone codes API returned invalid format:', response.data)
    // 使用預設值
    setDefaultPhoneCodes()
  }
  
} catch (error) {
  console.error('Failed to fetch phone codes:', error)
  // 如果 API 失敗，使用預設值
  setDefaultPhoneCodes()
}

// 從 API 取得國籍清單
try {
  const res = await getNationality()
  nationalities.value = res.data.data || []
} catch (error) {
  console.error('Error loading nationality list:', error)
}

loading.value = false
})

// 設定預設國碼清單
function setDefaultPhoneCodes() {
phoneCodes.value = [
  { label: '台灣 (+886)', value: '+886' },
  { label: '香港 (+852)', value: '+852' },
  { label: '日本 (+81)', value: '+81' },
  { label: '美國/加拿大 (+1)', value: '+1' },
]
}

// 從 API 取得國籍清單 (在 onMounted 中調用)

const isShowNameExample = ref(false)

</script>