import { reactive, watch } from 'vue'
import { storeKey } from './injectKey'
import ModuleCollection from './module/module.collection'
import { forEachValue, isPromise } from './utils'
//创建一个容器，返回一个store

function getNestedState(state, path) { //根据路径 获取store上面的状态
    return path.reduce((state, key) => state[key], state)
}

function installModule(store, rootState, path, module) {
    let isRoot = !path.length;

    const namespaced = store._modules.getNamespaced(path)

    if (!isRoot) {
        let parentState = path.slice(0, -1).reduce((state, key) => state[key], rootState);
        parentState[path[path.length - 1]] = module.state
    }
    //getter  module._raw.getters
    module.forEachGetter((getter, key) => {
            store._wrappedGetters[namespaced + key] = () => {
                return getter(getNestedState(store.state, path)) //直接使用模块上自己的状态（module.state）不是响应式状态
            }
        })
        // mutation {add:[mutation]}
    module.forEachMutation((mutation, key) => {
            const entry = store._mutations[namespaced + key] || (store._mutations[namespaced + key] = [])
            entry.push((payload) => {
                mutation.call(store, getNestedState(store.state, path), payload)
            })
        })
        //actions 返回一个promise
    module.forEachAction((action, key) => {
            const entry = store._actions[namespaced + key] || (store._actions[namespaced + key] = []);
            entry.push((payload) => {
                let res = action.call(store, store, payload);
                // res 是不是一个promise
                if (!isPromise(res)) {
                    return Promise.resolve(res);
                }
                return res;
            })
        })
        //modules
    module.forEachChild((child, key) => {
        installModule(store, rootState, path.concat(key), child);
    })
}

function resetStoreState(store, state) {
    store._state = reactive({ data: state }); //store._state.data = 'xxxx'
    const wrappedGetters = store._wrappedGetters;
    store.getters = {};
    forEachValue(wrappedGetters, (getter, key) => {
        Object.defineProperty(store.getters, key, {
            get: getter,
            enumerable: true
        })
    })
    if (store.strict) {
        enableStrictMode(store)
    }
}

function enableStrictMode(store) {
    watch(() => store._state.data, () => { //监控数据变化，数据变化后执行回调函数
            console.assert(store._committing, '不允许在mutation之外更改state')
        }, { deep: true, flush: 'sync' }) //默认watch是异步的，改为同步监控
}


export default class Store {

    _withCommitting(fn) { //切片操作
        const committing = this._committing;
        this._committing = true;
        fn()
        this._committing = committing
    }
    constructor(options) {
        //{state,action, mutations,getters,modules}
        const store = this
        store._modules = new ModuleCollection(options);
        //发布订阅模式（把函数名订阅好，用函数名进行触发）
        store._wrappedGetters = Object.create(null);
        store._mutations = Object.create(null);
        store._actions = Object.create(null);

        store.strict = options.strict || false; //严格模式
        //判断是不是同步状态:mutation之前添加一个状态：committing：true;
        //调用mutation时更改状态（commiting：false），监控这个状态
        // 如果当前状态变化的时候commiting = true => 同步更改；否则异步更改
        store._committing = false;
        store._subscribers = []
            //定义状态
        const state = store._modules.root.state; //根状态
        installModule(store, state, [], store._modules.root)
        resetStoreState(store, state)

        options.plugins.forEach(plugin => plugin(store))

    }
    subscribe(fn) {
        this._subscribers.push(fn)
    }
    get state() {
        return this._state.data
    }
    commit = (type, payload) => {
        const entry = this._mutations[type] || [];
        this._withCommitting(() => {
            entry.forEach(handler => handler(payload))
        })
        this._subscribers.forEach(sub => sub({ type, payload }, this.state))
    }
    dispatch = (type, payload) => {
        const entry = this._actions[type] || [];
        return Promise.all(entry.map(handler => handler(payload)))
    }
    replaceState(newState) {
        //严格模式下不能直接修改状态
        this._withCommitting(() => {
            this._state.data = newState
        })
    }
    install(app, injectKey) {
        app.provide(injectKey || storeKey, this);
        app.config.globalProperties.$store = this;
    }
}

//module文件夹作用/ModuleCollection类作用
//格式化用户的参数，实现根据自己的需要，后续使用时方便
// root = {
//     _raw: rootModule,
//     state: rootModule.state,
//     _children: {
//         a: {
//             _raw: aModule,
//             state: aModule.state,
//             _children: {}
//         },
//         b: {
//             _raw: bModule,
//             state: bModule.state,
//             _children: {}
//         }
//     }
// }       }
//     }
// }