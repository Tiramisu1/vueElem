<template>
    <section>
        <transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
            <div class="food" v-show="showFlag" ref="food">
                <div class="food-content">
                    <div class="image-header">
                        <img :src="food.image" alt="">
                        <div class="back" @click="hide">
                            <i class="iconfont icon-back"></i>
                        </div>
                    </div>
                    <div class="content">
                        <h1 class="title">{{food.name}}</h1>
                        <div class="detail">
                            <span class="sell-count">月售{{food.sellCount}}</span>
                            <span class="rating">好评率{{food.rating}}%</span>
                        </div>
                        <div class="price">
                            <span>￥{{food.price}}</span>
                            <span v-show="food.oldPrice !== ''" class="old-price">￥{{food.oldPrice}}</span>
                        </div>
                        <div class="contrl-wrapper">
                            <cartcontrol :food="food" @cartAdd="find"></cartcontrol>
                        </div>
                        <transition name="fade">
                            <div @click="addFirst" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
                        </transition>
                    </div>
                    <split v-show="food.info"></split>
                    <div class="info" v-show="food.info">
                        <h1 class="title">商品介绍</h1>
                        <p>{{food.info}}</p>
                    </div>
                    <split></split>
                    <div class="rating">
                        <h1 class="title">商品评价</h1>
                        <ratingSelect :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings" @selectRating="selectRating" @toggleRating="toggleRating"></ratingSelect>
                        <div class="rating-wrapper">
                            <ul v-show="food.ratings && food.ratings.length">
                                <li v-show="needShow(item.rateType, item.text)" v-for="(item, index) in food.ratings" :key="index" class="rating-item">
                                    <div class="user">
                                        <span class="name">{{item.username}}</span>
                                        <img :src="item.avatar" width="12" height="12" alt="">
                                    </div>
                                    <div class="time">{{item.rateTime | formatDate}}</div>
                                    <p class="text">
                                        <i :class="{'iconfont icon-ai45': item.rateType === 0,'iconfont icon-dianzan2': item.rateType === 1}"></i>
                                        {{item.text}}
                                    </p>
                                </li>
                            </ul>
                            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </section>
</template>
<script>
import BScroll from "better-scroll";
import cartcontrol from "./cartcontrol";
import Vue from "vue";
import split from "./split";
import ratingSelect from "./ratingSelect";
import { formateDate } from "../components/date.js";

// const POSITIVE = 0;
// const NEGATIVE = 0;
const ALL = 2;

export default {
    props: {
        food: {
            type: Object
        }
    },
    filters: {
        formatDate(time) {
            let date = new Date(time);
            return formateDate(date, "yyyy-MM-dd hh:mm");
        }
    },
    components: {
        BScroll,
        cartcontrol,
        split,
        ratingSelect
    },
    data() {
        return {
            showFlag: false,
            selectType: ALL,
            onlyContent: false,
            desc: {
                all: "全部",
                positive: "推荐",
                negative: "吐槽"
            }
        };
    },
    methods: {
        needShow(type, text) {
            if (this.onlyContent == true) {
               if (this.selectType === ALL && text != "") {
                   return true
               }else if (type == this.selectType && text != ""){
                   return true 
               }else {
                   return false
               }
            }else{
                if (this.selectType === ALL) {
                    return true
                }else{
                   return type === this.selectType
                }
            }
        },
        show() {
            this.showFlag = true;
            this.selectType = ALL;
            this.onlyContent = false;
            this.$nextTick(() => {
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs.food, {
                        click: true
                    });
                } else {
                    this.scroll.refresh();
                }
            });
        },
        hide() {
            this.showFlag = false;
        },
        addFirst(event) {
            if (!event._constructed) {
                //避免点击事件发生两次
                return;
            }
            this.$emit("foodAdd", event.target);
            Vue.set(this.food, "count", 1);
        },
        find(target) {
            if (!event._constructed) {
                //避免点击事件发生两次
                return;
            }
            this.$emit("foodAdd", target);
            this.food.count + 1;
        },
        selectRating(type) {
            this.selectType = type;
            this.$nextTick(() => {
                this.scroll.refresh();
            });
        },
        toggleRating(only) {
            this.onlyContent = only;
            this.$nextTick(() => {
                this.scroll.refresh();
            });
        }
    }
};
</script>
<style lang="less">
@import url(../assets/css/Animate.css);

.food {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 48px;
    z-index: 10;
    width: 100%;
    background: #ffffff;
    transition: all 0.2s;
    transform: translate3d(0, 0, 0);
    .food-content {
        // background: #ffffff;
        // position: relative;
        .image-header {
            position: relative;
            width: 100%;
            height: 0;
            padding-top: 100%; //使容器宽高相等
            img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            .back {
                position: absolute;
                top: 10px;
                left: 0;
                .icon-back {
                    display: block;
                    padding: 10px;
                    font-size: 20px;
                    color: #ffffff;
                }
            }
        }
        .content {
            padding: 18px 0px 0px 18px;
            position: relative;
            .title {
                font-size: 14px;
                font-weight: 700;
                color: rgb(7, 17, 27);
                line-height: 14px;
                margin-bottom: 8px;
            }
            .detail {
                line-height: 10px;
                font-size: 0;
                height: 10px;
                margin-bottom: 18px;
                .sell-count,
                .rating {
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                    line-height: 10px;
                }
                .sell-count {
                    margin-right: 12px;
                }
            }
            .price {
                padding-bottom: 18px;
                font-size: 14px;
                color: rgb(240, 20, 20);
                line-height: 24px;
                font-weight: 700;
                .old-price {
                    font-size: 10px;
                    margin-left: 4px;
                    color: rgb(147, 153, 159);
                    text-decoration: line-through;
                }
            }
            .contrl-wrapper {
                position: absolute;
                right: 12px;
                bottom: 12px;
            }
            .buy {
                position: absolute;
                right: 18px;
                bottom: 18px;
                z-index: 10;
                line-height: 24px;
                padding: 0 12px;
                box-sizing: border-box;
                border-radius: 12px;
                font-size: 10px;
                color: #ffffff;
                background: rgb(0, 160, 220);
                transition: all 0.4s;
                opacity: 1;
                &.fade-enter,
                &.fade-leave {
                    opacity: 0;
                }
            }
        }
        .info {
            padding: 18px;
            .title {
                font-size: 14px;
                font-weight: 400;
                color: rgb(7, 17, 27);
                line-height: 14px;
                margin-bottom: 6px;
            }
            p {
                font-size: 12px;
                font-weight: 200;
                color: rgb(77, 85, 93);
                line-height: 24px;
                margin-left: 8px;
            }
        }
        .rating {
            padding-top: 18px;
            .title {
                font-size: 14px;
                font-weight: 400;
                color: rgb(7, 17, 27);
                line-height: 14px;
                margin-left: 18px;
            }
            .rating-wrapper {
                padding: 0 18px;
                .rating-item {
                    position: relative;
                    padding: 16px 0;
                    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
                    .user {
                        position: absolute;
                        right: 0;
                        top: 16px;
                        font-size: 0;
                        line-height: 12px;
                        .nam-e {
                            display: inline-block;
                            vertical-align: top;
                            font-size: 10px;
                            margin-right: 6px;
                            color: rgb(147, 153, 159);
                        }
                        img {
                            border-radius: 50%;
                        }
                    }
                    .time {
                        line-height: 12px;
                        font-size: 10px;
                        color: rgb(147, 153, 159);
                    }
                    .text {
                        line-height: 16px;
                        font-size: 12px;
                        color: rgb(7, 17, 27);
                        .icon-ai45,
                        .icon-dianzan2 {
                            margin-right: 4px;
                            line-height: 24px;
                            font-size: 12px;
                        }
                        .icon-ai45 {
                            color: rgb(0, 160, 220);
                        }
                        .icon-dianzan2 {
                            color: rgb(147, 153, 159);
                        }
                    }
                }
                .no-rating {
                    padding: 16px 0;
                    font-size: 12px;
                    color: rgb(147, 153, 159);
                }
            }
        }
    }
}
</style>


