import { inject, reactive } from 'vue'

//创建一个容器，返回一个store
const storeKey = 'store';

class Store {
    constructor(options) {
        const store = this;
        store._state = reactive({ data: options.state })
    }
    get state() {
        return this._state.data;
    }
    install(app, injectKey) { //createApp().use(store,'me')
        //全局暴露一个变量，暴露的是store的实例
        app.provide(injectKey || storeKey, this); //给根app增加一个provides,子组件会去向上查找
        app.config.globalProperties.$store = this; //增添$store属性($store.state.....)
    }
}

export function createStore(options) {
    return new Store(options)
}

export function useStore(injectKey = null) { //vue内部已经将这个些api导出来了
    return inject(injectKey !== null ? injectKey : storeKey)
}