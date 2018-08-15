<template>
  <div id="app">
    <my-header :seller="sellers"></my-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods" active-class="isActive">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller" active-class="isActive">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings" active-class="isActive">商家</router-link>
      </div>
    </div>
     <router-view :seller="sellers"></router-view>
  </div>
</template>

<script>
import myHeader from './view/header'
import {getSellerData} from './api/api.js'

export default {
  name: 'App',
  components:{
    myHeader
  },
  data () {
    return {
      names: 'left',
      sellers: {}
    }
  },
  methods: {
    //获取顶部数据
    getSellerData(){
      getSellerData().then((data) => {
        this.sellers = data.data;
      })
    }
  },
  mounted () {
    this.getSellerData();
  }
}
</script>

<style lang="less">
 #app 
   .tab{
     display: flex;
     width: 100%;
     height: 40px;
     line-height: 40px;
     border-bottom: 1px solid #e6e6e6;
    .tab-item{
        flex: 1;
        text-align: center;
        width: 100%;
        height: 40px;
        .isActive{
          color: #ef5d29
        }
    }
   }
</style>
