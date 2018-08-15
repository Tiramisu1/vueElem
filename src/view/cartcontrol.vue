<template>
    <div class="cartcontrol">
        <transition name="move">
            <div class="cart-decrese" @click.stop.prevent="decreseCount" v-show="food.count > 0">
                <span class="iconfont inner">&#xe656;</span>
            </div>
        </transition>
        <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
        <div class="cart-add iconfont" @click.stop.prevent="addCart">&#xe621;</div>
    </div>
</template>
<script>
import Vue from "vue";
export default {
    props: {
        food: {
            type: Object
        }
    },
    methods: {
        addCart(event) {
            if (!event._constructed) {
                //避免PC发生两次点击事件
                return;
            }
            if (!this.food.count) {
                Vue.set(this.food, "count", 1);     //添加属性，能观测到
                // this.food.count = 1            // 添加属性，不能被监测到
            } else {
                this.food.count++;
            }
            this.$emit('cartAdd', event.target);  //向父组件good.vue传入事件cart.add
        },
        decreseCount() {
            if (!event._constructed) {
                //避免PC发生两次点击事件
                return;
            }
            if (this.food.count) {
                this.food.count--;
            }
        }
    }
};
</script>
<style lang="less">
@import url(../assets/css/Animate.css);

.cartcontrol {
    font-size: 0;
    .cart-decrese {
        display: inline-block;
        padding: 6px;
        transition: all 0.4s linear;
        .inner {
            display: inline-block;
            font-size: 24px;
            line-height: 24px;
            color: rgb(0, 160, 220);
            transition: all 0.4s linear;
            transform: rotate(0);
        }
        &.move-enter-active, &.move-leave-active {
            opacity: 0;
            transform: translate3d(24px, 0, 0);
            .inner {
                transform: rotate(360deg);
            }
        } 
    }
    .cart-count {
        display: inline-block;
        vertical-align: top;
        width: 12px;
        padding-top: 6px;
        line-height: 24px;
        text-align: center;
        font-size: 10px;
        color: rgb(147, 153, 159);
    }
    .cart-add {
        display: inline-block;
        font-size: 24px;
        line-height: 24px;
        padding: 6px;
        color: rgb(0, 160, 220);
    }
}
</style>


