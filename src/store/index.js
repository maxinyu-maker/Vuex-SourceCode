import { createStore } from '../vuex/index.js';
// import { createStore } from 'vuex';

function customPlugin(store) {
    let local = localStorage.getItem('VUEX:STATE');
    if (local) {
        store.replaceState(JSON.parse(local));
    }
    store.subscribe((mutation, state) => { //每当状态发生变化（调用了mutation的时候 就会执行此回调）
        localStorage.setItem('VUEX:STATE', JSON.stringify(state))
    })
}

export default createStore({
    //根state对象，每个Vuex实例只有一个状态树
    strict: true, //严格模式，不允许用户在除了mutation意外以外方法修改state
    plugins: [ //会按照注册的顺序依次执行插件，执行时会将store传入
        customPlugin,
    ],
    state: {
        count: 0,
        name: '啦啦啦啦',
    },
    getters: {
        doubleCount: (state) => {
            return state.count * 2
        },
        amplifyCount: (state) => (multiple) => {
            return state.count * multiple
        }
    },
    mutations: {
        increment(state, payload) {
            state.count += payload
        },
        decrement(state, payload) {
            state.count -= payload
        },
    },
    actions: {
        incrementIfOdd({ commit, state }, payload) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    commit('increment', payload)
                    resolve()
                }, 1000)
            })
        },
        incrementAsync({ commit }, payload) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    commit('increment', payload)
                }, 1000)
            })
        }
    },
    modules: {
        a: {
            namespaced: true,
            state: {
                number: 5,
            },
            mutations: {
                increment(state, payload) {
                    state.number += payload
                },
                deNumber(state, payload) {
                    state.number -= payload
                },
            },
            modules: {
                c: {
                    namespaced: true,
                    state: {
                        number1: 5,
                    },
                    mutations: {
                        increment(state, payload) {
                            state.number1 += payload
                        },
                        deNumber(state, payload) {
                            state.number1 -= payload
                        },
                    },
                }
            }
        },
        b: {
            state: {
                value: 10,
            },
            mutations: {
                inValue(state, payload) {
                    state.value += payload
                },
                deValue(state, payload) {
                    state.value -= payload
                },
            },
        }
    }
})