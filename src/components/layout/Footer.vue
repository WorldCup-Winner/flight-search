<template>
    <footer class="relative bg-primary-gold text-white py-[80px] px-[120px]">
        <div class="mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            <!-- Left Section -->
            <div>
                <!-- Logos -->
                <div class="flex items-center space-x-5 mb-10">
                    <img src="@/assets/imgs/footer-logo.svg" alt="GalileeTours" class="h-15 w-auto" />
                </div>

                <p class="text-sm mb-10">
                    旅遊產品由 加利利旅行社股份有限公司 提供<br />
                    交觀綜00464 品保北1001
                </p>

                <div>
                    <div class="flex items-center mb-2">
                        <h3 class="text-sm text-white font-semibold pr-3">CONTACT US</h3>
                        <div class="w-40 h-px bg-white"></div>
                    </div>
                    <div class="space-y-1 text-sm">
                        <p>代表人： 彭榮富</p>
                        <p>統一編號: 97125272</p>
                        <p>代表號: 02-2717-3188</p>
                        <p>電子郵箱：<a href="mailto:fit@galilee.com.tw"
                                class="no-underline hover:underline">fit@galilee.com.tw</a></p>
                    </div>
                </div>
            </div>

            <!-- Right Section -->
            <div class="flex flex-row justify-end">
                <div class="bg-white h-full w-[1px] mr-[60px] hidden md:block"></div>
                <div class="flex flex-col">
                    <!-- Social Icons -->
                    <div class="flex space-x-[25px] mb-6">
                        <a href="#" aria-label="Facebook">
                            <div
                                class="w-8 h-8 bg-white
                                    [mask-image:url('@/assets/imgs/icon-facebook.svg')] 
                                    [mask-repeat:no-repeat] 
                                    [mask-position:center] 
                                    [mask-size:contain] 
                                    [-webkit-mask-image:url('@/assets/imgs/icon-facebook.svg')]
                                    hover:bg-[#FFF6DD]
                                    ">
                            </div>
                        </a>
                        <a href="#" aria-label="Instagram">
                            <div
                                class="w-8 h-8 bg-white
                                    [mask-image:url('@/assets/imgs/icon-instagram.svg')] 
                                    [mask-repeat:no-repeat] 
                                    [mask-position:center] 
                                    [mask-size:contain] 
                                    [-webkit-mask-image:url('@/assets/imgs/icon-instagram.svg')]
                                    hover:bg-[#FFF6DD]
                                    ">
                            </div>
                        </a>
                        <a href="#" aria-label="Line">
                            <div
                                class="w-8 h-8 bg-white
                                    [mask-image:url('@/assets/imgs/icon-line.svg')] 
                                    [mask-repeat:no-repeat] 
                                    [mask-position:center] 
                                    [mask-size:contain] 
                                    [-webkit-mask-image:url('@/assets/imgs/icon-line.svg')]
                                    hover:bg-[#FFF6DD]
                                    ">
                            </div>
                        </a>
                    </div>
                    <!-- Links -->
                    <div class="text-left flex flex-col">
                        <a href="#" class="hover:underline">機票訂購常見問題Q&A</a><br />
                        <a href="#" class="hover:underline">Virtuoso奢華飯店預訂</a><br />
                        <a href="#" class="hover:underline">旅遊顧問線上諮詢</a>
                    </div>
                </div>
            </div>
        </div>
        <Awesome />
    </footer>
</template>
<script setup>
import Awesome from "@/components/ui/Awesome.vue"
</script>