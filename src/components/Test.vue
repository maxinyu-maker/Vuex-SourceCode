<template>
  <div class="hello">
    <h3>state:{{$store.state.count}}:{{ count }}</h3>
    <h3>getter:{{$store.getters.doubleCount}}:{{ doubleCount }}:{{ amplifyCount }}</h3>
    <button @click="increment">mutations:+</button>
    <button @click="incrementIfOdd">incrementIfOdd</button>
    <button @click="incrementAsync">1slateradd</button>
  </div>
</template>

<script>

import { computed } from 'vue';
import { useStore } from '../vuex/index.js';
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

    const increment = ()=>{
      store.commit('increment', 1)
      store.commit('inNumber', 1)
    }
    const decrement = ()=>{
      store.commit('decrement', 1)
    }
    const incrementIfOdd = ()=>{
      store.dispatch('incrementIfOdd',10)
    }
    const incrementAsync = ()=>{
      store.dispatch('incrementAsync',10)
    }
    return {
        count,
        doubleCount,
        amplifyCount,
        increment,
        decrement,
        incrementIfOdd,
        incrementAsync,
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
