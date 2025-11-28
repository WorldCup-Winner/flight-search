<template>
    <footer class="relative bg-primary-gold text-white py-10 px-6 md:py-[80px] md:px-[120px]">
        <div class="mx-auto flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-10">
            <!-- Left Section -->
            <div>
                <!-- Logo -->
                <div class="flex justify-center md:justify-start mb-6 md:mb-10">
                    <img src="@/assets/imgs/footer-logo.svg" alt="GalileeTours" class="h-12 md:h-15 w-auto" />
                </div>

                <!-- Info text -->
                <p class="text-sm mb-8 md:mb-10">
                    旅遊產品由 加利利旅行社股份有限公司 提供<br />
                    交觀綜00464 品保北1001
                </p>

                <!-- Contact section -->
                <div>
                    <div class="flex items-center mb-12 md:mb-2">
                        <h3 class="text-sm text-white font-semibold pr-3 tracking-wider">CONTACT US</h3>
                        <div class="flex-1 md:flex-none md:w-40 h-px bg-white/60"></div>
                    </div>
                    <div class="space-y-1 text-sm">
                        <p>代表人： 彭榮富</p>
                        <p>統一編號： 97125272</p>
                        <p>代表號： 02-2717-3188</p>
                        <p>電子郵箱： <a href="mailto:fit@galilee.com.tw" class="hover:underline">fit@galilee.com.tw</a></p>
                    </div>
                </div>

                <!-- Divider: mobile only -->
                <div class="h-px bg-white/60 mt-12 md:hidden"></div>
            </div>

            <!-- Right Section -->
            <div class="flex flex-col md:flex-row md:justify-end">
                <!-- Vertical divider: desktop only -->
                <div class="bg-white h-full w-px mr-[60px] hidden md:block"></div>
                
                <div class="flex flex-col">
                    <!-- Social Icons: order-last on mobile, order-first on desktop -->
                    <div class="flex space-x-8 md:space-x-[25px] order-last md:order-first mt-10 md:mt-0 md:mb-6">
                        <a href="#" aria-label="Facebook">
                            <div class="w-8 h-8 bg-white hover:bg-others-gray9
                                [mask-image:url('@/assets/imgs/icon-facebook.svg')] 
                                [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] 
                                [-webkit-mask-image:url('@/assets/imgs/icon-facebook.svg')]">
                            </div>
                        </a>
                        <a href="#" aria-label="Instagram">
                            <div class="w-8 h-8 bg-white hover:bg-others-gray9
                                [mask-image:url('@/assets/imgs/icon-instagram.svg')] 
                                [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] 
                                [-webkit-mask-image:url('@/assets/imgs/icon-instagram.svg')]">
                            </div>
                        </a>
                        <a href="#" aria-label="Line">
                            <div class="w-8 h-8 bg-white hover:bg-others-gray9
                                [mask-image:url('@/assets/imgs/icon-line.svg')] 
                                [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] 
                                [-webkit-mask-image:url('@/assets/imgs/icon-line.svg')]">
                            </div>
                        </a>
                    </div>
                    
                    <!-- Links -->
                    <div class="flex flex-col space-y-2 text-sm md:text-base">
                        <a href="#" class="hover:underline">機票訂購常見問題Q&A</a>
                        <a href="#" class="hover:underline">Virtuoso奢華飯店預訂</a>
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
