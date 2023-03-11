<template>
    <div class="main-wrapper">
        <div class="products">
            <div class="item" v-for="product in cmptd_category">
                <img :src="`./img/${product.img}`" />
                <p>{{product.name }}</p>
                <router-link :to="{name: 'Product', params: {category:categoryName, product_id:product.id}}">
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
    props:{
        category: {
            type: String,
            default:"no category selected"
        }
    },
    computed: {
        cmptd_category(): any[] {
            console.log(this.category)
            let routeParameter: string = this.category;
            let products: any = []
            if (routeParameter == "Nutrunners") {
                console.log(this.products)
                return this.products
            } else if (routeParameter == "SecondaryMarket") {
                return [
                    {
                        id:1,
                        img: "cable-pic-proto.svg",
                        name: "Second market Atlas Copco 4220-0982-15 15 meter Cable",
                        prodLink: "STUB"
                    },
                    {
                        id:2,
                        img: "cable-pic-proto.svg",
                        name: "Second market Atlas Copco 4220-0982-15 15 meter Cable",
                        prodLink: "STUB"
                    },
                    {
                        id:3,
                        img: "cable-pic-proto.svg",
                        name: "Second market Atlas Copco 4220-0982-15 15 meter Cable",
                        prodLink: "STUB"
                    }
                ]
            }
            return [{id:0, img: "null", name: "null", prodLink: "null" }];
        },
        categoryName(): string {
            console.log(this.$route.params);
            return this.category;
        }
    },
    data() {
        return {
            products: []
        }
    },
    mounted() {
        fetch("http://localhost:3000/"+this.category.charAt(0).toLowerCase() + this.category.slice(1))
                .then(res=>{return res.json()})
                .then(data=>{console.log(data); this.products = data})
                
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