declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
      $supabaseUrl: string;
      $supabaseKey: string;
    }
  }