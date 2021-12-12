<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld/>
    <Test></Test>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Test from '@/components/Test.vue'
export default {
  name: 'Home',
  components: {
    HelloWorld,
    Test
  }
}
</script>
