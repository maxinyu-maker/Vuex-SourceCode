import { inject, reactive } from 'vue'

export function forEachValue(obj, fn) {
    Object.keys(obj).forEach(key => fn(obj[key], key))
}

//创建一个容器，返回一个store
const storeKey = 'store';

class Store {
    constructor(options) {
        //Vuex3 内部会创造一个vue实例，但是 Vuex4 直接采用 vue3 提供的响应式方法
        const store = this;
        store._state = reactive({ data: options.state }) //reactive是为了后面是配replaceState

        const getters = options.getters; //{double:function => getter} 所以getter存在在Object.defineProperty

        store._getters = {}

        forEachValue(getters, function(fn, key) {
            Object.defineProperty(store._getters, key, {
                get: () => fn(store.state) //computed因为组件销毁会被移除，所以不能使用(这种写法存在性能问题，值没改变
            })
        })
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