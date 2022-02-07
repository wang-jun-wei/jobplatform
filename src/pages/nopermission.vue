<template>
  <div id="nopermission">
    <div id="no">
      <!-- <router-link to="/login" tag="a" style="position:absolute;right:420px;top:215px;">返回登录</router-link> -->
    </div>
  </div>
</template>

<script>
</script>

<style scoped="scoped">
  #nopermission {
    height: 100%;
    background-color: #f1f1f1;
  }

  #no {
    width: 100%;
    height: 100%;
    position: relative;
    background: url(../assets/403.jpg) no-repeat center;
  }

  a {
    font-size: 14px;
    text-decoration: none;
    color: #2e58ff;
    opacity: .8;
  }

  a:hover {
    opacity: 1;
  }
</style>
