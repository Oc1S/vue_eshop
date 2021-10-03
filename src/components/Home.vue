<template>
  <div>
    <h1>HOME</h1>
    <el-button type="danger" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
  },
}
</script>

<style lang="scss" scoped>
</style>