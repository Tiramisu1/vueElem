<template>
    <section>
        <div class="ratings" ref="ratings">
            <div class="ratings-content">
                <div class="overview">
                    <div class="overview-left">
                        <h1 class="score">{{seller.score}}</h1>
                        <div class="title">综合评分</div>
                        <div class="rank">高于周边商家{{seller.rankRate}}%</div>
                    </div>
                    <div class="overview-right">
                        <div class="score-wrapper">
                            <span class="title">服务态度</span>
                            <star :size="36" :score="seller.serviceScore" class="star"></star>
                            <span class="score">{{seller.serviceScore}}</span>
                        </div>
                        <div class="score-wrapper">
                            <span class="title">商品评分</span>
                            <star :size="36" :score="seller.foodScore" class="star"></star>
                            <span class="score">{{seller.foodScore}}</span>
                        </div>
                        <div class="score-wrapper">
                            <span class="title">送达时间</span>
                            <span class="time">{{seller.deliveryTime}}分钟</span>
                        </div>
                    </div>
                </div>
                <split></split>
                <ratingSelect :selectType="selectType" :onlyContent="onlyContent" :ratings="ratings"></ratingSelect>
                <div class="rating-wrapper">
                    <ul>
                        <li v-show="needShow(item.rateType, item.text)" v-for="(item, index) in ratings" :key="index" class="rating-item">
                            <span>{{item.show}}</span>
                            <div class="avatar">
                                <img width="28" height="28" :src="item.avatar" alt="">
                            </div>
                            <div class="content">
                                <h1 class="name">{{item.username}}</h1>
                                <div class="star-wrapper">
                                    <star :size="24" :score="item.score" class="star"></star>
                                    <span class="delivery" v-show="item.deliveryTime">{{item.deliveryTime}}分钟送达</span>
                                </div>
                                <p class="text">{{item.text}}</p>
                                <div class="icon">
                                    <i :class="{'iconfont icon-ai45': item.rateType === 0,'iconfont icon-dianzan2': item.rateType === 1}"></i>
                                    <span v-for="(food, num) in item.recommend" :key="num" class="foodbox">{{food}}</span>
                                </div>
                                <div class="time">{{item.rateTime | formatDate}}</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</template> 
<script>
import star from "./star";
import split from "./split";
import ratingSelect from "./ratingSelect";
import { getRatingsData } from "../api/api.js";
import { formateDate } from "../components/date.js";
import BScroll from "better-scroll";
import Vue from 'vue'

const All = 2;

export default {
    props: {
        seller: {
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
        star,
        split,
        ratingSelect,
        BScroll
    },
    created() {
        getRatingsData().then(data => {
            this.ratings = data.data;
            this.ratings.forEach(item => {
                item.show = true;
            });
            this.$nextTick(() => {
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs.ratings, {
                        click: true
                    });
                } else {
                    this.scroll.refresh();
                }
            });
        });
    },
    data() {
        return {
            ratings: [],
            showFlag: false,
            selectType: 2,
            onlyContent: false
        };
    },
    methods: {
          needShow(type, text) {
            if (this.onlyContent && !text) {
                return false
            }
            if (this.selectType === 2) {
                return true
            }else {
                return type === this.selectType
            }
        }
    }
};
</script>
<style lang="less">
.ratings {
    position: absolute;
    top: 174px;
    left: 0;
    bottom: 0px;
    width: 100%;
    overflow: hidden;
    .overview {
        display: flex;
        padding: 18px 0;
        .overview-left {
            width: 130px;
            flex: 0 0 137px;
            padding: 6px 0;
            border-right: 1px solid rgba(7, 17, 27, 0.1);
            text-align: center;
            @media only screen and (max-width: 320px) {
                // 当当前设备宽度小于320px时（iPhone5）修改该元素的样式
                flex: 0 0 120px;
                width: 120px;
            }
            .score {
                font-size: 24px;
                color: rgb(255, 153, 0);
                line-height: 28px;
                margin-bottom: 6px;
            }
            .title {
                font-size: 12px;
                color: rgb(7, 17, 27);
                line-height: 12px;
                margin-bottom: 8px;
            }
            .rank {
                font-size: 10px;
                color: rgb(147, 153, 159);
                line-height: 10px;
            }
        }
        .overview-right {
            flex: 1;
            padding-left: 24px;
            @media only screen and (max-width: 320px) {
                padding-left: 6px;
            }
            .score-wrapper {
                line-height: 18px;
                margin-bottom: 8px;
                font-size: 0;
                .title {
                    display: inline-block;
                    vertical-align: top;
                    font-size: 12px;
                    color: rgb(7, 17, 27);
                    line-height: 18px;
                }
                .star {
                    display: inline-block;
                    margin-left: 6px;
                    vertical-align: top;
                }
                .score {
                    display: inline-block;
                    vertical-align: top;
                    margin-left: 12px;
                    font-size: 12px;
                    color: rgb(255, 153, 0);
                    line-height: 18px;
                }
                .time {
                    display: inline-block;
                    vertical-align: top;
                    margin-left: 12px;
                    font-size: 12px;
                    line-height: 18px;
                    color: rgb(147, 153, 159);
                }
            }
        }
    }
    .rating-wrapper {
        padding: 0 18px;
        .rating-item {
            display: flex;
            padding: 18px 0 13px 0;
            border-bottom: 1px solid rgba(7, 17, 27, 0.1);
            .avatar {
                flex: 0 0 28px;
                margin-right: 12px;
                img {
                    border-radius: 50%;
                }
            }
            .content {
                flex: 1;
                position: relative;
                .name {
                    font-size: 10px;
                    line-height: 12px;
                    color: rgb(7, 17, 27);
                    margin-bottom: 4px;
                }
                .star-wrapper {
                    margin-bottom: 6px;
                    font-size: 0;
                    .star {
                        display: inline-block;
                        vertical-align: top;
                        margin-right: 6px;
                    }
                    .delivery {
                        display: inline-block;
                        vertical-align: top;
                        line-height: 12px;
                        font-size: 10px;
                        font-weight: 200;
                        color: rgb(147, 153, 159);
                    }
                }
                .text {
                    margin-bottom: 8px;
                    line-height: 18px;
                    font-size: 12px;
                    color: rgb(7, 17, 27);
                }
                .icon {
                    font-size: 0;
                    .icon-ai45,
                    .icon-dianzan2 {
                        display: inline-block;
                        vertical-align: top;
                        margin-right: 8px;
                        line-height: 16px;
                        font-size: 12px;
                    }
                    .icon-ai45 {
                        color: rgb(0, 160, 220);
                    }
                    .icon-dianzan2 {
                        color: rgb(147, 153, 159);
                    }
                    .foodbox {
                        display: inline-block;
                        vertical-align: top;
                        padding: 0 6px;
                        line-height: 16px;
                        margin-right: 8px;
                        font-size: 8px;
                        color: rgb(147, 153, 159);
                        border: 1px solid rgba(7, 17, 27, 0.1);
                        border-radius: 2px;
                        margin-bottom: 5px;
                    }
                }
                .time {
                    position: absolute;
                    top: 0;
                    right: 0;
                    line-height: 12px;
                    font-size: 10px;
                    font-weight: 200;
                    color: rgb(147, 153, 159);
                }
            }
        }
    }
}
</style>

