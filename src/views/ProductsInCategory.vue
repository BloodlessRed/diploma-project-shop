<template>
    <div class="main-wrapper">
        <div class="products">
            <div class="item" v-for="product in category">
                <img :src="`./img/${product.img}`" />
                <p>{{ product.name }}</p>
                <router-link :to="{name: 'Product', params: {category:categoryName, product:product.prodLink}}">
                    <div class="to-product-box">
                        <p> Read more </p>
                    </div>
                </router-link>
            </div>
        </div>
        <div class="search-box">
            <img :src="`./img/manufacturer-line.svg`" />
            <div class="filter">
                <h3>Производитель</h3>
                <ul>
                    <li>Атлас</li>
                    <li>GSE</li>
                    <li>Ingersoll</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    computed: {
        category(): { img: string; name: string; prodLink: string }[] {
            console.log(this.$route.params.category)
            let routeParameter: string = this.$route.params.category.toString();
            if (routeParameter == "Nutrunners") {
                return [
                    {
                        img: "cable-pic-proto.svg",
                        name: "Atlas Copco 4220-0982-15 15 meter Cable",
                        prodLink: "STUB"
                    },
                    {
                        img: "cable-pic-proto.svg",
                        name: "Atlas Copco 4220-0982-15 15 meter Cable",
                        prodLink: "STUB"
                    },
                    {
                        img: "cable-pic-proto.svg",
                        name: "Atlas Copco 4220-0982-15 15 meter Cable",
                        prodLink: "STUB"
                    },
                    {
                        img: "cable-pic-proto.svg",
                        name: "Atlas Copco 4220-0982-15 15 meter Cable",
                        prodLink: "STUB"
                    },
                    {
                        img: "cable-pic-proto.svg",
                        name: "Atlas Copco 4220-0982-15 15 meter Cable",
                        prodLink: "STUB"
                    },
                    {
                        img: "cable-pic-proto.svg",
                        name: "Atlas Copco 4220-0982-15 15 meter Cable",
                        prodLink: "STUB"
                    },
                    {
                        img: "cable-pic-proto.svg",
                        name: "Atlas Copco 4220-0982-15 15 meter Cable",
                        prodLink: "STUB"
                    },
                    {
                        img: "cable-pic-proto.svg",
                        name: "Atlas Copco 4220-0982-15 15 meter Cable",
                        prodLink: "STUB"
                    }
                ]
            } else if (routeParameter == "SecondaryMarket") {
                return [
                    {
                        img: "cable-pic-proto.svg",
                        name: "Second market Atlas Copco 4220-0982-15 15 meter Cable",
                        prodLink: "STUB"
                    },
                    {
                        img: "cable-pic-proto.svg",
                        name: "Second market Atlas Copco 4220-0982-15 15 meter Cable",
                        prodLink: "STUB"
                    },
                    {
                        img: "cable-pic-proto.svg",
                        name: "Second market Atlas Copco 4220-0982-15 15 meter Cable",
                        prodLink: "STUB"
                    }
                ]
            }
            return [{ img: "null", name: "null", prodLink: "null" }];
        },
        categoryName(): string {
            console.log(this.$route.params);
            return this.$route.params.category.toString();
        }
    },
    data() {
        return {

        }
    }

})
</script>
<style scoped>
.main-wrapper {
    height: 100%;
    display: flex;
    /* justify-content: stretch; */
    padding: 50px 220px
}

.products {
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    flex: 1;
}


.item img {
    height: auto;
    width: auto;
}

.item p {
    font-family: 'Noto Sans';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    /* line-height: 19px; */

    text-align: center;

    color: #000000;

}

.item div:last-child {
    background: #E5E5E5;
    border-radius: 4px;
}

.search-box {
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 24px;
    isolation: isolate;

    background: #FFFFFF;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), inset 0px 0px 4px rgba(0, 0, 0, 0.25);
}

.filter {
    padding: 0px 0px 3px 10px;
}

</style>