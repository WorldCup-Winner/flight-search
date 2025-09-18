<template>
    <div class="w-72 bg-white rounded-xl shadow p-4 space-y-6">
        <!-- 自訂篩選 -->
        <div>
            <div class="flex justify-between items-center text-sm font-medium">
                <span>自訂篩選</span>
                <button class="text-orange-500 hover:underline">清除全部</button>
            </div>
            <label class="flex items-center mt-2 space-x-2 text-sm">
                <input type="checkbox" class="form-checkbox" />
                <span>提供學生航班</span>
            </label>
        </div>

        <!-- 直飛 / 轉機 -->
        <div>
            <div class="font-medium text-sm mb-2">直飛/轉機</div>
            <label class="flex items-center justify-between text-sm mb-2">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" class="form-checkbox" />
                    <span>直飛</span>
                </div>
                <span class="text-gray-600">TWD 5,545</span>
            </label>
            <label class="flex items-center justify-between text-sm">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" class="form-checkbox" />
                    <span>轉機 / 中停1次</span>
                </div>
                <span class="text-gray-600">TWD 8,545</span>
            </label>
        </div>

        <!-- 航空公司 (聯盟) -->
        <div>
            <div class="font-medium text-sm mb-2">航空公司</div>
            <div class="space-y-2">
                <div class="flex justify-between items-center text-sm">
                    <div class="flex items-center space-x-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/84/Oneworld_logo.svg" alt="oneworld"
                            class="w-5 h-5" />
                        <span>寰宇一家</span>
                    </div>
                    <span class="text-gray-600">TWD 8,545</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                    <div class="flex items-center space-x-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/SkyTeam_logo.svg" alt="skyteam"
                            class="w-5 h-5" />
                        <span>天合聯盟</span>
                    </div>
                    <span class="text-gray-600">TWD 9,345</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                    <div class="flex items-center space-x-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/8c/Star_Alliance_logo_2013.svg"
                            alt="star alliance" class="w-5 h-5" />
                        <span>星空聯盟</span>
                    </div>
                    <span class="text-gray-600">TWD 11,545</span>
                </div>
            </div>
        </div>

        <!-- 航空公司 (單獨) -->
        <div class="space-y-2">
            <label class="flex justify-between items-center text-sm">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" class="form-checkbox" />
                    <span>星宇航空</span>
                </div>
                <span class="text-gray-600">TWD 5,545</span>
            </label>
            <label class="flex justify-between items-center text-sm">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" class="form-checkbox" />
                    <span>台灣虎行</span>
                </div>
                <span class="text-gray-600">TWD 6,545</span>
            </label>
            <label class="flex justify-between items-center text-sm">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" class="form-checkbox" />
                    <span>捷星日本航空</span>
                </div>
                <span class="text-gray-600">TWD 6,745</span>
            </label>
            <label class="flex justify-between items-center text-sm">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" class="form-checkbox" />
                    <span>泰國獅子航空</span>
                </div>
                <span class="text-gray-600">TWD 7,145</span>
            </label>
            <label class="flex justify-between items-center text-sm">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" class="form-checkbox" />
                    <span>樂桃航空</span>
                </div>
                <span class="text-gray-600">TWD 8,545</span>
            </label>
            <label class="flex justify-between items-center text-sm">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" class="form-checkbox" />
                    <span>中華航空</span>
                </div>
                <span class="text-gray-600">TWD 8,845</span>
            </label>
            <button class="text-orange-500 text-sm hover:underline">顯示更多</button>
        </div>

        <!-- 起飛機場 -->
        <div>
            <div class="font-medium text-sm mb-2">起飛機場</div>
            <label class="flex justify-between items-center text-sm">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" class="form-checkbox" />
                    <span>泰國獅子航空</span>
                </div>
                <span class="text-gray-600">TWD 7,145</span>
            </label>
            <label class="flex justify-between items-center text-sm mt-2">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" class="form-checkbox" />
                    <span>樂桃航空</span>
                </div>
                <span class="text-gray-600">TWD 8,545</span>
            </label>
        </div>

        <!-- 到達機場 -->
        <div>
            <div class="font-medium text-sm mb-2">到達機場</div>
            <label class="flex justify-between items-center text-sm">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" class="form-checkbox" />
                    <span>泰國獅子航空</span>
                </div>
                <span class="text-gray-600">TWD 7,145</span>
            </label>
        </div>

        <!-- 起飛時間 -->
        <div>
            <div class="font-medium text-sm mb-2">起飛時間</div>
            <input type="range" min="0" max="24" class="w-full accent-orange-500" />
            <div class="text-xs text-gray-500 mt-1">00:00 - 23:59</div>
        </div>

        <!-- 到達時間 -->
        <div>
            <div class="font-medium text-sm mb-2">到達時間</div>
            <input type="range" min="0" max="24" class="w-full accent-orange-500" />
            <div class="text-xs text-gray-500 mt-1">00:00 - 23:59</div>
        </div>
    </div>
</template>

<script setup>
</script>
