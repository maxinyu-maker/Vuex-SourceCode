<template>
  <div class="hello">
    <h3>state:{{$store.state.count}}:{{ count }}</h3>
    <h3>getter:{{$store.getters.doubleCount}}:{{ doubleCount }}:{{ amplifyCount }}</h3>
    <h3>module:(a:{{ number }};c:{{ number1 }}):b:{{ value }}</h3>
    <button @click="$store.state.count++">错误修改</button>
    <button @click="increment">mutations:+</button>
    <button @click="incrementIfOdd">incrementIfOdd</button>
    <button @click="incrementAsync">1slateradd</button>
        modules
    <button @click="a">a+</button>
    <button @click="b">b+</button>
    <button @click="c">c+</button>
  </div>
</template>

<script>

import { computed } from 'vue';
import { useStore } from '../vuex/index.js';
// import { useStore } from 'vuex';
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup(){
    const store = useStore();
    const count = computed(() => store.state.count);
    const doubleCount = computed(() => store.getters.doubleCount);
    const amplifyCount = computed(() => store.getters.amplifyCount(5));
    const number = computed(() => store.state.a.number);
    const number1 = computed(() => store.state.a.c.number1);
    const value = computed(() => store.state.b.value);

    const increment = ()=>{
      store.commit('increment', 1)
    }
    const decrement = ()=>{
      store.commit('decrement', 1)
    }
    const incrementIfOdd = ()=>{
      store.dispatch('incrementIfOdd',10).then(()=>{
        alert("aaaa")
      })
    }
    const incrementAsync = ()=>{
      store.dispatch('incrementAsync',10)
    }

    const a = ()=>{
      store.commit('a/increment',1)
      // console.log(store.commit)
    }
        const b = ()=>{
      store.commit('inValue',1)
    }
        const c = ()=>{
      store.commit('a/c/increment',1)
    }
    return {
        count,
        doubleCount,
        amplifyCount,
        number,
        number1,
        value,
        increment,
        decrement,
        incrementIfOdd,
        incrementAsync,
        a,
        b,
        c,
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
