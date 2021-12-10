import { createStore } from 'vuex'

export default createStore({
    //根state对象，每个Vuex实例只有一个状态树
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
            if ((state.count + 1) % 2 === 0) {
                commit('increment', payload)
            }
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
            state: {
                number: 5,
            },
            mutations: {
                inNumber(state, payload) {
                    state.number += payload
                },
                deNumber(state, payload) {
                    state.number -= payload
                },
            },
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