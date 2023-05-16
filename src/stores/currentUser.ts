import { defineStore } from 'pinia';

export const useCurrentUserStore = defineStore('currentUser', () => {
    
    return {
        state:()=>{
            currentUser: ""
        }
    }
});
