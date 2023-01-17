<template>
    <div class="footer-wrapper">
        <div class="footer-main-content">
            <div class="logo">
                <img :src="`./img/${imgSrc}`" />
            </div>
            <div class="site-content">
                <p>Поставщики</p>
                <a v-for="supplier in suppliers">
                    {{ supplier }}
                </a>
            </div>
            <div class="site-content">
                <p>Магазин</p>
                <a v-for="category in categories">
                    {{ category }}
                </a>
            </div>
            <div class="site-content">
                <p>Сервисные центры</p>
                <a v-for="center in serviceCenters">
                    {{ center }}
                </a>
            </div>
        </div>
        <div class="copyright-wrapper">
            <div class="copyright">©2010-2022 ”Ньютон М” </div>
            <div class="address">
                <p>Тольятти, ул. Дзержинского 12, оф. 10</p>
                <p>ИНН 6321459534, КПП 632101001</p>
                <p>Телефон: +7 (499) 455 1670</p>
            </div>
        </div>

    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            imgSrc: "logo.svg",
            suppliers: [
                "Поставщик1",
                "Поставщик2"
            ],
            categories:[

            ],
            serviceCenters:[

            ]
        }
    },
    methods: {
        test() {
            console.log("Hello world!");
        }
    }
})
</script>
<style scoped>
.footer-wrapper {
    display: flex;
    flex-direction: column;
    background: #161616;
}



.footer-main-content {
    display: flex;
    justify-content: space-evenly;
    padding: 0 12%;
}

.logo {
    max-width: fit-content;
}

.site-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.site-content > p, a {
    font-family: 'Noto Sans';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 25px;
    text-align: center;
    color: #FFFFFF;

}
.copyright-wrapper{
    display: flex;
    justify-content: space-around;
}
.copyright{
    display: flex;
    align-items: center;
    flex-grow: 1;
    justify-content: center;
    color: #FFFFFF;
}
</style>