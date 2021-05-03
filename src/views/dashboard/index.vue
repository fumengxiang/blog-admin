<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name:{{ name }}, age:{{ age }} </div>
  </div>
</template>

<script>
import api from '@/api/test'

export default {
  name: 'Dashboard',
  data() {
    return {
      name: '',
      age: 0
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 定义拉取数据的函数
    fetchData() {
      api.test().then(res => {
        // console.log(res)
        this.name = res.data.name
        this.age = res.data.age
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
