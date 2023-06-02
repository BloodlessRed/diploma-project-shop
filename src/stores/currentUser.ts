import type { SupabaseClient, User } from "@supabase/supabase-js";
import { defineStore } from "pinia";
import { inject } from "vue";

export const useCurrentUserStore = defineStore("currentUser", {
  state: () => {
    return {
      supabaseUser: {} as User,
      userInfo: {} as any,
      role: "",
      supabase: {} as SupabaseClient,
    };
  },
  actions: {
    // Save the user object into the supabaseUser variable
    setNewUser(user: User) {
      this.supabaseUser = user;
      console.log("store user - ", this.supabaseUser);
      this.role = this.supabaseUser?.user_metadata?.role;
      console.log("user role - ", this.role);
      this.setUserInfo();
    },
    // Get the relevant info on the user from the managers or clients tables
    async setUserInfo() {
      if (this.supabase == undefined) {
        console.log("no supabase was injected");
        return;
      }
      console.log("strange supabase, ",this.supabase)
      if (this.role === "manager") {
        console.log("getting info in store");
        const { data, error } = await this.supabase
          .from("Managers")
          .select("*")
          .eq("login", this.supabaseUser?.email)
          .single();
        if (error) {
          console.error(error);
        } else {
          // Save the user info to the userInfo variable
          this.userInfo = data;
          console.log("saved data for user info - ", this.userInfo);
        }
      } else if (this.role === "client") {
        const { data, error } = await this.supabase
          .from("Companies")
          .select("*")
          .eq("login", this.supabaseUser?.email)
          .single();
        if (error) {
          console.error(error);
        } else {
          // Save the user info to the userInfo variable
          this.userInfo = data;
        }
      }
    },
  },
  persist: {
    key: "user-session-storage",
    storage: sessionStorage,
    //paths: ["supabaseUser", "userInfo", "role"],
    afterRestore(context) {
      context.store.$state.supabase = inject("supabase");
      console.log("After restoration ", context);
    },
  },
});
