<template>
  <div class="hello">
    <TestBoostrapAlert></TestBoostrapAlert>
  </div>
</template>

<script>
import TestBoostrapAlert from '@/pages/demos/TestBoostrapAlert';
export default {
  name: 'HelloWorld',
  components:{TestBoostrapAlert},
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello{
  overflow-y: auto;
}
h1, h2 {
  font-weight: normal;
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
