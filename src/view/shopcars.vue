<template>
    <div class="shopcars">
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'hightlight': totalCount > 0}">
                        <i class="iconfont shopping-car" :class="{'hightlight': totalCount> 0}">&#xe613;</i>
                    </div>
                    <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
                </div>
                <div class="price" :class="{'heightlight': totalPrice>0}">￥{{totalPrice}}</div>
                <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
            </div>
            <!-- @click.stop.prevent阻止默认事件冒泡 -->
            <div class="content-right" @click.stop.prevent="pay">
                <div class="pay" :class="{'enough': totalPrice >= minPrice}">
                    {{payDesc}}
                </div>
            </div>
        </div>
        <div class="ball-container">
            <div v-for="(ball, index) in balls" :key="index">
                <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
                    <div v-show="ball.show" class="ball">
                        <div class="inner inner-hook"></div>
                    </div>
                </transition>
            </div>
        </div>
        <transition name="fold">
            <div class="shopcart-list" v-show="listShow">
                <div class="list-header">
                    <h1 class="title">购物车</h1>
                    <span class="empty" @click="empty">清空</span>
                </div>
                <div class="list-content" ref="listContent">
                    <ul>
                        <li class="food" v-for="(item, index) in selectFoods" :key="index">
                            <span class="name">{{item.name}}</span>
                            <div class="price">
                                <span>￥{{item.price}}</span>
                            </div>
                            <div class="cart-wrapper">
                                <cartcontrol :food="item" @cartAdd="findCart"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div class="list-mask" @click="hideList" v-show="listShow"></div>
        </transition>
    </div>
</template>
<script>
import cartcontrol from "./cartcontrol";
import BScroll from "better-scroll";

export default {
    props: {
        deliveryPrice: {
            type: Number,
            default: 0
        },
        minPrice: {
            type: Number,
            default: 0
        },
        selectFoods: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    components: {
        cartcontrol,
        BScroll
    },
    data() {
        return {
            balls: [
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                }
            ],
            dropBalls: [],
            fold: true
        };
    },
    computed: {
        totalPrice() {
            let total = 0;
            this.selectFoods.forEach(food => {
                total += food.price * food.count;
            });
            return total;
        },
        totalCount() {
            let count = 0;
            this.selectFoods.forEach(food => {
                count += food.count;
            });
            return count;
        },
        payDesc() {
            if (this.totalPrice === 0) {
                return `￥${this.minPrice}元起送`;
            } else if (this.totalPrice < this.minPrice) {
                let price = this.minPrice - this.totalPrice;
                return `还差￥${price}元起送`;
            } else {
                return "去结算";
            }
        },
        listShow() {
            if (this.totalCount === 0) {
                this.fold = true;
                return false;
            }
            let show = !this.fold;
            if (show) {
                this.$nextTick(() => {
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.listContent, {
                            click: true
                        });
                    } else {
                        this.scroll.refresh();
                    }
                });
            }
            return show;
        }
    },
    methods: {
        drop(el) {
            //触发一次事件就会将所有小球进行遍历
            for (let i = 0; i < this.balls.length; i++) {
                let ball = this.balls[i];
                if (ball.show === false) {
                    ball.show = true;
                    ball.el = el; //设置小球的el属性为一个dom对象
                    this.dropBalls.push(ball);
                    return; //此处return终结函数,这意味着每次触发事件,dropBalls内只增加一个ball
                }
            }
        },
        beforeEnter(el) {
            let count = this.balls.length;
            while (count--) {
                let ball = this.balls[count];
                if (ball.show) {
                    let rect = ball.el.getBoundingClientRect(); //获取元素的位置
                    let x = rect.left - 32; //小球掉落X轴起点
                    let y = -(window.innerHeight - rect.top - 22); //小球掉落Y轴起点,向下为负
                    el.style.display = "";
                    el.style.webkitTransform = `translate3d(0, ${y}px,0)`; /* Safari 和 Chrome */
                    el.style.transform = `translate3d(0, ${y}px,0)`; //旋转div元素
                    // 处理内层动画
                    let inner = el.getElementsByClassName("inner-hook")[0];
                    inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
                    inner.style.transform = `translate3d(${x}px,0,0)`;
                }
            }
        },
        enter(el, done) {
            //关闭ESlint语法监测，因为ES6语言规范会让被申明却未被调用的变量报错
            /* eslint-disable no-unused-vars */
            let rf = el.offsetHeight; //申明rf是为了触发浏览器的重排
            this.$nextTick(() => {
                //修改数据之后立即使用这个方法，获取更新后的 DOM。
                el.style.webkitTransform =
                    "translate3d(0, 0, 0)"; /* Safari 和 Chrome */
                el.style.transform = "translate3d(0, 0, 0)"; //旋转div元素
                let inner = el.getElementsByClassName("inner-hook")[0];
                inner.style.webkitTransform = "translate3d(0, 0, 0)";
                inner.style.transform = "translate3d(0, 0, 0)";
                el.addEventListener("transitionend", done); //Vue为了知道过渡的完成，否则无法进入到afterEnter中
            });
        },
        afterEnter(el) {
            let ball = this.dropBalls.shift(); //把数组的第一个元素从其中删除，并返回第一个元素的值。
            if (ball) {
                ball.show = false;
                el.style.display = "none"; //隐藏小球
            }
        },
        toggleList() {
            if (!this.totalCount) {
                return;
            }
            this.fold = !this.fold;
        },
        empty() {
            this.selectFoods.forEach(food => {
                food.count = 0;
            });
        },
        hideList() {
            this.fold = true;
        },
        pay() {
            if (this.totalPrice < this.minPrice) {
                return;
            }
            window.alert(`需要支付${this.totalPrice}元`);
        },
        findCart(target){
            this.$emit('cartFind', target)
        }
    }
};
</script>
<style lang="less">
@import url(../assets/css/Animate.css);

.shopcars {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 20;
    width: 100%;
    height: 48px;
    .content {
        display: flex;
        background: #141d27;
        font-size: 0;
        .content-left {
            flex: 1;
            .logo-wrapper {
                display: inline-block;
                position: relative;
                top: -10px;
                margin: 0 12px;
                padding: 6px;
                width: 56px;
                height: 56px;
                box-sizing: border-box;
                vertical-align: top;
                border-radius: 50%;
                background: #141d27;
                text-align: center;
                .logo {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: #2b343c;
                    &.hightlight {
                        background: rgb(0, 160, 220);
                    }
                    .shopping-car {
                        font-size: 24px;
                        color: #80858a;
                        line-height: 44px;
                        &.hightlight {
                            color: #ffffff;
                        }
                    }
                }
                .num {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 24px;
                    height: 16px;
                    line-height: 16px;
                    text-align: center;
                    font-size: 9px;
                    font-weight: 700;
                    border-radius: 16px;
                    background: rgb(240, 20, 20);
                    color: #ffffff;
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
                }
            }
            .price {
                display: inline-block;
                vertical-align: top;
                line-height: 24px;
                margin-top: 12px;
                box-sizing: border-box;
                padding-right: 12px;
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                font-size: 16px;
                font-weight: 700;
                color: rgba(255, 255, 255, 0.4);
                &.heightlight {
                    color: #ffffff;
                }
            }
            .desc {
                display: inline-block;
                vertical-align: top;
                margin-left: 12px;
                line-height: 48px;
                color: rgba(255, 255, 255, 0.4);
                font-size: 12px;
                font-weight: 200;
            }
        }
        .content-right {
            flex: 0 0 105px;
            width: 105px;
            text-align: center;
            background: #2b343c;
            .pay {
                height: 48px;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.4);
                font-weight: 700;
                line-height: 48px;
                &.enough {
                    background: #00b43c;
                    color: #ffffff;
                }
            }
        }
    }
    .ball-container {
        .ball {
            position: fixed;
            left: 32px;
            bottom: 22px;
            z-index: 200;
            transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.14); //贝塞尔曲线
            .inner {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: rgb(0, 160, 220);
                transition: all 0.4s linear;
            }
        }
    }
    .shopcart-list {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        transition: all 0.5s;
        transform: translate3d(0, -100%, 0);
        &.fold-enter,
        &.fold-leave {
            transform: translate3d(0, 0, 0);
        }
        .list-header {
            height: 40px;
            line-height: 40px;
            padding: 0 18px;
            background: #f3f5f7;
            border-bottom: 1px solid rgba(7, 17, 27, 0.1);
            .title {
                float: left;
                color: rgb(7, 17, 27);
                font-size: 14px;
            }
            .empty {
                float: right;
                font-size: 12px;
                color: rgb(0, 160, 220);
            }
        }
        .list-content {
            padding: 0 18px;
            max-height: 217px;
            background: #ffffff;
            overflow: hidden;
            .food {
                position: relative;
                height: 48px;
                padding: 12px 0;
                box-sizing: border-box;
                background: #ffffff;
                border-bottom: 1px solid rgba(7, 17, 27, 0.1);
                .name {
                    line-height: 24px;
                    font-size: 14px;
                    color: rgb(7, 17, 27);
                }
                .price {
                    position: absolute;
                    right: 90px;
                    bottom: 12px;
                    line-height: 24px;
                    font-size: 14px;
                    font-weight: 700;
                    color: rgb(240, 20, 20);
                }
                .cart-wrapper {
                    position: absolute;
                    right: 0;
                    bottom: 6px;
                }
            }
        }
    }
    .list-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -10;
        // backdrop-filter: blur(10px);
        transition: all 0.5s;
        opacity: 1;
        background: rgba(7, 17, 27, 0.6);
    }
}
</style>


