<template>
    <div>
        {{ category}}
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    computed:{
        category(): string{
            return this.$route.params.categories.toString();
        }
    },
    data(){
        return{
            
        }
    }

})
</script>
<style>
    
</style>