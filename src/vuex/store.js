import { reactive } from 'vue'
import { forEachValue } from './utils'
import { storeKey } from './injectKey'

//创建一个容器，返回一个store
export default class Store {
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
            //mutation action {add:function}  {asyncAdd:function}
            //commit('add') dispatch('asyncAdd')    所以：本质就是发布订阅者模式
        store._mutations = Object.create(null);
        store._actions = Object.create(null);
        const mutations = options.mutations;
        const actions = options.actions;
        forEachValue(mutations, (mutation, key) => {
            store._mutations[key] = (payload) => {
                mutation.call(store, store.state, payload)
            }
        })
        forEachValue(actions, (action, key) => {
            store._actions[key] = (payload) => {
                action.call(store, store, payload)
            }
        })
    }
    commit = (type, payload) => { //只能这么写（本质是通过bind进行了转义）
        this._mutations[type](payload)
    }
    dispatch = (type, payload) => {
        this._actions[type](payload)
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