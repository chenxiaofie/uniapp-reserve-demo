export {}

declare module 'vue' {
  type Hooks = App.AppInstance & Page.PageInstance
  interface ComponentCustomOptions extends Hooks {}
}

declare module 'uview-plus' {
  import { App } from 'vue'
  
  interface UViewPlus {
    install(app: App): void
  }
  
  const uviewPlus: UViewPlus
  export default uviewPlus
}